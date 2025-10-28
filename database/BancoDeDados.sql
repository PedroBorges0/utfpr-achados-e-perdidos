-- Limpeza 
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS itens CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS localizacoes CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS status_itens CASCADE;

-- Exclui o tipo ENUM
DROP TYPE IF EXISTS tipo_usuario;

-- Exclui as funções (opcional, mas limpa o ambiente)
DROP FUNCTION IF EXISTS atualizar_updated_at;
DROP FUNCTION IF EXISTS registrar_log_item;

-- O RESTANTE DO SEU CÓDIGO COMEÇA AQUI (CREATE TYPE, CREATE TABLE, etc.)


CREATE TYPE tipo_usuario AS ENUM ('aluno', 'professor', 'funcionario', 'visitante');

CREATE TABLE status_itens (
  id_status SERIAL PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL UNIQUE,
  cor_hex VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
  id_categoria SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE localizacoes (
  id_localizacao SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  tipo tipo_usuario NOT NULL DEFAULT 'aluno',
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens (
  id_item SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  caracteristicas TEXT,
  id_categoria INT NOT NULL,
  id_localizacao_encontrado INT NOT NULL,
  id_status INT NOT NULL DEFAULT 1,
  id_usuario_cadastrou INT NOT NULL,
  id_usuario_claim INT,
  data_encontrado DATE NOT NULL,
  data_claim DATE,
  data_devolucao DATE,
  imagem VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_item_categoria 
  FOREIGN KEY (id_categoria) 
  REFERENCES categorias(id_categoria) 
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_item_localizacao 
  FOREIGN KEY (id_localizacao_encontrado) 
  REFERENCES localizacoes(id_localizacao) 
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_item_status 
  FOREIGN KEY (id_status) 
  REFERENCES status_itens(id_status) 
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_usuario_cadastrou 
  FOREIGN KEY (id_usuario_cadastrou) 
  REFERENCES usuarios(id_usuario) 
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_usuario_claim 
  FOREIGN KEY (id_usuario_claim) 
  REFERENCES usuarios(id_usuario) 
  ON UPDATE CASCADE,
  
  CONSTRAINT chk_data_encontrado_futuro 
  CHECK (data_encontrado <= CURRENT_DATE),
  
  CONSTRAINT chk_data_claim_valida 
  CHECK (data_claim IS NULL OR data_claim >= data_encontrado)
);

CREATE TABLE logs (
  id_log SERIAL PRIMARY KEY,
  id_item INT NOT NULL,
  id_usuario INT NOT NULL,
  acao VARCHAR(50) NOT NULL,
  observacao TEXT,
  data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_log_item 
  FOREIGN KEY (id_item) 
  REFERENCES itens(id_item) 
  ON DELETE CASCADE,
  
  CONSTRAINT fk_log_usuario 
  FOREIGN KEY (id_usuario) 
  REFERENCES usuarios(id_usuario) 
  ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_status_itens
BEFORE UPDATE ON status_itens
FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trigger_update_categorias
BEFORE UPDATE ON categorias
FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trigger_update_localizacoes
BEFORE UPDATE ON localizacoes
FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trigger_update_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trigger_update_itens
BEFORE UPDATE ON itens
FOR EACH ROW EXECUTE FUNCTION atualizar_updated_at();

CREATE OR REPLACE FUNCTION registrar_log_item()
RETURNS TRIGGER AS $$
DECLARE
  acao_texto VARCHAR(50);
BEGIN
  IF TG_OP = 'INSERT' THEN
    acao_texto := 'cadastrou';
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.data_claim IS NOT NULL AND OLD.data_claim IS NULL THEN
      acao_texto := 'reivindicou';
    ELSIF NEW.data_devolucao IS NOT NULL AND OLD.data_devolucao IS NULL THEN
      acao_texto := 'devolveu';
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  INSERT INTO logs (id_item, id_usuario, acao, observacao)
  VALUES (
    NEW.id_item,
    COALESCE(NEW.id_usuario_claim, NEW.id_usuario_cadastrou),
    acao_texto,
    'Ação registrada automaticamente via trigger.'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_item
AFTER INSERT OR UPDATE ON itens
FOR EACH ROW EXECUTE FUNCTION registrar_log_item();

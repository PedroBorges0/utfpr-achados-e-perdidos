# Sistema de Cadastro/Login de Usuários

Este projeto tem como objetivo desenvolver uma aplicação web com sistema de autenticação de usuários (cadastro e login).  
O processo começou pelo design no Figma, seguido pela definição da stack tecnológica (frontend, backend e banco de dados) e desenvolvimento colaborativo.  

A organização das tarefas é feita via GitHub Projects, para garantir clareza e acompanhamento do progresso da equipe.  

---

## Sobre o Projeto
A aplicação terá como funcionalidades principais:  
- Tela de login de usuários (email + senha)  
- Tela de cadastro de novos usuários (nome, email, senha, confirmação de senha)  
- Recuperação de senha ("esqueci minha senha")  
- Estrutura responsiva (desktop e mobile)  
- Integração futura com banco de dados para persistência de usuários  

---

## Protótipo no Figma
As telas do projeto estão sendo desenhadas no Figma.  
Futuro Link será exibido aqui: ()

---

## Stack Tecnológica
A stack foi definida considerando escalabilidade, facilidade de aprendizado e suporte da comunidade:  

- **Frontend:** Next.js  
- **Backend:** Node.js (Express),
- **Banco de Dados:** PostgreSQL
- **Design:** Figma  
- **Containerização:** Docker  

---

## Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+  
- [PostgreSQL](https://www.postgresql.org/) ou [MongoDB](https://www.mongodb.com/)  
- [Git](https://git-scm.com/)  
- [Docker](https://www.docker.com/)  

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# Entre no diretório do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente no arquivo .env

# Rode o backend
npm run dev

# Abra outro terminal e vá para o frontend
cd frontend

# Instale as dependências
npm install

# Rode o frontend
npm run dev

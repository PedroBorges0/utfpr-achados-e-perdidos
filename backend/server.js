require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

console.log(' Iniciando servidor...');

// --- Importação das rotas ---
const usuarioRoutes = require('./routes/usuarioRoutes');
const itemRoutes = require('./routes/itemRoutes'); 
const categoriaRoutes = require('./routes/categoriaRoutes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');
const statusRoutes = require('./routes/statusRoutes');

// --- LOGS DE DEBUG DAS ROTAS ---
console.log(' DEBUG ROTAS ---');
console.log('usuarioRoutes:', typeof usuarioRoutes);
console.log('itemRoutes:', typeof itemRoutes);
console.log('categoriaRoutes:', typeof categoriaRoutes);
console.log('localizacaoRoutes:', typeof localizacaoRoutes);
console.log('statusRoutes:', typeof statusRoutes);
console.log('-------------------');

// --- Banco de dados e seed ---
const sequelize = require('./db/database');
const seedDatabase = require('./db/seed'); // Seed automático

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Carregamento dos modelos ---
require('./models/Usuario');
require('./models/Categoria');
require('./models/Localizacao');
require('./models/StatusItem');
require('./models/Item');

// --- Rotas principais ---
app.get('/', (req, res) => res.send('API de Achados e Perdidos está funcionando!'));

// Log para identificar carregamento de cada rota
try {
  app.use('/api/usuarios', usuarioRoutes);
  console.log(' /api/usuarios carregada com sucesso');
} catch (e) {
  console.error(' Erro ao carregar /api/usuarios:', e.message);
}

try {
  app.use('/api/itens', itemRoutes);
  console.log(' /api/itens carregada com sucesso');
} catch (e) {
  console.error(' Erro ao carregar /api/itens:', e.message);
}

try {
  app.use('/api/categorias', categoriaRoutes);
  console.log(' /api/categorias carregada com sucesso');
} catch (e) {
  console.error(' Erro ao carregar /api/categorias:', e.message);
}

try {
  app.use('/api/localizacoes', localizacaoRoutes);
  console.log(' /api/localizacoes carregada com sucesso');
} catch (e) {
  console.error(' Erro ao carregar /api/localizacoes:', e.message);
}

try {
  app.use('/api/statusitens', statusRoutes);
  console.log(' /api/statusitens carregada com sucesso');
} catch (e) {
  console.error(' Erro ao carregar /api/statusitens:', e.message);
}

// --- Servir imagens (uploads) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Função de conexão com retry ---
async function connectWithRetry(retries = 20, delayMs = 3000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await sequelize.authenticate();
      console.log(' Conectado ao PostgreSQL com sucesso!');
      return;
    } catch (err) {
      attempt++;
      console.warn(` Falha ao conectar ao PostgreSQL (tentativa ${attempt}/${retries}). Retentando em ${delayMs / 1000}s...`);
      console.warn(err.message || err);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error(' Não foi possível conectar ao PostgreSQL após múltiplas tentativas.');
}

// --- Inicialização do servidor ---
async function startServer() {
  try {
    await connectWithRetry();
    await sequelize.sync();
    console.log(' Modelos sincronizados com o banco de dados.');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
      console.log(' Seed automático executado.');
    });
  } catch (err) {
    console.error(' Erro ao iniciar o servidor:', err.message || err);
    process.exit(1);
  }
}

startServer();
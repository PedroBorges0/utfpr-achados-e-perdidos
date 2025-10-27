require('dotenv').config(); 

const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const itemRoutes = require('./routes/itemroutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');

const sequelize = require('./db/database'); 
const app = express();

const PORT = process.env.PORT || 4000;

// ===================================
// ORDEM CORRETA DOS MIDDLEWARES
// ===================================
// 1. CORS: Permite requisições externas (deve vir cedo)
app.use(cors()); 
// 2. JSON Parser: Lê o corpo JSON das requisições (ESSENCIAL VIR ANTES DAS ROTAS)
app.use(express.json()); 
// ===================================

// CARREGAMENTO DOS MODELOS (pode vir antes ou depois dos middlewares)
require('./models/Usuario');
require('./models/Categoria');
require('./models/Localizacao');
require('./models/StatusItem');
// require('./models/Item'); 

// ===================================
// CONFIGURAÇÃO DAS ROTAS (DEPOIS dos middlewares de parsing)
// ===================================
app.get('/', (req, res) => res.send('API de Achados e Perdidos está funcionando!'));
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/itens', itemRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/localizacoes', localizacaoRoutes);
// ===================================

// Função de retry para conectar ao DB (mantida igual)
async function connectWithRetry(retries = 20, delayMs = 3000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conectado ao PostgreSQL com sucesso!');
      return;
    } catch (err) {
      attempt++;
      console.warn(`❌ Falha ao conectar ao PostgreSQL (tentativa ${attempt}/${retries}). Retentando em ${delayMs/1000}s...`);
      console.warn(err.message || err);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Não foi possível conectar ao PostgreSQL após múltiplas tentativas.');
}

// Função para iniciar o servidor (mantida igual)
async function startServer() {
  try {
    await connectWithRetry();
    await sequelize.sync(); 
    console.log('✅ Modelos sincronizados com o banco de dados.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err.message || err);
    process.exit(1);
  }
}

startServer();
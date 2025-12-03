
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;


const usuarioRoutes = require('./routes/usuarioRoutes');
const itemRoutes = require('./routes/itemRoutes'); 
const categoriaRoutes = require('./routes/categoriaRoutes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');
const statusRoutes = require('./routes/statusRoutes');


const sequelize = require('./db/database');
const seedDatabase = require('./db/seed'); 

app.use(express.json());
app.use(cors());

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

require('./models/Usuario');
require('./models/Categoria');
require('./models/Localizacao');
require('./models/StatusItem');
require('./models/Item');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/itens', itemRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/localizacoes', localizacaoRoutes);
app.use('/api/statusitens', statusRoutes);

app.get('/', (req, res) => res.send('API de Achados e Perdidos está funcionando!'));

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
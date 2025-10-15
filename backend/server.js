// backend/server.js
require('dotenv').config(); // Carrega as variáveis de ambiente

const express = require('express');
const usuarioRoutes = require('./routes/usuarioRoutes');
const itemRoutes = require('./routes/itemRoutes'); // IMPORTA AS ROTAS DE ITEM
const sequelize = require('./db/database'); 
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

// --- GARANTIA DE CARREGAMENTO DOS MODELOS ---
// O Node.js precisa ler estes arquivos para carregar as associações.
require('./models/Usuario');
require('./models/Categoria');
require('./models/Localizacao');
require('./models/StatusItem');
// O MODELO ITEM FOI COMENTADO PARA EVITAR O ERRO DE SYNC/REFERENCES
// require('./models/Item'); 
// ---------------------------------------------

// Bloco de código para autenticação e sincronização
// backend/server.js

// ... (parte dos imports)

// --- BLOCO DE CONEXÃO LIMPO (SEM SYNC) ---
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao PostgreSQL!');
    })
    .catch(err => {
        console.error('Erro fatal: Conexão com PostgreSQL falhou:', err);
    });

// ... (restante do código com app.get, app.use, app.listen)
  
app.get('/', (req, res) => {
  res.send('API de Achados e Perdidos está funcionando!');
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/itens', itemRoutes); // USA AS ROTAS DE ITEM

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// backend/server.js (VERSÃO FINAL E COMPLETA)
require('dotenv').config(); // Carrega as variáveis de ambiente

const express = require('express');
const cors = require('cors'); // Middleware CORS
const usuarioRoutes = require('./routes/usuarioRoutes');
const itemRoutes = require('./routes/itemRoutes'); 
const categoriaRoutes = require('./routes/categoriaRoutes'); // <--- NOVO: Importar categorias
const localizacaoRoutes = require('./routes/localizacaoRoutes'); // <--- NOVO: Importar localizações

const sequelize = require('./db/database'); 
const app = express();

const PORT = process.env.PORT || 3001;

// MIDDLEWARES GLOBAIS
app.use(express.json());
app.use(cors()); // Adiciona o middleware CORS AQUI

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
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao PostgreSQL!');
    })
    .catch(err => {
        console.error('Erro fatal: Conexão com PostgreSQL falhou:', err);
    });

app.get('/', (req, res) => {
    res.send('API de Achados e Perdidos está funcionando!');
});

// --- USO DAS ROTAS DA API ---
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/itens', itemRoutes); 
app.use('/api/categorias', categoriaRoutes); // <--- NOVO: Usar rota de categorias
app.use('/api/localizacoes', localizacaoRoutes); // <--- NOVO: Usar rota de localizações
// ----------------------------

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
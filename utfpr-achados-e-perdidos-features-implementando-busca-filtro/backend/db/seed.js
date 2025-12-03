// backend/db/seed.js
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Localizacao = require('../models/Localizacao');
const StatusItem = require('../models/StatusItem');

async function seedDatabase() {
  try {
    // --- Usuário admin ---
    const usuariosCount = await Usuario.count();
    if (usuariosCount === 0) {
      const senhaHash = await bcrypt.hash('123456', 10);
      await Usuario.create({
        nome: 'Administrador',
        email: 'admin@utfpr.edu.br',
        senha: senhaHash,
        telefone: '000000000',
        tipo: 'funcionario',
      });
      console.log(' Usuário admin criado (email: admin@utfpr.edu.br | senha: 123456)');
    } else {
      console.log(' Usuários já existentes. Pulando seed.');
    }

    // --- Categorias ---
    const categoriasCount = await Categoria.count();
    if (categoriasCount === 0) {
      await Categoria.bulkCreate([
        { nome: 'Documentos' },
        { nome: 'Eletrônicos' },
        { nome: 'Roupas e Acessórios' },
        { nome: 'Chaves e Cartões' },
        { nome: 'Materiais Escolares' },
      ]);
      console.log(' Categorias inseridas com sucesso!');
    } else {
      console.log(' Categorias já existentes. Pulando seed.');
    }

    // --- Localizações ---
    const localizacoesCount = await Localizacao.count();
    if (localizacoesCount === 0) {
      await Localizacao.bulkCreate([
        { nome: 'Bloco A' },
        { nome: 'Bloco B' },
        { nome: 'Bloco C' },
        { nome: 'Bloco D' },
        { nome: 'Bloco E' },
        { nome: 'Bloco G' },
        { nome: 'Restaurante Universitário' },
        { nome: 'Estacionamento Superior' },
        { nome: 'Estacionamento Inferior' },
        { nome: 'Corredor Principal' },
        { nome: 'Biblioteca' },
      ]);
      console.log(' Localizações inseridas com sucesso!');
    } else {
      console.log(' Localizações já existentes. Pulando seed.');
    }

    // --- Status ---
    const statusCount = await StatusItem.count();
    if (statusCount === 0) {
      await StatusItem.bulkCreate([
        { id_status: 1, descricao: 'Achado', cor_hex: '#FFD700' },
        { id_status: 2, descricao: 'Perdido', cor_hex: '#1E90FF' },
        { id_status: 3, descricao: 'Reclamado', cor_hex: '#FF8C00' },
        { id_status: 4, descricao: 'Devolvido', cor_hex: '#32CD32' },
      ]);
      console.log(' Status inseridos com sucesso!');
    } else {
      console.log(' Status já existentes. Pulando seed.');
    }

  } catch (error) {
    console.error(' Erro ao executar seed do banco:', error);
  }
}

module.exports = seedDatabase;

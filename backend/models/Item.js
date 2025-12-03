// backend/models/Item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Localizacao = require('./Localizacao');
const StatusItem = require('./StatusItem');

const Item = sequelize.define('Item', {
    id_item: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    caracteristicas: { type: DataTypes.TEXT },
    id_categoria: { type: DataTypes.INTEGER, allowNull: false },
    id_localizacao_encontrado: { type: DataTypes.INTEGER, allowNull: false },
    id_status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    id_usuario_cadastrou: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario_claim: { type: DataTypes.INTEGER, allowNull: true },
    data_encontrado: { type: DataTypes.DATEONLY, allowNull: false },
    data_claim: { type: DataTypes.DATEONLY },
    data_devolucao: { type: DataTypes.DATEONLY },
    imagem: { type: DataTypes.STRING(255) },
    
    // CORREÇÃO FINAL PARA O TRIGGER SQL: Colunas explícitas
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
}, {
    tableName: 'itens', timestamps: false, freezeTableName: true, primaryKey: 'id_item',
});

// --- DEFINIÇÃO DAS ASSOCIAÇÕES (Obrigatório para o include) ---
Item.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'Categoria' });
Item.belongsTo(Localizacao, { foreignKey: 'id_localizacao_encontrado', as: 'LocalEncontrado' });
Item.belongsTo(StatusItem, { foreignKey: 'id_status', as: 'StatusAtual' });
Item.belongsTo(Usuario, { foreignKey: 'id_usuario_cadastrou', as: 'CadastradoPor' });
Item.belongsTo(Usuario, { foreignKey: 'id_usuario_claim', as: 'ReivindicadoPor' });

module.exports = Item;
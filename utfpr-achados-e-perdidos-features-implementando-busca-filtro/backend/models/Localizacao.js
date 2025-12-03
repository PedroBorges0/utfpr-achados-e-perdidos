// backend/models/Localizacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Localizacao = sequelize.define('Localizacao', {
    id_localizacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    descricao: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
}, {
    tableName: 'localizacoes', timestamps: false, freezeTableName: true, primaryKey: 'id_localizacao',
});
module.exports = Localizacao;
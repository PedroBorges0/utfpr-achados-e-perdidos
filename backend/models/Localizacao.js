// backend/models/Localizacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Localizacao = sequelize.define('Localizacao', {
    id_localizacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'localizacoes',
    timestamps: false,
    freezeTableName: true,
});

module.exports = Localizacao;
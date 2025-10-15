// backend/models/Categoria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Categoria = sequelize.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    descricao: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'categorias',
    timestamps: false,
    freezeTableName: true,
});

module.exports = Categoria;
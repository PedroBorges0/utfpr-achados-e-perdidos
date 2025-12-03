// backend/models/Categoria.js (CÓDIGO FINAL CORRIGIDO)

const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Categoria = sequelize.define('Categoria', {
    id_categoria: { // Chave Primária correta
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: { // <<< DEFINIÇÃO CORRIGIDA
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    descricao: { // <<< DEFINIÇÃO CORRIGIDA
        type: DataTypes.TEXT,
    },
    
    // CORREÇÃO PARA O TRIGGER SQL: Colunas explícitas (necessário para o seu BD)
    created_at: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP') 
    },
    updated_at: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP') 
    },
}, {
    tableName: 'categorias',
    timestamps: false, // O SQL gerencia a atualização
    freezeTableName: true,
    primaryKey: 'id_categoria', // GARANTIA DE PK CORRETA
});

module.exports = Categoria;
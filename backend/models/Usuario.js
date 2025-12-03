// backend/models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Usuario = sequelize.define('Usuario', {
    id_usuario: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING(20), allowNull: true },
    tipo: {
        type: DataTypes.ENUM('aluno', 'professor', 'funcionario', 'visitante'),
        allowNull: false,
        defaultValue: 'aluno',
    },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
    avatar_url: { type: DataTypes.STRING, allowNull: true }, 
    
    
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
}, {
    tableName: 'usuarios',
    timestamps: false,
    freezeTableName: true,
    primaryKey: 'id_usuario', 
});

module.exports = Usuario;
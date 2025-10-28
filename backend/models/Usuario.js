const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

// Definição do modelo Usuario
const Usuario = sequelize.define('Usuario', {
    id_usuario: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    senha: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    tipo: {
        // ENUM direto no Sequelize, sem precisar criar tipo customizado no SQL
        type: DataTypes.ENUM('aluno', 'professor', 'funcionario', 'visitante'),
        allowNull: false,
        defaultValue: 'aluno',
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'usuarios',
    timestamps: false,
    freezeTableName: true,
});

module.exports = Usuario;
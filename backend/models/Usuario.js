// backend/models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

// NOTE: REMOVEMOS A DEFINIÇÃO DE TIPO_USUARIO AQUI PARA EVITAR O CONFLITO.

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
    // ... outros campos acima
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    tipo: {
        // Usa o objeto ENUM e forçamos o Sequelize a reconhecer o nome do tipo customizado
        type: DataTypes.ENUM('aluno', 'professor', 'funcionario', 'visitante'),
        allowNull: false,
        defaultValue: 'aluno',
        // CHAVE SECRETA: Diz ao Sequelize para usar o tipo ENUM que JÁ EXISTE no BD.
        // O nome do seu tipo é 'tipo_usuario', criado no SQL.
        type: 'tipo_usuario'
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
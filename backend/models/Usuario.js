const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

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
        type: DataTypes.STRING(20), // AGORA FUNCIONANDO
        allowNull: true,
    },
    tipo: {
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


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
        unique: true
    },
    descricao: { 
        type: DataTypes.TEXT,
    },
    
    
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
    timestamps: false, 
    freezeTableName: true,
    primaryKey: 'id_categoria', 
});

module.exports = Categoria;
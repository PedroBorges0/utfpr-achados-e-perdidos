// backend/models/StatusItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const StatusItem = sequelize.define('StatusItem', {
    id_status: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descricao: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    cor_hex: {
        type: DataTypes.STRING(7),
        defaultValue: '#6B7280',
    },
}, {
    tableName: 'status_itens',
    timestamps: false,
    freezeTableName: true,
});

module.exports = StatusItem;
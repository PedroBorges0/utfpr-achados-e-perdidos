const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('achados_e_perdidos', 'postgres', '112359aA@', {
  host: 'localhost',
  dialect: 'postgres',
  dialectOptions: {
    ssl: false, // Pode ser necessário dependendo da sua configuração
    sslmode: 'disable',
    authMethod: 'password',
  },
  logging: false, // Desativa o log de consultas SQL para um console mais limpo
});

module.exports = sequelize;
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.SEQUELIZE);

module.exports = sequelize;

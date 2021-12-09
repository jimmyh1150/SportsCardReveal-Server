const { DataTypes } = require("sequelize");
const db = require("../db");

const Sportscard = db.define("sportscard", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  playerFirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  playerLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  playerTeamCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  playerTeamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  playerSport: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Sportscard;

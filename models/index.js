const db = require("../db");

const UserModel = require("./user");
const SportscardModel = require("./sportscard");
const CommentsModel = require("./comments");

UserModel.hasMany(SportscardModel);
UserModel.hasMany(CommentsModel);

SportscardModel.belongsTo(UserModel);
SportscardModel.hasMany(CommentsModel);

CommentsModel.belongsTo(SportscardModel);

module.exports = {
  dbConnection: this.dbConnection,

  UserModel,
  SportscardModel,
  CommentsModel,
};

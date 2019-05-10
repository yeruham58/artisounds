const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class Dislike extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
Dislike.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    post_id: Sequelize.INTEGER,
    dislink_score: Sequelize.FLOAT
  },
  { sequelize, modelName: "Dislike" }
);

module.exports = Dislike;

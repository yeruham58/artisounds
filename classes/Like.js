const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class Like extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
Like.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    post_id: Sequelize.INTEGER,
    link_score: Sequelize.FLOAT
  },
  { sequelize, modelName: "Like" }
);

module.exports = Like;

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

class Like extends Sequelize.Model {
  static associate(models) {}

  static createLike(likeInfo, userScore) {
    likeInfo.like_score = 1 + parseInt(userScore) / 10;
    return Like.create(likeInfo);
  }
}

Like.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    post_id: Sequelize.INTEGER,
    like_score: Sequelize.FLOAT
  },
  { sequelize, modelName: "Like" }
);

Like.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = Like;

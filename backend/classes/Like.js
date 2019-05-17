const Sequelize = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Like;

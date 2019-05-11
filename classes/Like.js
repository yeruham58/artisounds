const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class Like extends Sequelize.Model {
  static associate(models) {}

  static createLike(likeInfo) {
    likeInfo.like_score = calculateLikeScore(likeInfo.user_id);
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

const calculateLikeScore = function(user_id) {
  const likeScore = 1;
  //some calculate

  return likeScore;
};

module.exports = Like;

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./User");

class Dislike extends Sequelize.Model {
  static associate(models) {}

  static createDislike(dislikeInfo) {
    dislikeInfo.dislike_score = calculateDislikeScore(dislikeInfo.user_id);
    return Dislike.create(dislikeInfo);
  }
}

Dislike.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    post_id: Sequelize.INTEGER,
    dislike_score: Sequelize.FLOAT
  },
  { sequelize, modelName: "Dislike" }
);

const calculateDislikeScore = function(user_id) {
  const dislikeScore = 1;
  //some calculate

  return dislikeScore;
};

Dislike.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = Dislike;

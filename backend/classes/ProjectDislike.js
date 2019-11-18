const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

class ProjectDislike extends Sequelize.Model {
  static associate(models) {}

  static createDislike(dislikeInfo) {
    dislikeInfo.dislike_score = calculateDislikeScore(dislikeInfo.user_id);
    return ProjectDislike.create(dislikeInfo);
  }
}

ProjectDislike.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    project_id: Sequelize.INTEGER,
    dislike_score: Sequelize.FLOAT
  },
  { sequelize, modelName: "ProjectDislike" }
);

const calculateDislikeScore = function(user_id) {
  const dislikeScore = 1;
  //some calculate

  return dislikeScore;
};

ProjectDislike.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = ProjectDislike;

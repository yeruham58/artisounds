const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

class ProjectLike extends Sequelize.Model {
  static associate(models) {}

  static createLike(likeInfo, userScore) {
    likeInfo.like_score = 1 + parseInt(userScore) / 10;
    return ProjectLike.create(likeInfo);
  }
}

ProjectLike.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    project_id: Sequelize.INTEGER,
    like_score: Sequelize.FLOAT
  },
  { sequelize, modelName: "ProjectLike" }
);

ProjectLike.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = ProjectLike;

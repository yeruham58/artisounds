const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

class ProjectComment extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
ProjectComment.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    project_id: Sequelize.INTEGER,
    comment_contant: Sequelize.STRING
  },
  { sequelize, modelName: "ProjectComment" }
);

ProjectComment.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = ProjectComment;

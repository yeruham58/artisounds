const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

class Comment extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
Comment.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    post_id: Sequelize.INTEGER,
    comment_contant: Sequelize.STRING
  },
  { sequelize, modelName: "Comment" }
);

Comment.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = Comment;

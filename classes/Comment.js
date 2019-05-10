const Sequelize = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Comment;

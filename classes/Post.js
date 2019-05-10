const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Like = require("./Like");
const Dislike = require("./Dislike");
const Comment = require("./Comment");

class Post extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
Post.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    avatar: Sequelize.STRING,
    text: Sequelize.BOOLEAN,
    img: Sequelize.BOOLEAN,
    video: Sequelize.BOOLEAN,
    text_contant: Sequelize.STRING,
    link: Sequelize.STRING
  },
  { sequelize, modelName: "Post" }
);

Post.hasMany(Like, { foreignKey: "post_id", as: "post_likes" });
Post.hasMany(Dislike, { foreignKey: "post_id", as: "post_dislikes" });
Post.hasMany(Comment, { foreignKey: "post_id", as: "post_comments" });

module.exports = Post;

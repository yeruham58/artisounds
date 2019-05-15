const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Like = require("./Like");
const Dislike = require("./Dislike");
const Comment = require("./Comment");

const include = [
  {
    model: Like,
    as: "likes"
  },
  {
    model: Dislike,
    as: "dislikes"
  },
  {
    model: Comment,
    as: "comments"
  }
];

class Post extends Sequelize.Model {
  static associate(models) {}

  static getPostByPostId(postId) {
    return Post.findOne({
      where: { id: postId },
      include: include
    });
  }

  static getPostsByUserId(userId) {
    return Post.findAll({
      where: { user_id: userId },
      order: ["updatedAt"],
      include: include
    });
  }

  static getAllPosts() {
    return Post.findAll({
      limit: 10,
      order: ["updatedAt"],
      include: include
    });
  }

  static getPostScoreByPostId(postId) {
    Post.getPostByPostId(postId).then(post => {
      var postScore = 0;
      post.likes.forEach(function(like) {
        postScore += like.like_score;
      });
      post.dislikes.forEach(function(dislike) {
        postScore -= dislike.dislike_score;
      });
      return postScore;
    });
  }
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

Post.hasMany(Like, { foreignKey: "post_id", as: "likes" });
Post.hasMany(Dislike, { foreignKey: "post_id", as: "dislikes" });
Post.hasMany(Comment, { foreignKey: "post_id", as: "comments" });

module.exports = Post;

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

// const Like = require("./Like");
// const Dislike = require("./Dislike");
// const Comment = require("./Comment");
const User = require("./user");

const include = [
  {
    model: User,
    as: "user_detailes"
  }
  // {
  //   model: Like,
  //   as: "likes",
  //   include: {
  //     model: User,
  //     as: "user_detailes"
  //   }
  // },
  // {
  //   model: Dislike,
  //   as: "dislikes",
  //   include: {
  //     model: User,
  //     as: "user_detailes"
  //   }
  // },
  // {
  //   model: Comment,
  //   as: "comments",
  //   include: {
  //     model: User,
  //     as: "user_detailes"
  //   }
  // }
];

class Project extends Sequelize.Model {
  static associate(models) {}

  static getProjectByProjectId(projectId) {
    return Project.findOne({
      where: { id: projectId },
      include: include
    });
  }

  static getProjectsByUserId(userId) {
    return Project.findAll({
      where: { user_id: userId },
      order: ["updatedAt"],
      include: include
    });
  }

  static getAllProjects() {
    return Project.findAll({
      limit: 100,
      order: ["updatedAt"],
      include: include
    });
  }

  static getProjectScoreByProjectId(projectId) {
    Project.getProjectByProjectId(projectId).then(project => {
      var projectScore = 0;
      project.likes.forEach(function(like) {
        projectScore += like.like_score;
      });
      project.dislikes.forEach(function(dislike) {
        projectScore -= dislike.dislike_score;
      });
      return projectScore;
    });
  }
}
Project.init(
  {
    user_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    original: Sequelize.BOOLEAN,
    bit: Sequelize.INTEGER,
    scale_id: Sequelize.INTEGER,
    genere_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    comment: Sequelize.STRING,
    text: Sequelize.STRING,
    public: Sequelize.BOOLEAN,
    img_or_video_url: Sequelize.STRING,
    img_or_video_key: Sequelize.STRING,
    in_action: Sequelize.BOOLEAN
  },
  { sequelize, modelName: "Project" }
);

// Project.hasMany(Like, { foreignKey: "project_id", as: "likes" });
// Project.hasMany(Dislike, { foreignKey: "project_id", as: "dislikes" });
// Project.hasMany(Comment, { foreignKey: "project_id", as: "comments" });
Project.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = Project;

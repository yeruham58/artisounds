const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Op = Sequelize.Op;
const Promise = require("promise");

const ProjectLike = require("./ProjectLike");
const ProjectDislike = require("./ProjectDislike");
const ProjectComment = require("./ProjectComment");
const ProjectInstrument = require("./ProjectInstrument");
const MusicGenre = require("./MusicGenre");
const ArtPractic = require("./ArtPractic");
const User = require("./User1");

const include = [
  {
    model: User,
    as: "user_detailes"
  },
  {
    model: MusicGenre,
    as: "genre"
  },
  {
    model: ProjectLike,
    as: "likes",
    include: {
      model: User,
      as: "user_detailes"
    }
  },
  {
    model: ProjectDislike,
    as: "dislikes",
    include: {
      model: User,
      as: "user_detailes"
    }
  },
  {
    model: ProjectComment,
    as: "comments",
    include: {
      model: User,
      as: "user_detailes"
    }
  },
  {
    model: ProjectInstrument,
    as: "instruments",
    include: [
      {
        model: User,
        as: "user_detailes"
      },
      {
        model: ArtPractic,
        as: "instrument_detailes"
      }
    ]
  }
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
    return new Promise(function(resolve, reject) {
      ProjectInstrument.getUserInstruments(userId).then(instruments => {
        const projectsIdis = instruments.map(instrument =>
          instrument.project_id.toString()
        );

        Project.findAll({
          where: {
            [Op.or]: [{ user_id: userId }, { id: projectsIdis }]
          },
          order: ["updatedAt"],
          include: include
        }).then(projects => {
          resolve(projects);
        });
      });
    });
  }

  static getAllProjects() {
    return Project.findAll({
      where: { public: true },
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
    original_by: Sequelize.STRING,
    bit: Sequelize.STRING,
    tempo: Sequelize.INTEGER,
    scale: Sequelize.STRING,
    scale_type: Sequelize.STRING,
    genre_id: Sequelize.INTEGER,
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

Project.hasMany(ProjectLike, { foreignKey: "project_id", as: "likes" });
Project.hasMany(ProjectDislike, { foreignKey: "project_id", as: "dislikes" });
Project.hasMany(ProjectComment, { foreignKey: "project_id", as: "comments" });

Project.hasMany(ProjectInstrument, {
  foreignKey: "project_id",
  as: "instruments"
});
Project.belongsTo(MusicGenre, {
  foreignKey: "genre_id",
  as: "genre"
});
Project.belongsTo(User, { foreignKey: "user_id", as: "user_detailes" });

module.exports = Project;

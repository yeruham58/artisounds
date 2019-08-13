const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Op = Sequelize.Op;

const Project = require("./Project");
const User = require("./User");
// const ArtPractic = require("./ArtPractic");

class ProjectNotifications extends Sequelize.Model {
  static associate(models) {}

  static createProjectNotifications(projectNotificationsInfo) {
    return ProjectNotifications.create(projectNotificationsInfo);
  }

  // Get user notifications
  static getNotificationsByUserId(userId) {
    return ProjectNotifications.findAll({
      [Op.or]: [{ sender_id: userId }, { sent_to_id: userId }],

      order: ["updatedAt"],
      include: [
        {
          model: Project,
          as: "project"
        },
        {
          model: User,
          as: "sender_detailes"
        },
        {
          model: User,
          as: "send_to_detailes"
        }
      ]
    });
  }
}

ProjectNotifications.init(
  {
    project_id: Sequelize.INTEGER,
    project_owner_id: Sequelize.INTEGER,
    project_instrument_id: Sequelize.INTEGER,
    sender_id: Sequelize.INTEGER,
    sent_to_id: Sequelize.INTEGER,
    message_text: Sequelize.STRING,
    unread: Sequelize.BOOLEAN,
    need_action: Sequelize.BOOLEAN,
    deleted: Sequelize.BOOLEAN
  },
  { sequelize, modelName: "ProjectNotifications" }
);

ProjectNotifications.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});
// ProjectNotifications.belongsTo(ArtPractic, {
//   foreignKey: "project_id",
//   as: "project"
// });
ProjectNotifications.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender_detailes"
});
ProjectNotifications.belongsTo(User, {
  foreignKey: "sent_to_id",
  as: "send_to_detailes"
});

module.exports = ProjectNotifications;

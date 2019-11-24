const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Promise = require("promise");

const Project = require("./Project");
const ProjectInstrument = require("./ProjectInstrument");
const User = require("./User");
const ArtPractic = require("./ArtPractic");

class ProjectNotifications extends Sequelize.Model {
  static associate(models) {}

  static createProjectNotifications(projectNotificationsInfo) {
    return ProjectNotifications.create(projectNotificationsInfo);
  }

  // Get user notifications
  static getNotificationsByUserId(userId) {
    return new Promise(function(resolve, reject) {
      const include = [
        {
          model: Project,
          as: "project",
          include: {
            model: ProjectInstrument,
            as: "instruments",
            include: {
              model: ArtPractic,
              as: "instrument_detailes"
            }
          }
        },
        {
          model: User,
          as: "sender_detailes"
        },
        {
          model: User,
          as: "send_to_detailes"
        }
      ];

      let IMsender = [];
      let sentToMe = [];
      ProjectNotifications.findAll({
        where: { sender_id: userId },

        order: ["updatedAt"],
        include: include
      }).then(not => {
        IMsender = not;
        ProjectNotifications.findAll({
          where: { sent_to_id: userId },

          order: ["updatedAt"],
          include: include
        }).then(not => {
          sentToMe = not;
          resolve([...IMsender, ...sentToMe]);
        });
      });
    });
  }

  // Delete notifications by instrument id
  static deleteNotificationsByInstrumentId(instrumentId) {
    return ProjectNotifications.destroy({
      where: {
        project_instrument_id: instrumentId,
        notification_type: ["join req", "join"]
      }
    });
  }

  // Delete notifications by instrument id
  static deleteJoinReqByInstrumentId(instrumentId) {
    return ProjectNotifications.destroy({
      where: {
        project_instrument_id: instrumentId,
        notification_type: "join req"
      }
    });
  }

  // Delete notifications by project id
  static deleteNotificationsByProjectId(projectId) {
    return new Promise(function(resolve, reject) {
      ProjectNotifications.findAll({
        where: { project_id: projectId }
      }).then(notifications => {
        notifications.map(notification => {
          const end =
            notifications.indexOf(notification) === notifications.length - 1;
          notification.destroy();
          if (end) {
            resolve("deleted");
          }
        });
      });
    });
  }

  // Delete notification by notification id
  static deleteNotificationById(notificationId) {
    return new Promise(function(resolve, reject) {
      ProjectNotifications.findByPk(notificationId).then(notification => {
        notification.destroy().then(() => {
          resolve("deleted");
        });
      });
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
    notification_type: Sequelize.STRING,
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

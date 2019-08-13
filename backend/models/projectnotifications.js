'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectNotifications = sequelize.define('ProjectNotifications', {
    project_id: DataTypes.INTEGER,
    project_owner_id: DataTypes.INTEGER,
    project_instrument_id: DataTypes.INTEGER,
    sender_id: DataTypes.INTEGER,
    sent_to_id: DataTypes.INTEGER,
    message_text: DataTypes.STRING,
    unread: DataTypes.BOOLEAN,
    need_action: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN
  }, {});
  ProjectNotifications.associate = function(models) {
    // associations can be defined here
  };
  return ProjectNotifications;
};
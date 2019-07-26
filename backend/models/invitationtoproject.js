'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvitationToProject = sequelize.define('InvitationToProject', {
    project_id: DataTypes.INTEGER,
    project_instrument_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comments: DataTypes.STRING
  }, {});
  InvitationToProject.associate = function(models) {
    // associations can be defined here
  };
  return InvitationToProject;
};
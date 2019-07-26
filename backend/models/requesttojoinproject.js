'use strict';
module.exports = (sequelize, DataTypes) => {
  const RequestToJoinProject = sequelize.define('RequestToJoinProject', {
    project_id: DataTypes.INTEGER,
    project_instrument_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comments: DataTypes.STRING
  }, {});
  RequestToJoinProject.associate = function(models) {
    // associations can be defined here
  };
  return RequestToJoinProject;
};
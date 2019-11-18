'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectLike = sequelize.define('ProjectLike', {
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    avater: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    like_score: DataTypes.FLOAT
  }, {});
  ProjectLike.associate = function(models) {
    // associations can be defined here
  };
  return ProjectLike;
};
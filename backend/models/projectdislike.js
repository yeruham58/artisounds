"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProjectDislike = sequelize.define(
    "ProjectDislike",
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      avater: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      dislike_score: DataTypes.FLOAT
    },
    {}
  );
  ProjectDislike.associate = function(models) {
    // associations can be defined here
  };
  return ProjectDislike;
};

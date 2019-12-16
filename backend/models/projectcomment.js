"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProjetComment = sequelize.define(
    "ProjectComment",
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      comment_contant: DataTypes.STRING
    },
    {}
  );
  ProjetComment.associate = function(models) {
    // associations can be defined here
  };
  return ProjectComment;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjetComment = sequelize.define('ProjetComment', {
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    avater: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    comment_contant: DataTypes.STRING
  }, {});
  ProjetComment.associate = function(models) {
    // associations can be defined here
  };
  return ProjetComment;
};
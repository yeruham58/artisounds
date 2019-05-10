'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    post_id: DataTypes.INTEGER,
    comment_contant: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};
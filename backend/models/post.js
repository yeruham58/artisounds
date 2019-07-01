"use strict";
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      text: DataTypes.BOOLEAN,
      img: DataTypes.BOOLEAN,
      video: DataTypes.BOOLEAN,
      audio: DataTypes.BOOLEAN,
      text_contant: DataTypes.STRING,
      link: DataTypes.STRING,
      media_key: DataTypes.STRING
    },
    {}
  );
  Post.associate = function(models) {
    // associations can be defined here
  };
  return Post;
};

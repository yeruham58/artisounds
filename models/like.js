"use strict";
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      post_id: DataTypes.INTEGER,
      like_score: DataTypes.FLOAT
    },
    {}
  );
  Like.associate = function(models) {
    // associations can be defined here
  };
  return Like;
};

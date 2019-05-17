"use strict";
module.exports = (sequelize, DataTypes) => {
  const Dislike = sequelize.define(
    "Dislike",
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      post_id: DataTypes.INTEGER,
      dislike_score: DataTypes.FLOAT
    },
    {}
  );
  Dislike.associate = function(models) {
    // associations can be defined here
  };
  return Dislike;
};

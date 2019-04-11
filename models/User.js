"use strict";
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    // User.hasOne(models.profile);
    // User.hasMany(models.userArtType);
    // User.hasMany(models.userSubArtType);
    // User.hasMany(models.userArtPractic);
  };
  return User;
};

"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserArtPractic = sequelize.define(
    "UserArtPractic",
    {
      user_id: DataTypes.INTEGER,
      art_practic_id: DataTypes.INTEGER,
      art_type_id: DataTypes.INTEGER
    },
    {}
  );
  UserArtPractic.associate = function(models) {
    // associations can be defined here
    UserArtPractic.belongsTo(models.user);
  };
  return UserArtPractic;
};

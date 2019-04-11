"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserArtType = sequelize.define(
    "UserArtType",
    {
      user_id: DataTypes.INTEGER,
      art_type_id: DataTypes.INTEGER
    },
    {}
  );
  UserArtType.associate = function(models) {
    // associations can be defined here
    // UserArtType.belongsTo(models.user);
  };
  return UserArtType;
};

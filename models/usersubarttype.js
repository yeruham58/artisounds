"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserSubArtType = sequelize.define(
    "UserSubArtType",
    {
      user_id: DataTypes.INTEGER,
      sub_art_type_id: DataTypes.INTEGER,
      art_type_id: DataTypes.INTEGER,
      is_active: DataTypes.BOOLEAN
    },
    {}
  );
  UserSubArtType.associate = function(models) {
    // associations can be defined here
    // UserSubArtType.belongsTo(models.user);
  };
  return UserSubArtType;
};

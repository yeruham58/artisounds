"use strict";
module.exports = (sequelize, DataTypes) => {
  const ArtType = sequelize.define(
    "ArtType",
    {
      art_type_name: DataTypes.STRING
    },
    {}
  );
  ArtType.associate = function(models) {
    // associations can be defined here
  };
  return ArtType;
};

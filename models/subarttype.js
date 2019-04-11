"use strict";
module.exports = (sequelize, DataTypes) => {
  const SubArtType = sequelize.define(
    "SubArtType",
    {
      sub_art_type_name: DataTypes.STRING,
      art_type_id: DataTypes.INTEGER
    },
    {}
  );
  SubArtType.associate = function(models) {
    // associations can be defined here
    // SubArtType.belongsTo(models.ArtType);
  };
  return SubArtType;
};

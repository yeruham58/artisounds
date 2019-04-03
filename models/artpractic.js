"use strict";
module.exports = (sequelize, DataTypes) => {
  const ArtPractic = sequelize.define(
    "ArtPractic",
    {
      art_prctic_name: DataTypes.STRING,
      art_type_id: DataTypes.INTEGER
    },
    {}
  );
  ArtPractic.associate = function(models) {
    // associations can be defined here
    ArtPractic.belongsTo(models.ArtType);
  };
  return ArtPractic;
};

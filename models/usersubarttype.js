'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserSubArtType = sequelize.define('UserSubArtType', {
    user_id: DataTypes.INTEGER,
    sub_art_type_id: DataTypes.INTEGER,
    art_type_id: DataTypes.INTEGER
  }, {});
  UserSubArtType.associate = function(models) {
    // associations can be defined here
  };
  return UserSubArtType;
};
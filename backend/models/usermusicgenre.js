'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserMusicGenre = sequelize.define('UserMusicGenre', {
    user_id: DataTypes.INTEGER,
    music_genre_id: DataTypes.INTEGER
  }, {});
  UserMusicGenre.associate = function(models) {
    // associations can be defined here
  };
  return UserMusicGenre;
};
"use strict";
module.exports = (sequelize, DataTypes) => {
  const MusicGenre = sequelize.define(
    "MusicGenre",
    {
      music_genre_name: DataTypes.STRING
    },
    {}
  );
  MusicGenre.associate = function(models) {
    // associations can be defined here
  };
  return MusicGenre;
};

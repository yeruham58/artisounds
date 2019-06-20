const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class MusicGenre extends Sequelize.Model {
  static associate(models) {}

  static getAllMusicGenres() {
    return MusicGenre.findAll({
      attributes: ["id", "music_genre_name"]
    });
  }
}
MusicGenre.init(
  {
    music_genre_name: Sequelize.STRING
  },
  { sequelize, modelName: "MusicGenre" }
);

module.exports = MusicGenre;

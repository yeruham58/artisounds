const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const MusicGenre = require("./MusicGenre");

class UserMusicGenre extends Sequelize.Model {
  static associate(models) {}
  static createAndUpdateUserMusicGenres(musicGenresList, userId) {
    UserMusicGenre.findAll({
      attributes: ["music_genre_id"],
      where: { user_id: userId }
    })
      .then(userMusicGenres => {
        if (userMusicGenres[0]) {
          userMusicGenres.map(function(userMusicGenre) {
            const musicGenreId = userMusicGenre.dataValues.music_genre_id;
            if (musicGenresList.indexOf(musicGenreId) < 0) {
              UserMusicGenre.destroy({
                where: { music_genre_id: musicGenreId, user_id: userId }
              });
            } else {
              musicGenresList.splice(musicGenresList.indexOf(musicGenreId), 1);
            }
          });
        }
        if (musicGenresList[0]) {
          musicGenresList.forEach(function(musicGenreId) {
            UserMusicGenre.create({
              music_genre_id: musicGenreId,
              user_id: userId
            });
          });
        }
      })
      .catch(() => {
        musicGenresList.forEach(function(musicGenreId) {
          UserMusicGenre.create({
            music_genre_id: musicGenreId,
            user_id: userId
          });
        });
      });
  }
}
UserMusicGenre.init(
  {
    user_id: Sequelize.INTEGER,
    music_genre_id: Sequelize.INTEGER
  },
  { sequelize, modelName: "UserMusicGenre" }
);

UserMusicGenre.belongsTo(MusicGenre, {
  foreignKey: "music_genre_id",
  as: "music_genre_details"
});

module.exports = UserMusicGenre;

const db = require("./config/database.js");
const Sequelize = require("sequelize");
const ArtType = require("./models/arttype")(db, Sequelize.DataTypes);
const MusicGenre = require("./models/musicgenre")(db, Sequelize.DataTypes);
const ArtPractic = require("./models/artpractic")(db, Sequelize.DataTypes);

//all functions in this file shoud be in classes

// can insert to db art types
function insertArtTypes(artTypeNameList) {
  artTypeNameList.forEach(function(artType) {
    ArtType.findOne({
      where: { art_type_name: artType }
    })
      .then(dbArtType => {
        if (dbArtType === null || dbArtType === undefined) {
          ArtType.create({ art_type_name: artType }).then(artType =>
            console.log("new art type: " + artType + " was created")
          );
        } else {
          console.log(artType + " type of art is already exisst");
        }
      })
      .catch(err => console.log(err));
  });
}

// can insert to db music genres
function insertMusicGenres(musicGenersList) {
  musicGenersList.forEach(function(musicGenre) {
    MusicGenre.findOne({
      where: { music_genre_name: musicGenre }
    })
      .then(dbmusicGenre => {
        if (dbmusicGenre === null || dbmusicGenre === undefined) {
          MusicGenre.create({ music_genre_name: musicGenre }).then(musicGenre =>
            console.log("new genre: " + musicGenre + " was created")
          );
        } else {
          console.log(musicGenre + " genre is already exisst");
        }
      })
      .catch(err => console.log(err));
  });
}

// can insert to db art practics
// attention: if you enter artPractics, it can be only releted to one art type, so don't confuse!
function insertArtPractics(artPracticNameList, artTypeId) {
  ArtType.findOne({ where: { id: artTypeId } }).then(artType => {
    if (artType) {
      artPracticNameList.forEach(function(artPractic) {
        ArtPractic.findOne({
          where: { art_prctic_name: artPractic, art_type_id: artTypeId }
        })
          .then(dbArtPractic => {
            if (dbArtPractic) {
              console.log(artPractic + " type of art prctic is already exisst");
            } else {
              console.log("should create here");
            }
          })
          .catch(() => {
            console.log("want to create");
            ArtPractic.create({
              art_practic_name: artPractic,
              art_type_id: artTypeId
            }).then(dbArtPractic =>
              console.log("new art prctic type: " + artPractic + " was created")
            );
          });
      });
    } else {
      console.log("id " + artTypeId + " not exists for art type");
    }
  });
}

const artTypes = [
  // "Singer"
  // "Composer",
  // "Write Songs",
  // "Producer",
  // "DAW Recording Softwares"
  // "Electronic Music"
  // "String Instruments",
  // "Keyboards",
  // "Wind Instruments",
  // "Drumming / Percussions",
  // "Bow Instruments"
  // "Accordion"
  // "Special Instruments"
];
const musicPractics = [
  // "Ableton Live",
  // "FL Studio",
  // "Pro Tools",
  // "Propellerhead Reason",
  // "Acid",
  // "Steinberg Cubcase",
  // "PreSonus Studio One",
  // "Cakewalk",
  // "Studio One",
  // "Apple Logic",
  // "GarageBand"
  // "Else"
];

// const musicGenersList = [
//   "Rock",
//   "Hard Rock",
//   "Progressive Rock",
//   "Hip Hop",
//   "Rap",
//   "Punk",
//   "Funk",
//   "Fusion",
//   "World",
//   "Country",
//   "Classic",
//   "Pop",
//   "Jazz",
//   "Jazz Blues",
//   "Chill Out",
//   "Electronic",
//   "Metal",
//   "Alternative",
//   "Blues",
//   "R&B",
//   "Folk",
//   "Reggae",
//   "Dance",
//   "Jewish Music"
// ];

// insertArtTypes(artTypes);
// insertMusicGenres(musicGenersList);
// insertArtPractics(["Write Songs"], 36);

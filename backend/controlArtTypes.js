const db = require("./config/database.js");
const Sequelize = require("sequelize");
const ArtType = require("./models/arttype")(db, Sequelize.DataTypes);
const SubArtType = require("./models/subarttype")(db, Sequelize.DataTypes);
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

// can insert to db sub art tpes
// attention: if you enter subArtTypes, it can be only releted to one art type, so dont confuse!
function insertSubArtTypes(subArtTypeNameList, artTypeId) {
  ArtType.findOne({ where: { id: artTypeId } }).then(artType => {
    if (artType) {
      subArtTypeNameList.forEach(function(subArtType) {
        SubArtType.findOne({
          where: { sub_art_type_name: subArtType, art_type_id: artTypeId }
        })
          .then(dbSubArtType => {
            if (!dbSubArtType) {
              SubArtType.create({
                sub_art_type_name: subArtType,
                art_type_id: artTypeId
              }).then(dbSubArtType =>
                console.log("new sub art type: " + subArtType + " was created")
              );
            } else {
              console.log(subArtType + " type of sub art is already exisst");
            }
          })
          .catch(err => console.log(err));
      });
    } else {
      console.log("id " + artTypeId + " not exists for art type");
    }
  });
}

// can insert to db art practics
// attention: if you enter artPractics, it can be only releted to one art type, so dont confuse!
function insertArtPractics(artPracticNameList, artTypeId) {
  ArtType.findOne({ where: { id: artTypeId } }).then(artType => {
    if (artType) {
      artPracticNameList.forEach(function(artPractic) {
        ArtPractic.findOne({
          where: { art_prctic_name: artPractic, art_type_id: artTypeId }
        })
          .then(dbArtPractic => {
            if (!dbArtPractic) {
              ArtPractic.create({
                art_prctic_name: artPractic,
                art_type_id: artTypeId
              }).then(dbArtPractic =>
                console.log(
                  "new art prctic type: " + artPractic + " was created"
                )
              );
            } else {
              console.log(artPractic + " type of art prctic is already exisst");
            }
          })
          .catch(err => console.log(err));
      });
    } else {
      console.log("id " + artTypeId + " not exists for art type");
    }
  });
}

const artTypes = [];

const musicSubArtTypes = [];
const paintingSubArtTypes = [];
const photographySubArtTypes = [];

const musicPractics = [];
const paintingPractics = [];

// insertArtTypes();
// insertSubArtTypes();
// insertArtPractics();

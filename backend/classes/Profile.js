const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ArtPractic = require("../classes/artpractic");
const UserArtType = require("../classes/userarttype");
const UserArtPractic = require("../classes/userartpractic");

class Profile extends Sequelize.Model {
  static associate(models) {}
  // When creating new art type, we also create all art practics for this art type, and colomn "is active" = false, art practics type will update to be true acording to sun art type list, after art type is created.

  // This function get a the newest art types list from the user, and dellete from DB all the art types that user don't want any more,
  // also delete from this list all the art types that already exist in user profile, by using "deleteUserArtType" function,
  //Then we send the updated list with the new art types list that the user want to add, to function "addNewArtTypes"
  static createAndUpdateUserArtTypes(artTypeList, userId) {
    UserArtType.findAll({
      attributes: ["art_type_id"],
      where: { user_id: userId }
    }).then(userArtTypes => {
      if (userArtTypes[0]) {
        userArtTypes.map(function(userArtTypes) {
          const artTypeId = userArtTypes.dataValues.art_type_id;
          if (artTypeList.indexOf(artTypeId) < 0) {
            deleteUserArtType(artTypeId, userId);
          } else {
            artTypeList.splice(artTypeList.indexOf(artTypeId), 1);
          }
        });
      }
      if (artTypeList[0]) addNewArtTypes(artTypeList, userId);
    });
  }

  // This function get a the newest art prctics list from the user, and set as "is active = false" - all the art prctics that user don't want any more,
  //Then we send the updated list with the new art prctics list that the user want to add, to function "addNewArtPractics"

  static updateUserPractics(userPracticsList, userId) {
    UserArtPractic.findAll({
      where: { user_id: userId, is_active: true }
    }).then(userArtPractics => {
      if (userArtPractics[0]) {
        userArtPractics.map(function(userArtPractic) {
          const artPracticId = userArtPractic.dataValues.art_practic_id;
          if (userPracticsList.indexOf(artPracticId) < 0) {
            userArtPractic.update({ is_active: false });
          }
        });
      }
      if (userPracticsList[0]) addNewArtPractics(userPracticsList, userId);
    });
  }
}

Profile.init(
  {
    user_id: Sequelize.INTEGER,
    location: Sequelize.STRING,
    description: Sequelize.STRING,
    social: Sequelize.JSON(
      {
        website: Sequelize.STRING
      },
      {
        youtube: Sequelize.STRING
      },
      {
        facebook: Sequelize.STRING
      },
      {
        instagram: Sequelize.STRING
      },
      {
        linkedin: Sequelize.STRING
      }
    )
  },
  { sequelize, modelName: "Profile" }
);

// When we delete user art type, we also delete all the  art prctics that releted to this art type
const deleteUserArtType = function(artTypeId, userId) {
  UserArtType.destroy({
    where: { user_id: userId, art_type_id: artTypeId }
  }).then(() => {
    UserArtPractic.destroy({
      where: { art_type_id: artTypeId, user_id: userId }
    });
  });
};

// When we add user art type, we also create (by using "initUserArtPractics" function) all the art prctics that releted to this art type, and set field "is active" as false
const addNewArtTypes = function(newArtTypes, userId) {
  newArtTypes.forEach(function(artTypeId) {
    UserArtType.create({ art_type_id: artTypeId, user_id: userId }).then(
      userArtType => {
        const userArtTypeId = userArtType.dataValues.id;
        initUserArtPractics(artTypeId, userId, userArtTypeId);
      }
    );
  });
};

const initUserArtPractics = function(artTypeId, userId, userArtTypeId) {
  ArtPractic.findAll({
    attributes: ["id"],
    where: { art_type_id: artTypeId }
  }).then(artPractics => {
    if (artPractics[0]) {
      artPractics.map(function(artPractic) {
        UserArtPractic.create({
          art_practic_id: artPractic.dataValues.id,
          art_type_id: artTypeId,
          user_id: userId,
          user_art_type_id: userArtTypeId,
          is_active: false
        })
          .then(console.log("art practic created"))
          .catch(err => console.log(err));
      });
    }
  });
};

// When we add user art practics, we only set field is active as true, Some times when created art type in the same req, we still don't have the art practics field, so we call this function again until this field will be created as is active false, then we update it to be true

const addNewArtPractics = function(userPracticsList, userId) {
  userPracticsList.forEach(function(artPracticId) {
    UserArtPractic.findOne({
      where: { art_practic_id: artPracticId, user_id: userId }
    }).then(userArtPractic => {
      if (userArtPractic) {
        userArtPractic.update({ is_active: true });
      } else {
        addNewArtPractics(userPracticsList, userId);
      }
    });
  });
};

module.exports = Profile;

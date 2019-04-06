const db = require("../../config/database.js");
const Sequelize = require("sequelize");
const User = require("../../models/user")(db, Sequelize.DataTypes);
const Profile = require("../../models/profile")(db, Sequelize.DataTypes);

const SubArtType = require("../../models/subarttype")(db, Sequelize.DataTypes);
const ArtPractic = require("../../models/artpractic")(db, Sequelize.DataTypes);
const UserArtType = require("../../models/userarttype")(
  db,
  Sequelize.DataTypes
);
const UserSubArtType = require("../../models/usersubarttype")(
  db,
  Sequelize.DataTypes
);
const UserArtPractic = require("../../models/userartpractic")(
  db,
  Sequelize.DataTypes
);

const createAndUpdateUserArtTypes = function(artTypeList, userId) {
  convertListItemsToInt(artTypeList);
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
    addNewArtTypes(artTypeList, userId);
  });
};

const deleteUserArtType = function(artTypeId, userId) {
  UserArtType.destroy({
    where: { user_id: userId, art_type_id: artTypeId }
  }).then(userArtType => {
    UserSubArtType.destroy({
      where: { art_type_id: artTypeId, user_id: userId }
    });
    UserArtPractic.destroy({
      where: { art_type_id: artTypeId, user_id: userId }
    });
  });
};

const addNewArtTypes = function(newArtTypes, userId) {
  newArtTypes.forEach(function(artTypeId) {
    UserArtType.create({ art_type_id: artTypeId, user_id: userId }).then(
      userArtType => {
        initUserSubArtTypes(artTypeId, userId);
        initUserArtPractics(artTypeId, userId);
      }
    );
  });
};

const initUserSubArtTypes = function(artTypeId, userId) {
  SubArtType.findAll({
    attributes: ["id"],
    where: { art_type_id: artTypeId }
  }).then(subArtTypes => {
    if (subArtTypes[0]) {
      subArtTypes.map(function(subArtType) {
        UserSubArtType.create({
          sub_art_type_id: subArtType.dataValues.id,
          art_type_id: artTypeId,
          user_id: userId,
          is_active: false
        }).then(console.log("sub art type created"));
      });
    }
  });
};

const initUserArtPractics = function(artTypeId, userId) {
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
          is_active: false
        }).then(console.log("sub art type created"));
      });
    }
  });
};

const updateUserSubArtTypes = function(subArtTypesList, userId) {
  convertListItemsToInt(subArtTypesList);
  UserSubArtType.findAll({
    where: { user_id: userId, is_active: true }
  }).then(userSubArtTypes => {
    if (userSubArtTypes[0]) {
      userSubArtTypes.map(function(userSubArtType) {
        const subArtTypeId = userSubArtType.dataValues.sub_art_type_id;
        if (subArtTypesList.indexOf(subArtTypeId) < 0) {
          userSubArtType.update({ is_active: false });
        }
      });
    }
    addNewSubArtTypes(subArtTypesList, userId);
  });
};

const addNewSubArtTypes = function(subArtTypesList, userId) {
  subArtTypesList.forEach(function(subArtTypeId) {
    UserSubArtType.findOne({
      where: { sub_art_type_id: subArtTypeId, user_id: userId }
    }).then(userSubArtType => userSubArtType.update({ is_active: true }));
  });
};

const updateUserPractics = function(userPracticsList, userId) {
  convertListItemsToInt(userPracticsList);
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
    addNewArtPractics(userPracticsList, userId);
  });
};

const addNewArtPractics = function(userPracticsList, userId) {
  userPracticsList.forEach(function(artPracticId) {
    UserArtPractic.findOne({
      where: { art_practic_id: artPracticId, user_id: userId }
    }).then(userArtPractic => userArtPractic.update({ is_active: true }));
  });
};

const convertListItemsToInt = function(list) {
  list.forEach(function(strNum) {
    list[list.indexOf(strNum)] = parseInt(strNum);
  });
};

module.exports = {
  createAndUpdateUserArtTypes,
  updateUserSubArtTypes,
  updateUserPractics
};

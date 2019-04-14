const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const SubArtType = require("../classes/SubArtType");
const ArtPractic = require("../classes/artpractic");
const UserArtType = require("../classes/userarttype");
const UserSubArtType = require("../classes/usersubarttype");
const UserArtPractic = require("../classes/userartpractic");

const Promise = require("promise");

class Profile extends Sequelize.Model {
  static associate(models) {
    // User.hasOne(models.profile);
  }
  // someMethod() {}
  // static getUserArtTypes(userId) {
  //   return UserArtType.findAll({
  //     attributes: ["art_type_id"],
  //     where: { user_id: userId }
  //   });
  // }

  // static deleteArtTypesThatNotInList(userId, DBArtList, newArtList) {
  //   return new Promise(function(resolve, reject) {
  //     DBArtList.map(function(userArtType) {
  //       const artTypeId = userArtType.dataValues.art_type_id;
  //       if (newArtList.indexOf(artTypeId) < 0) {
  //         deleteUserArtType(artTypeId, userId);
  //       } else {
  //         newArtList.splice(newArtList.indexOf(artTypeId), 1);
  //       }
  //     });
  //     resolve(newArtList);
  //   });
  // }

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

  static convertListItemsToInt(list) {
    list.forEach(function(strNum) {
      list[list.indexOf(strNum)] = parseInt(strNum);
    });
  }

  static updateUserSubArtTypes(subArtTypesList, userId) {
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
      if (subArtTypesList[0]) addNewSubArtTypes(subArtTypesList, userId);
    });
  }

  static updateUserPractics(userPracticsList, userId) {
    if (userPracticsList[0]) convertListItemsToInt(userPracticsList);
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
    art_types: Sequelize.ARRAY(Sequelize.INTEGER),
    sub_art_types: Sequelize.ARRAY(Sequelize.INTEGER),
    art_practics: Sequelize.ARRAY(Sequelize.INTEGER),
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

const deleteUserArtType = function(artTypeId, userId) {
  UserArtType.destroy({
    where: { user_id: userId, art_type_id: artTypeId }
  }).then(() => {
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
        }).then(console.log("art practic created"));
      });
    }
  });
};

const addNewSubArtTypes = function(subArtTypesList, userId) {
  subArtTypesList.forEach(function(subArtTypeId) {
    UserSubArtType.findOne({
      where: { sub_art_type_id: subArtTypeId, user_id: userId }
    }).then(userSubArtType => {
      if (userSubArtType) {
        userSubArtType.update({ is_active: true });
      } else {
        addNewSubArtTypes(subArtTypesList, userId);
      }
    });
  });
};

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

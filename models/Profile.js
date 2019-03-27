const Sequelize = require("sequelize");
const db = require("../config/database.js");
const User = require("./User");

const Profile = db.define("profile", {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      model: User,
      key: "id",
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  location: {
    type: Sequelize.STRING
  },
  art_types: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  sub_art_types: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  art_practics: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  description: {
    type: Sequelize.STRING
  },
  social: {
    type: Sequelize.JSON(
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
  }
  // social: {
  //   type: Sequelize.JSON
  // }
});

module.exports = Profile;

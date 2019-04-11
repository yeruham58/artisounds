const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class Profile extends Sequelize.Model {
  static associate(models) {
    // User.hasOne(models.profile);
  }
  // someMethod() {}
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

module.exports = Profile;

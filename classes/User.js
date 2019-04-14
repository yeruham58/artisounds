const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Profile = require("./Profile");
const UserArtType = require("./UserArtType");
const UserArtPractic = require("./UserArtPractic");
const UserSubArtType = require("./UserSubArtType");

class User extends Sequelize.Model {
  static associate(models) {
    // User.hasOne(models.profile);
  }

  // someMethod() {}
  static getAllUserInfo(userId) {
    return User.findOne({
      where: { id: userId },
      include: [
        {
          model: Profile,
          as: "profile"
        },
        { model: UserArtType, as: "art_types" },
        { model: UserSubArtType, as: "sub_art_types" },
        { model: UserArtPractic, as: "art_practics" }
      ]
    });
  }
}

User.init(
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    avatar: Sequelize.STRING
  },
  { sequelize, modelName: "User" }
);

User.hasOne(Profile, { foreignKey: "user_id", as: "profile" });
User.hasMany(UserArtType, { foreignKey: "user_id", as: "art_types" });
User.hasMany(UserArtPractic, { foreignKey: "user_id", as: "art_practics" });
User.hasMany(UserSubArtType, { foreignKey: "user_id", as: "sub_art_types" });

module.exports = User;

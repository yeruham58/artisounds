const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Profile = require("./Profile");
const UserArtType = require("./UserArtType");
const UserArtPractic = require("./UserArtPractic");
const UserSubArtType = require("./UserSubArtType");

const ArtType = require("./ArtType");
const SubArtType = require("./SubArtType");
const ArtPractic = require("./ArtPractic");

class User extends Sequelize.Model {
  static associate(models) {}

  // constructor() {
  //   super();
  //   this.id = null;
  // }

  // someMethod() {}
  static getAllUserInfo(userId) {
    return User.findOne({
      where: { id: userId },
      include: [
        {
          model: Profile,
          attributes: [],
          as: "profile"
        },
        {
          model: UserArtType,
          as: "art_types",
          attributes: ["art_type_id"],
          include: {
            model: ArtType,
            as: "art_type_details",
            attributes: ["art_type_name"]
          }
        },
        {
          model: UserSubArtType,
          as: "sub_art_types",
          attributes: ["sub_art_type_id", "art_type_id", "is_active"],
          include: {
            model: SubArtType,
            as: "sub_art_type_details",
            attributes: ["sub_art_type_name"]
          }
        },
        {
          model: UserArtPractic,
          as: "art_practics",
          attributes: ["art_practic_id", "art_type_id", "is_active"],
          include: {
            model: ArtPractic,
            as: "art_practic_details",
            attributes: ["art_practic_name"]
          }
        }
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

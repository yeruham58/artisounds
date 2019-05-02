const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ArtType = require("../classes/ArtType");

class UserArtType extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
UserArtType.init(
  {
    user_id: Sequelize.INTEGER,
    art_type_id: Sequelize.INTEGER
  },
  { sequelize, modelName: "UserArtType" }
);

UserArtType.belongsTo(ArtType, {
  foreignKey: "art_type_id",
  as: "art_type_details"
});

module.exports = UserArtType;

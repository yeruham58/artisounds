const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ArtPractic = require("./ArtPractic");

class UserArtPractic extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
UserArtPractic.init(
  {
    user_id: Sequelize.INTEGER,
    art_practic_id: Sequelize.INTEGER,
    art_type_id: Sequelize.INTEGER,
    is_active: Sequelize.BOOLEAN
  },
  { sequelize, modelName: "UserArtPractic" }
);

UserArtPractic.belongsTo(ArtPractic, {
  foreignKey: "art_practic_id",
  as: "art_practic_details"
});

module.exports = UserArtPractic;

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = UserArtPractic;

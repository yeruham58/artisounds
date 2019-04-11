const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class UserSubArtType extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
UserSubArtType.init(
  {
    user_id: Sequelize.INTEGER,
    sub_art_type_id: Sequelize.INTEGER,
    art_type_id: Sequelize.INTEGER,
    is_active: Sequelize.BOOLEAN
  },
  { sequelize, modelName: "UserSubArtType" }
);

module.exports = UserSubArtType;

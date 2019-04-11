const Sequelize = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = UserArtType;

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class ArtType extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
ArtType.init(
  {
    art_type_name: Sequelize.STRING
  },
  { sequelize, modelName: "ArtType" }
);

module.exports = ArtType;

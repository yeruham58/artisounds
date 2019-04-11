const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class SubArtType extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
SubArtType.init(
  {
    sub_art_type_name: Sequelize.STRING,
    art_type_id: Sequelize.INTEGER
  },
  { sequelize, modelName: "SubArtType" }
);

module.exports = SubArtType;

const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class ArtPractic extends Sequelize.Model {
  static associate(models) {}
  static getAllInstruments() {
    return ArtPractic.findAll();
  }
}
ArtPractic.init(
  {
    art_practic_name: Sequelize.STRING,
    art_type_id: Sequelize.INTEGER
  },
  { sequelize, modelName: "ArtPractic" }
);

module.exports = ArtPractic;

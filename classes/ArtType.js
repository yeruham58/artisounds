const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const SubArtType = require("./SubArtType");
const ArtPractic = require("./ArtPractic");

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

ArtType.hasMany(SubArtType, { foreignKey: "art_type_id", as: "sub_art_types" });
ArtType.hasMany(ArtPractic, { foreignKey: "art_type_id", as: "art_practics" });

module.exports = ArtType;

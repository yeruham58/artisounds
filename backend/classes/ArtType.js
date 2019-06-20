const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const SubArtType = require("./SubArtType");
const ArtPractic = require("./ArtPractic");

class ArtType extends Sequelize.Model {
  static associate(models) {}

  static getAllArtTypes() {
    return ArtType.findAll({
      attributes: ["id", "art_type_name"],
      include: [
        {
          model: ArtPractic,
          attributes: ["id", "art_practic_name", "art_type_id"],
          as: "art_practics"
        }
      ]
    });
  }
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

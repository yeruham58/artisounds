const Sequelize = require("sequelize");
const sequelize = require("../config/database");

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

ArtType.hasMany(ArtPractic, { foreignKey: "art_type_id", as: "art_practics" });

module.exports = ArtType;

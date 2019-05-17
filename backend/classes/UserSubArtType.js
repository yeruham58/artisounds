const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const SubArtType = require("./SubArtType");

class UserSubArtType extends Sequelize.Model {
  static associate(models) {}
  // someMethod() {}
}
UserSubArtType.init(
  {
    user_id: Sequelize.INTEGER,
    user_art_type_id: Sequelize.INTEGER,
    sub_art_type_id: Sequelize.INTEGER,
    art_type_id: Sequelize.INTEGER,
    is_active: Sequelize.BOOLEAN
  },
  { sequelize, modelName: "UserSubArtType" }
);

UserSubArtType.belongsTo(SubArtType, {
  foreignKey: "sub_art_type_id",
  as: "sub_art_type_details"
});

module.exports = UserSubArtType;

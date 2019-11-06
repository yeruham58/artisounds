const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");
const ArtPractic = require("./ArtPractic");

class ProjectInstrument extends Sequelize.Model {
  static associate(models) {}

  static createProjectInstrument(projectInstrumentInfo) {
    return ProjectInstrument.create(projectInstrumentInfo);
  }

  static getUserInstruments(userId) {
    return ProjectInstrument.findAll({
      where: { user_id: userId },
      attributes: ["project_id"]
    });
  }
}

ProjectInstrument.init(
  {
    user_id: Sequelize.INTEGER,
    instrument_id: Sequelize.INTEGER,
    project_id: Sequelize.INTEGER,
    original: Sequelize.BOOLEAN,
    role: Sequelize.STRING,
    characters_url: Sequelize.STRING,
    characters_key: Sequelize.STRING,
    record_url: Sequelize.STRING,
    record_key: Sequelize.STRING,
    comments: Sequelize.STRING,
    volume: Sequelize.INTEGER
  },
  { sequelize, modelName: "ProjectInstrument" }
);

ProjectInstrument.belongsTo(User, {
  foreignKey: "user_id",
  as: "user_detailes"
});
ProjectInstrument.belongsTo(ArtPractic, {
  foreignKey: "instrument_id",
  as: "instrument_detailes"
});

module.exports = ProjectInstrument;

"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProjectInstruments = sequelize.define(
    "ProjectInstruments",
    {
      user_id: DataTypes.INTEGER,
      instrument_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
      original: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      characters_url: DataTypes.STRING,
      characters_key: DataTypes.STRING,
      record_url: DataTypes.STRING,
      record_key: DataTypes.STRING,
      comments: DataTypes.STRING,
      volume: DataTypes.INTEGER
    },
    {}
  );
  ProjectInstruments.associate = function(models) {
    // associations can be defined here
  };
  return ProjectInstruments;
};

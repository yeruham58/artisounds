"use strict";
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      original: DataTypes.BOOLEAN,
      original_by: DataTypes.STRING,
      bit: DataTypes.STRING,
      tempo: DataTypes.INTEGER,
      scale: DataTypes.STRING,
      scale_type: DataTypes.STRING,
      genere_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      comment: DataTypes.STRING,
      text: DataTypes.STRING,
      public: DataTypes.BOOLEAN,
      img_or_video_url: DataTypes.STRING,
      img_or_video_key: DataTypes.STRING,
      in_action: DataTypes.BOOLEAN
    },
    {}
  );
  Project.associate = function(models) {
    // associations can be defined here
  };
  return Project;
};

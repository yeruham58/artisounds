"use strict";
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      user_id: DataTypes.INTEGER,
      location: DataTypes.STRING,
      art_types: DataTypes.ARRAY(DataTypes.INTEGER),
      sub_art_types: DataTypes.ARRAY(DataTypes.INTEGER),
      art_practics: DataTypes.ARRAY(DataTypes.INTEGER),
      description: DataTypes.STRING,
      social: DataTypes.JSON(
        {
          website: DataTypes.STRING
        },
        {
          youtube: DataTypes.STRING
        },
        {
          facebook: DataTypes.STRING
        },
        {
          instagram: DataTypes.STRING
        },
        {
          linkedin: DataTypes.STRING
        }
      )
    },
    {}
  );
  Profile.associate = function(models) {
    // associations can be defined here
    Profile.belongsTo(models.user);
  };
  return Profile;
};

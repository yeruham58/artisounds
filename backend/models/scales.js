'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scales = sequelize.define('Scales', {
    name: DataTypes.STRING
  }, {});
  Scales.associate = function(models) {
    // associations can be defined here
  };
  return Scales;
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.STRING
      },
      art_types: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      sub_art_types: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      art_practics: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      description: {
        type: Sequelize.STRING
      },
      social: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Profiles');
  }
};
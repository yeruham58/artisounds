//here are the options to add, delte and update the list of art types or practics in the database, to use it, you have to run it in server

const Sequelize = require("sequelize");
const db = require("../config/database.js");

// control main art types
const ArtType = db.define("art_type", {
  art_type_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// control sub art types
const SubArtType = db.define("sub_art_type", {
  sub_art_name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  art_type_id: {
    type: Sequelize.INTEGER,

    references: {
      model: ArtType,
      key: "id",
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
});

// control art practics
const ArtPractic = db.define("art_practic", {
  practic: {
    type: Sequelize.STRING,
    allowNull: false
  },
  art_type_id: {
    type: Sequelize.INTEGER,

    references: {
      model: ArtType,
      key: "id",
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
});

module.exports = {
  ArtType,
  SubArtType,
  ArtPractic
};

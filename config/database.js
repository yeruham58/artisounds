const Sequelize = require("sequelize");
const keys = require("./keys");

// Option 1: Passing parameters separately
module.exports = new Sequelize(
  "artisounds",
  "postgres",
  keys.postgresPassword,
  {
    host: "localhost",
    dialect: "postgres"
  },
  {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

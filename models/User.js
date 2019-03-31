const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Profile = require("./Profile");

//Create user schem
const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar: {
    type: Sequelize.STRING
  }
});

// module.exports = User = mongoose.model("users", UserSchema);
module.exports = User;

const Sequelize = require("sequelize");
const db = require("../config/database.js");

//Create user schem
const User = db.define("user", {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  }
});

// module.exports = User = mongoose.model("users", UserSchema);
module.exports = User;

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const Sequelize = require("sequelize");
const db = require("../config/database");

//Create user schema
// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   avatar: {
//     type: String
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

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

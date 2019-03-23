const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const db = require("../../config/database.js");
const User = require("../../models/User");

//load Input validation
const validateRgisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//@route    GET api/users/test
//@desc     test users route
//@access   public
router.get("/test", (req, res) => {
  res.json({ msg: "users works!!!" });
  User.findAll()
    .then(users => console.log(users))
    .catch(err => console.log(err));
});

//@route    POST api/users/register
//@desc     register user
//@access   public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRgisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // User.findOne({ email: req.body.email }).then(user => {
  User.findOne({ where: { email: req.body.email } }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      console.log("start create");
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //Rating
        d: "mm" //Defolt
      });
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          let { name, email, avatar, password } = newUser;
          User.create({ name, email, avatar, password })
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route   POST api/users/login
//@desc    login user// returning token
//@access  public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "User not founf";
      return res.status(404).json(errors);
    }

    //check for password
    console.log(typeof user.password);
    bcrypt.compare(password, user.password).then(isMuch => {
      if (isMuch) {
        // user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create jwt payload
        // sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        res.status(400).json(errors);
      }
    });
  });
});

//@route    GET api/users/current
//@desc     return current user
//@access   private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userWithoutPassword = JSON.parse(JSON.stringify(req.user));
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  }
);

module.exports = router;

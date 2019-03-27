const express = require("express");
const router = express.Router();

const db = require("../../config/database.js");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const passport = require("passport");

//@ route   GET api/profile/test
//@desc     test profile route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

//@ route   GET api/profile
//@desc     get corrent user profile
//@access   private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ where: { user_id: req.user.id } })
      .then(profile => {
        if (!profile) {
          errors.noProfole = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.status(200).json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;

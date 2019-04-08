const express = require("express");
const router = express.Router();

const db = require("../../config/database.js");
const Sequelize = require("sequelize");
const User = require("../../models/user")(db, Sequelize.DataTypes);
const Profile = require("../../models/profile")(db, Sequelize.DataTypes);
const passport = require("passport");
const validateProfileInput = require("../../validation/profile");
const userArtsControler = require("../apiFunctions/userArtTypes");

Profile.belongsTo(User, { foreignKey: "user_id", as: "user" });

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
    // Profile.findOne({
    //   where: { user_id: req.user.id },
    //   include: {
    //     model: User,
    //     as: "user"
    //   }
    // })
    User.findOne({
      where: { id: req.user.id },
      include: {
        model: Profile,
        as: "profile"
      }
    })
      // .then(profile => {
      //   if (!profile) {
      .then(user => {
        if (!user.profile) {
          errors.noProfole = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.status(200).json(user);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@ route   POST api/profile
//@desc     create or edit user profile
//@access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //get fields
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user_id = req.user.id;
    profileFields.location = req.body.location ? req.body.location : null;
    //Should be a list
    const artTypeList = req.body.art_types ? req.body.art_types.split(",") : [];
    userArtsControler.createAndUpdateUserArtTypes(artTypeList, req.user.id);
    //Should be a list
    const subArtTypeList = req.body.sub_art_types
      ? req.body.sub_art_types.split(",")
      : [];
    userArtsControler.updateUserSubArtTypes(subArtTypeList, req.user.id);

    //Should be a list
    const artPracticList = req.body.art_practics
      ? req.body.art_practics.split(",")
      : [];
    userArtsControler.updateUserPractics(artPracticList, req.user.id);

    profileFields.description = req.body.description
      ? req.body.description
      : null;
    //social should be a json
    profileFields.social = {};
    if (req.body.website) profileFields.social.website = req.body.website;
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({
      where: { id: req.user.id },
      include: {
        model: User,
        as: "user"
      }
    }).then(profile => {
      if (profile) {
        //update
        profile.update(profileFields).then(profile => res.json(profile));
      } else {
        // create
        Profile.create(profileFields).then(profile => res.json(profile));
      }
    });
  }
);

module.exports = router;

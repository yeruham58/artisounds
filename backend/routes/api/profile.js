const express = require("express");
const router = express.Router();
const passport = require("passport");
const validateProfileInput = require("../../validation/profile");

// const userArtsControler = require("../apiFunctions/userArtTypes");

const ArtType = require("../../classes/ArtType");
const MusicGenre = require("../../classes/MusicGenre");
const UserMusicGenre = require("../../classes/UserMusicGenre");
const User = require("../../classes/User");
const Profile = require("../../classes/profile");

//@ route   GET api/profile/test
//@desc     test profile route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

//@ route   GET api/profile/art-types
//@desc     Get all art types
//@access   public
router.get("/art-types", (req, res) => {
  ArtType.getAllArtTypes()
    .then(artTypes => res.status(200).json(artTypes))
    .catch(err => res.status(404).json(err));
});

//@ route   GET api/profile/music-genres
//@desc     Get all music-genres
//@access   public
router.get("/music-genres", (req, res) => {
  MusicGenre.getAllMusicGenres()
    .then(musicGenres => res.status(200).json(musicGenres))
    .catch(err => res.status(404).json(err));
});

//@ route   GET api/profile/all
//@desc     get list of all users
//@access   public
router.get("/all", (req, res) => {
  User.getListOfAllUsers()
    .then(users => {
      if (!users) {
        errors.noUser = "There is no users yet";
        return res.status(404).json(errors);
      }
      res.status(200).json(users);
    })
    .catch(err => res.status(404).json(err));
});

//@ route   GET api/profile/:user_id
//@desc     get profile by hendle
//@access   public
router.get("/:user_id", (req, res) => {
  const errors = {};
  User.getAllUserInfo(req.params.user_id)
    .then(user => {
      if (!user) {
        errors.noUser = "There is no user for this handle";
        return res.status(404).json(errors);
      }
      res.status(200).json(user);
    })
    .catch(err => res.status(404).json(err));
});

//@ route   GET api/profile
//@desc     get corrent user profile
//@access   private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    User.getAllUserInfo(req.user.id)
      .then(user => {
        if (!user.profile) {
          errors.noProfile = "There is no profile for this user";
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
    const musicGenresList = req.body.music_genres ? req.body.music_genres : [];
    UserMusicGenre.createAndUpdateUserMusicGenres(musicGenresList, req.user.id);

    const artTypeList = req.body.art_types ? req.body.art_types : [];

    Profile.createAndUpdateUserArtTypes(artTypeList, req.user.id);

    //Should be a list
    // const subArtTypeList = req.body.sub_art_types ? req.body.sub_art_types : [];
    // Profile.updateUserSubArtTypes(subArtTypeList, req.user.id);

    //Should be a list
    const artPracticList = req.body.art_practics ? req.body.art_practics : [];
    Profile.updateUserPractics(artPracticList, req.user.id);

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
      where: { user_id: req.user.id }
    }).then(profile => {
      if (profile) {
        //update
        profile.update(profileFields).then(() => {
          setTimeout(function() {
            User.getAllUserInfo(req.user.id).then(user => res.json(user));
          }, 1000);
        });
      } else {
        // create
        Profile.create(profileFields).then(() => {
          setTimeout(function() {
            User.getAllUserInfo(req.user.id).then(user => res.json(user));
          }, 1000);
        });
      }
    });
  }
);

module.exports = router;

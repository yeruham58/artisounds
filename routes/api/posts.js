const express = require("express");
const router = express.Router();
const passport = require("passport");

const validatePostInput = require("../../validation/post");

const Post = require("../../classes/Post");

//@ route   GET api/posts/test
//@desc     test posts route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

//@ route   GET api/posts
//@desc     get all posts
//@access   public
router.get("/", (req, res) => {
  Post.findAll({ limit: 10, order: ["updatedAt"] })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ msg: "no post found" }));
});

//@ route   GET api/posts/:id
//@desc     get post by id
//@access   public
router.get("/:id", (req, res) => {
  Post.findByPk(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ msg: "no post found" }));
});

//@ route   POST api/posts
//@desc     create post
//@access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = {};
    newPost.user_id = req.user.id;
    newPost.name = req.body.name;
    newPost.avatar = req.body.avatar;
    newPost.text = req.body.text;
    newPost.img = req.body.img;
    newPost.video = req.body.video;
    if (req.body.text_contant) newPost.text_contant = req.body.text_contant;
    if (req.body.link) newPost.link = req.body.link;
    Post.create(newPost).then(post =>
      res.json(post).catch(err => res.json(err))
    );
  }
);

//@ route   DELETE api/posts/:id
//@desc     delete post
//@access   private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the post ouner
    Post.findByPk(req.params.id)
      .then(post => {
        if (post.user_id !== req.user.id) {
          return res
            .status(401)
            .json({ msg: "This post is not belong to you!" });
        } else {
          post.destroy().then(() => res.json({ succuss: true }));
        }
      })
      .catch(err => res.json({ msg: "post not found" }));
  }
);

module.exports = router;

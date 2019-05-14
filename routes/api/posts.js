const express = require("express");
const router = express.Router();
const passport = require("passport");

const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comment");

const Post = require("../../classes/Post");
const Like = require("../../classes/Like");
const Dislike = require("../../classes/Dislike");
const Comment = require("../../classes/Comment");

//@ route   GET api/posts/test
//@desc     test posts route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

//@ route   GET api/posts
//@desc     get all posts
//@access   public
router.get("/", (req, res) => {
  Post.getAllPosts()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ msg: "no post found" }));
});

//@ route   GET api/posts/:id
//@desc     get post by id
//@access   public
router.get("/:id", (req, res) => {
  Post.getPostByPostId(req.params.id)
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
    //I have to send name and avatar inside body
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

//@ route   POST api/posts/like/:id
//@desc     like post
//@access   private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //if already liked
    Like.findOne({ where: { post_id: req.params.id, user_id: req.user.id } })
      .then(like => {
        if (!like) {
          const likeInfo = {};
          likeInfo.user_id = req.user.id;
          likeInfo.post_id = req.params.id;
          //I have to send name and avatar inside body
          likeInfo.name = req.body.name;
          likeInfo.avatar = req.body.avatar;
          Dislike.findOne({
            where: { post_id: req.params.id, user_id: req.user.id }
          }).then(dislike => {
            if (dislike) {
              dislike.destroy();
            }
          });
          Like.createLike(likeInfo).then(() => {
            Post.getPostByPostId(req.params.id).then(post => res.json(post));
          });
        } else {
          like
            .destroy()
            .then(() =>
              Post.getPostByPostId(req.params.id).then(post => res.json(post))
            );
        }
      })
      .catch(err => res.json({ msg: "Sorry, we have some err" }));
  }
);

//@ route   POST api/posts/dislike/:id
//@desc     dislike post
//@access   private
router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //if already liked
    Dislike.findOne({ where: { post_id: req.params.id, user_id: req.user.id } })
      .then(dislike => {
        if (!dislike) {
          const dislikeInfo = {};
          dislikeInfo.user_id = req.user.id;
          dislikeInfo.post_id = req.params.id;
          //I have to send name and avatar inside body
          dislikeInfo.name = req.body.name;
          dislikeInfo.avatar = req.body.avatar;
          Like.findOne({
            where: { post_id: req.params.id, user_id: req.user.id }
          }).then(like => {
            if (like) {
              like.destroy();
            }
          });
          Dislike.createDislike(dislikeInfo).then(() => {
            Post.getPostByPostId(req.params.id).then(post => res.json(post));
          });
        } else {
          dislike.destroy().then(() => {
            Post.getPostByPostId(req.params.id).then(post => res.json(post));
          });
        }
      })
      .catch(err => res.json({ msg: "Sorry, we have some err" }));
  }
);

//@ route   POST api/posts/comment/:id
//@desc     add comment to post
//@access   private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const commentInfo = {};
    commentInfo.user_id = req.user.id;
    commentInfo.post_id = req.params.id;
    commentInfo.name = req.body.name;
    commentInfo.avatar = req.body.avatar;
    commentInfo.comment_contant = req.body.comment_contant;

    Comment.create(commentInfo)
      .then(() => {
        Post.getPostByPostId(req.params.id).then(post => res.json(post));
      })
      .catch(err => res.json(err));
  }
);

//@ route   DELETE api/posts/comment/:id/comment_id
//@desc     remove comment from post
//@access   private
router.delete(
  "/comment/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the comment ouner
    Comment.findByPk(req.params.comment_id)
      .then(comment => {
        if (comment.user_id !== req.user.id) {
          return res
            .status(401)
            .json({ msg: "This comment is not belong to you!" });
        } else {
          postId = comment.post_id;
          comment.destroy().then(() => {
            console.log("postId");
            console.log(postId);
            Post.getPostByPostId(postId).then(post => res.json(post));
          });
        }
      })
      .then(() => {
        Post.getPostByPostId(req.params.id).then(post => res.json(post));
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;

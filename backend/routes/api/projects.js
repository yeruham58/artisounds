const express = require("express");
const router = express.Router();
const passport = require("passport");

const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comment");

const User = require("../../classes/User");
const ProjectInstrument = require("../../classes/ProjectInstrument");
// const Post = require("../../classes/Project");
// const Like = require("../../classes/Like");
// const Dislike = require("../../classes/Dislike");
// const Comment = require("../../classes/Comment");
const { deleteAwsFile } = require("./uploadPostMedia");

//@ route   GET api/projets/test
//@desc     test projets route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "projets works" }));

//@ route   GET api/projets
//@desc     get all projets
//@access   public
router.get("/", (req, res) => {
  Post.getAllProjets()
    .then(projets => res.json(projets))
    .catch(err => res.status(404).json({ msg: "no projet found" }));
});

//@ route   GET api/projets/:id
//@desc     get projet by id
//@access   private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.getProjectByProjectId(req.params.id)
      .then(project => res.json(project))
      .catch(err => res.status(404).json({ msg: "no project found" }));
  }
);

//@ route   POST api/projects
//@desc     create project
//@access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validatePostInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    const newProject = {};
    newProject.user_id = req.body.user_id;
    newProject.name = req.body.name;
    newProject.original = req.body.original;
    newProject.bit = req.body.bit;
    if (newProject.scale_id) newProject.scale_id = req.body.scale_id;
    if (newProject.genere_id) newProject.genere_id = req.body.genere_id;
    if (newProject.description) newProject.description = req.body.description;
    if (newProject.comment) newProject.comment = req.body.comment;
    if (newProject.text) newProject.text = req.body.text;
    newProject.public = req.body.public;
    newProject.img_or_video_url = null;
    newProject.img_or_video_key = null;
    newProject.in_action = true;
    Project.create(newProject)
      .then(project => res.json(project))
      .catch(err => {
        errors.error = "Some error with upload your post, please try again";
        return res.status(400).json(errors);
      });
  }
);

//@ route   DELETE api/projects/:id
//@desc     delete project
//@access   private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the post ouner
    Project.findByPk(req.params.id)
      .then(project => {
        if (project.user_id !== req.user.id) {
          return res
            .status(401)
            .json({ msg: "This post is not belong to you!" });
        } else {
          // Like.findAll({
          //   where: { post_id: post.id, user_id: req.user.id }
          // }).then(likes => {
          //   likes.map(like => like.destroy());
          // });
          // Dislike.findAll({
          //   where: { post_id: post.id, user_id: req.user.id }
          // }).then(dislikes => {
          //   dislikes.map(dislike => dislike.destroy());
          // });
          ProjectInstrument.findAll({
            where: { project_id: project.id, user_id: req.user.id }
          }).then(projectInstrument => {
            projectInstrument.map(projectInstrument =>
              projectInstrument.destroy()
            );
          });
          if (project.img_or_video_key) {
            deleteAwsFile(project.img_or_video_key, "projectimgorvideo");
          }
          post.destroy().then(() => res.json({ succuss: true }));
        }
      })
      .catch(err => res.json({ msg: "project not found" }));
  }
);

// // TODO: Edit this code to project like and dislike

// //@ route   POST api/posts/like/:id
// //@desc     like post
// //@access   private
// router.post(
//   "/like/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     //if already liked
//     Like.findOne({
//       where: { post_id: req.params.id, user_id: req.user.id }
//     })
//       .then(like => {
//         if (!like) {
//           const likeInfo = {};
//           likeInfo.user_id = req.user.id;
//           likeInfo.post_id = req.params.id;
//           likeInfo.name = req.body.name;
//           likeInfo.avatar = req.body.avatar;
//           Dislike.findOne({
//             where: { post_id: req.params.id, user_id: req.user.id }
//           }).then(dislike => {
//             if (dislike) {
//               dislike.destroy();
//             }
//           });
//           User.getUserScoreByUserId(likeInfo.user_id).then(userScore => {
//             Like.createLike(likeInfo, userScore).then(() => {
//               Post.getPostByPostId(req.params.id).then(post => res.json(post));
//             });
//           });
//         } else {
//           like
//             .destroy()
//             .then(() =>
//               Post.getPostByPostId(req.params.id).then(post => res.json(post))
//             );
//         }
//       })
//       .catch(err => res.json(err));
//   }
// );

// //@ route   POST api/posts/dislike/:id
// //@desc     dislike post
// //@access   private
// router.post(
//   "/dislike/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     //if already liked
//     Dislike.findOne({ where: { post_id: req.params.id, user_id: req.user.id } })
//       .then(dislike => {
//         if (!dislike) {
//           const dislikeInfo = {};
//           dislikeInfo.user_id = req.user.id;
//           dislikeInfo.post_id = req.params.id;
//           dislikeInfo.name = req.body.name;
//           dislikeInfo.avatar = req.body.avatar;
//           Like.findOne({
//             where: { post_id: req.params.id, user_id: req.user.id }
//           }).then(like => {
//             if (like) {
//               like.destroy();
//             }
//           });
//           Dislike.createDislike(dislikeInfo).then(() => {
//             Post.getPostByPostId(req.params.id).then(post => res.json(post));
//           });
//         } else {
//           dislike.destroy().then(() => {
//             Post.getPostByPostId(req.params.id).then(post => res.json(post));
//           });
//         }
//       })
//       .catch(err => res.json({ msg: "Sorry, we have some err" }));
//   }
// );

// //@ route   POST api/posts/comment/:id
// //@desc     add comment to post
// //@access   private
// router.post(
//   "/comment/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validateCommentInput(req.body);
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }
//     const commentInfo = {};
//     commentInfo.user_id = req.user.id;
//     commentInfo.post_id = req.params.id;
//     commentInfo.name = req.body.name;
//     commentInfo.avatar = req.body.avatar;
//     commentInfo.comment_contant = req.body.comment_contant;

//     Comment.create(commentInfo)
//       .then(() => {
//         Post.getPostByPostId(req.params.id).then(post => res.json(post));
//       })
//       .catch(err => res.json(err));
//   }
// );

// //@ route   DELETE api/posts/comment/:id/comment_id
// //@desc     remove comment from post
// //@access   private
// router.delete(
//   "/comment/:comment_id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     //chack the comment ouner
//     Comment.findByPk(req.params.comment_id)
//       .then(comment => {
//         if (comment.user_id !== req.user.id) {
//           return res
//             .status(401)
//             .json({ msg: "This comment is not belong to you!" });
//         } else {
//           postId = comment.post_id;
//           comment.destroy().then(() => {
//             Post.getPostByPostId(postId).then(post => res.json(post));
//           });
//         }
//       })
//       .then(() => {
//         Post.getPostByPostId(req.params.id).then(post => res.json(post));
//       })
//       .catch(err => res.json(err));
//   }
// );

//@ route   POST api/projects/instrument/:id
//@desc     add instrument to project
//@access   private
router.post(
  "/instrument/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateCommentInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    const instrumentInfo = {};
    instrumentInfo.user_id = req.user.id;
    instrumentInfo.instrument_id = req.body.instrument_id;
    instrumentInfo.project_id = req.params.id;
    instrumentInfo.original = req.body.original;
    instrumentInfo.role = req.body.role;
    instrumentInfo.characters_url = null;
    instrumentInfo.characters_key = null;
    instrumentInfo.record_url = null;
    instrumentInfo.record_key = null;
    if (req.body.comments) instrumentInfo.comments = req.body.comments;

    ProjectInstrument.create(instrumentInfo)
      .then(() => {
        Project.getProjectByProjectId(req.params.id).then(project =>
          res.json(project)
        );
      })
      .catch(err => res.json(err));
  }
);

//@ route   DELETE api/projects/instrument/:instrument_id
//@desc     remove instrument from project
//@access   private
router.delete(
  "/instrument/:instrument_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the instrument ouner
    ProjectInstrument.findByPk(req.params.instrument_id)
      .then(projectInstrument => {
        if (projectInstrument.user_id !== req.user.id) {
          return res
            .status(401)
            .json({ msg: "This comment is not belong to you!" });
        } else {
          projectId = projectInstrument.project_id;
          projectInstrument.destroy().then(() => {
            Project.getProjectByProjectId(projectId).then(post =>
              res.json(projectId)
            );
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

const express = require("express");
const router = express.Router();
const passport = require("passport");

const validateProjectInput = require("../../validation/project");
// const validateCommentInput = require("../../validation/comment");

// const User = require("../../classes/User");
const ArtPractic = require("../../classes/ArtPractic");
const ProjectInstrument = require("../../classes/ProjectInstrument");
const ProjectNotifications = require("../../classes/ProjectNotifications");
const Project = require("../../classes/Project");
// const Like = require("../../classes/Like");
// const Dislike = require("../../classes/Dislike");
// const Comment = require("../../classes/Comment");
const { deleteAwsFile } = require("./uploadPostMedia");

//@ route   GET api/projets/test
//@desc     test projets route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "projects works" }));

//@ route   GET api/projects/instruments
//@desc     Get all instruments
//@access   public
router.get("/instruments", (req, res) => {
  ArtPractic.getAllInstruments()
    .then(instruments => res.status(200).json(instruments))
    .catch(err => res.status(404).json(err));
});

//@ route   GET api/projects
//@desc     get all projects
//@access   public
router.get("/", (req, res) => {
  Project.getAllProjects()
    .then(projects => {
      res.json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ msg: "no project found" });
    });
});

//@ route   GET api/projects/user/:userId
//@desc     get all user projects
//@access   private
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.getProjectsByUserId(req.user.id)
      .then(projects => {
        res.json(projects);
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({ msg: "no project found" });
      });
  }
);

//@ route   GET api/projets/:id
//@desc     get projet by id
//@access   public
router.get("/:id", (req, res) => {
  Project.getProjectByProjectId(req.params.id)
    .then(project => {
      res.json(project);
    })
    .catch(err => res.status(404).json({ msg: "no project found" }));
});

//@ route   POST api/projects
//@desc     create project
//@access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newProject = {};
    newProject.user_id = req.user.id;
    newProject.name = req.body.name;
    newProject.original = req.body.original;
    newProject.original_by = req.body.original_by;
    newProject.bit = req.body.bit;
    if (req.body.tempo) newProject.tempo = req.body.tempo;
    newProject.scale_type = req.body.scale_type;
    if (req.body.scale) newProject.scale = req.body.scale;
    if (req.body.genre_id) newProject.genre_id = req.body.genre_id;
    if (req.body.description) newProject.description = req.body.description;
    if (req.body.comment) newProject.comment = req.body.comment;
    if (req.body.text) newProject.text = req.body.text;
    newProject.public = req.body.public;
    newProject.img_or_video_url = null;
    newProject.img_or_video_key = null;
    newProject.in_action = true;

    Project.create(newProject)
      .then(project => {
        Project.getProjectByProjectId(project.id).then(newProject => {
          res.json(newProject);
        });
      })
      .catch(err => {
        errors.error = "Some error with upload your post, please try again";
        return res.status(400).json(errors);
      });
  }
);

//@ route   PATCH api/projects/projectId
//@desc     update project
//@access   private
router.patch(
  "/:projectId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const updatedProject = {};
    updatedProject.user_id = req.user.id;
    updatedProject.name = req.body.name;
    updatedProject.original = req.body.original;
    updatedProject.original_by = req.body.original_by;
    updatedProject.bit = req.body.bit;
    if (req.body.tempo) updatedProject.tempo = req.body.tempo;
    updatedProject.scale_type = req.body.scale_type;
    if (req.body.scale) updatedProject.scale = req.body.scale;
    if (req.body.genre_id) updatedProject.genre_id = req.body.genre_id;
    if (req.body.description) updatedProject.description = req.body.description;
    if (req.body.comment) updatedProject.comment = req.body.comment;
    if (req.body.text) updatedProject.text = req.body.text;
    updatedProject.public = req.body.public;
    updatedProject.img_or_video_url = null;
    updatedProject.img_or_video_key = null;
    updatedProject.in_action = true;

    Project.getProjectByProjectId(req.params.projectId)
      .then(project => {
        project.update(updatedProject).then(() => {
          Project.getProjectByProjectId(req.params.projectId).then(
            updatedProject => {
              res.json(updatedProject);
            }
          );
        });
      })
      .catch(err => {
        errors.error = "Some error with upload your post, please try again";
        return res.status(400).json(errors);
      });
  }
);

//@ route   DELETE api/projects/:projectId
//@desc     delete project
//@access   private
router.delete(
  "/:projectId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the post ouner
    Project.findByPk(req.params.projectId)
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
          if (
            project.instruments &&
            project.instruments[0] &&
            project.instruments.find(
              instrument =>
                instrument.user_id && instrument.user_id !== project.user_id
            )
          ) {
            project
              .update({
                user_id: project.instruments.find(
                  instrument => instrument.user_id !== project.user_id
                ).user_id
              })
              .then(() => {
                Project.getAllProjects(req.user.id).then(projects => {
                  res.json(projects);
                });
              });
          } else {
            ProjectInstrument.findAll({
              where: { project_id: project.id }
            }).then(projectInstrument => {
              projectInstrument.map(projectInstrument =>
                //TODO: delete instrument record
                projectInstrument.destroy()
              );
            });
            if (project.img_or_video_key) {
              deleteAwsFile(project.img_or_video_key, "projectimgorvideo");
            }
            project.destroy().then(() => {
              Project.getAllProjects(req.user.id).then(projects => {
                res.json(projects);
              });
            });
          }
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
  "/instrument/:projectId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const instrumentInfo = {};
    instrumentInfo.user_id = null;
    instrumentInfo.instrument_id = req.body.instrument_id;
    instrumentInfo.project_id = req.params.projectId;
    instrumentInfo.original = req.body.original;
    if (req.body.role) instrumentInfo.role = req.body.role;
    instrumentInfo.characters_url = null;
    instrumentInfo.characters_key = null;
    instrumentInfo.record_url = null;
    instrumentInfo.record_key = null;
    if (req.body.comments) instrumentInfo.comments = req.body.comments;

    ProjectInstrument.create(instrumentInfo)
      .then(() => {
        Project.getProjectByProjectId(req.params.projectId).then(project =>
          res.json(project)
        );
      })
      .catch(err => res.json(err));
  }
);

//@ route   UPDATE api/projects/instrument/:instrument_id
//@desc     Update instrument in project
//@access   private
router.patch(
  "/instrument/:instrument_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the instrument ouner
    ProjectInstrument.findByPk(req.params.instrument_id).then(
      projectInstrument => {
        const projectId = projectInstrument.project_id;
        Project.getProjectByProjectId(projectId).then(project => {
          if (
            projectInstrument.user_id !== req.user.id &&
            project.user_id !== req.user.id &&
            (Object.keys(req.body).length > 1 ||
              Object.keys(req.body)[0] !== "user_id")
          ) {
            return res
              .status(401)
              .json({ msg: "This instrument is not belong to you!" });
          } else {
            updatedInstrument = {};
            if (Object.keys(req.body).indexOf("user_id") >= 0)
              updatedInstrument.user_id = req.body.user_id;
            if (req.body.instrument_id)
              updatedInstrument.instrument_id = req.body.instrument_id;
            if (req.body.original)
              updatedInstrument.original = req.body.original;
            if (Object.keys(req.body).indexOf("role") >= 0)
              updatedInstrument.role = req.body.role;
            // updatedInstrument.characters_url = null;
            // updatedInstrument.characters_key = null;
            // updatedInstrument.record_url = null;
            // updatedInstrument.record_key = null;
            if (Object.keys(req.body).indexOf("comments") >= 0)
              updatedInstrument.comments = req.body.comments;
            projectInstrument.update(updatedInstrument).then(() => {
              Project.getProjectByProjectId(projectId).then(project => {
                res.json(project);
              });
            });
          }
        });
      }
    );
  }
);

//@ route   DELETE api/projects/instrument/:instrument_id
//@desc     remove instrument from project
//@access   private
router.delete(
  "/instrument/:instrument_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //chack the instrument owner
    ProjectInstrument.findByPk(req.params.instrument_id).then(
      projectInstrument => {
        Project.findByPk(projectInstrument.project_id).then(project => {
          if (project.user_id !== req.user.id) {
            return res
              .status(401)
              .json({ msg: "This project is not belong to you!" });
          } else {
            projectId = projectInstrument.project_id;
            ProjectNotifications.deleteNotificationsByInstrumentId(
              req.params.instrument_id
            ).then(() => {
              projectInstrument.destroy().then(() => {
                Project.getProjectByProjectId(projectId).then(project =>
                  res.json(project)
                );
              });
            });
          }
        });
      }
    );
  }
);

module.exports = router;

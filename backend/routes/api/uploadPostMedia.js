const express = require("express");
const router = express.Router();
const passport = require("passport");

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const keys = require("../../config/keys");
const Post = require("../../classes/Post");
const validatePostInput = require("../../validation/post");

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey,
  Bucket: "postuploadedmedia"
});

/**
 * Single Upload
 */
const postMediaUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "postuploadedmedia",
    acl: "public-read",
    key: function(req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    }
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("postMedia");

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

/**
 * @route POST api/profile/profile-img-upload
 * @desc Upload post image
 * @access public
 */
router.post(
  "/post-media-upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const textcontant = req.headers.textcontant;
    postMediaUpload(req, res, error => {
      if (error) {
        res.json({ error: error });
      } else {
        // If File not found
        if (req.file === undefined) {
          res.json("Error: No File Selected");
        } else {
          // If Success
          const imageKey = req.file.key;
          const imageLocation = req.file.location;
          const newPost = {};
          newPost.user_id = req.user.id;
          newPost.name = req.user.name;
          newPost.avatar = req.user.avatar;
          newPost.text = textcontant.length > 0;
          newPost.img = true;
          newPost.video = false;
          newPost.audio = false;
          if (textcontant.length > 0) newPost.text_contant = textcontant;
          newPost.link = imageLocation;
          newPost.media_key = imageKey;
          // Save the post with file link and file key

          Post.create(newPost)
            .then(post => res.json(post))
            .catch(err => {
              errors.text_contant_or_link =
                "We codn't upload this post, please try again";
              return res.status(400).json(errors);
            });
        }
      }
    });
  }
);

// Delete file from aws

const deleteAwsFile = (imgKey, bucketName) => {
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: [
        {
          Key: imgKey
        }
      ]
    }
  };
  s3.deleteObjects(params, function(err, data) {
    if (err) {
      // an error occurred
      console.log(err);
    } else {
      // successful response
      console.log(data);
    }
  });
};

module.exports = router;

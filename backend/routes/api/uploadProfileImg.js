const express = require("express");
const router = express.Router();
const passport = require("passport");

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const keys = require("../../config/keys");
const User = require("../../classes/User");

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey,
  Bucket: "profilesimg"
});

/**
 * Single Upload
 */
const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "profilesimg",
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
}).single("profileImage");

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
  "/profile-img-upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    profileImgUpload(req, res, error => {
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
          // Save the file name into database into profile model
          User.findOne({ where: { id: req.user.id } })
            .then(user => {
              if (user.avatar_key) {
                deleteAwsFile(user.avatar_key, "profilesimg");
              }

              user.update({ avatar_key: imageKey, avatar: req.file.location });
            })
            .catch(err => console.log(err));
          res.json({
            location: imageLocation
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

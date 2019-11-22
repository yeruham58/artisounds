const express = require("express");
const router = express.Router();
const passport = require("passport");

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const keys = require("../../config/keys");
const ProjectInstrument = require("../../classes/ProjectInstrument");
const Project = require("../../classes/Project");

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey,
  Bucket: "projects-records"
});

/**
 * Single Upload
 */
const recordUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "projects-records",
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
  })
}).single("projectRecord");

/**
 * @route POST api/records/record-upload/:recordId
 * @desc Upload record
 * @access private
 */
router.post(
  "/record-upload/:recordId", // the instrument id inside the project
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectInstrument.findOne({ where: { id: req.params.recordId } })
      .then(instrumentRecord => {
        if (instrumentRecord && instrumentRecord.user_id === req.user.id) {
          recordUpload(req, res, error => {
            if (error) {
              res.json({ error: error });
            } else {
              // If File not found
              if (req.file === undefined) {
                res.json("Error: No File Selected");
              } else {
                // If Success
                const recordKey = req.file.key;
                const recordLocation = req.file.location;

                res.json({
                  recordLocation
                });

                // Save the file name into database into project instrument model

                if (instrumentRecord.record_key) {
                  deleteAwsFile(
                    instrumentRecord.record_key,
                    "projects-records"
                  );
                }

                instrumentRecord.update({
                  record_key: recordKey,
                  record_url: recordLocation
                });
              }
            }
          });
        }
      })
      .catch(err => console.log(err));
  }
);

/**
 * @route DELETE api/records/record-upload/:recordId
 * @desc Delete record
 * @access private
 */
router.delete(
  "/record-upload/:recordId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectInstrument.findOne({ where: { id: req.params.recordId } }).then(
      instrumentRecord => {
        if (instrumentRecord.user_id === req.user.id) {
          deleteAwsFile(req.headers.data, "projects-records");
        }
        instrumentRecord
          .update({
            record_key: null,
            record_url: null
          })
          .then(res.json({ msg: "deleted" }));
      }
    );
  }
);

// Delete file from aws

const deleteAwsFile = (recordKey, bucketName) => {
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: [
        {
          Key: recordKey
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

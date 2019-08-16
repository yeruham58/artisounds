const express = require("express");
const router = express.Router();
const passport = require("passport");

const ProjectNotifications = require("../../classes/ProjectNotifications");

//@ route   POST api/projectNotifications
//@desc     create project notification
//@access   private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newNotification = {};
    newNotification.project_id = req.body.project_id;
    newNotification.project_owner_id = req.body.project_owner_id;
    newNotification.project_instrument_id = req.body.project_instrument_id;
    newNotification.sender_id = req.user.id;
    newNotification.sent_to_id = req.body.sent_to_id;
    if (req.body.message_text)
      newNotification.message_text = req.body.message_text;
    newNotification.unread = true;
    newNotification.need_action = req.body.need_action;
    newNotification.deleted = false;

    ProjectNotifications.create(newNotification)
      .then(() => {
        ProjectNotifications.getNotificationsByUserId(req.user.id).then(
          notifications => res.json(notifications)
        );
      })
      .catch(err => {
        errors.error = "Some error with send this notification";
        return res.status(400).json(errors);
      });
  }
);

//@ route   PATCH api/projectNotifications/:notificationId
//@desc     update project notification
//@access   private
router.patch(
  "/:notificationId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const updatedNotification = req.body;
    ProjectNotifications.findByPk(req.params.notificationId).then(
      notification =>
        notification
          .update(updatedNotification)
          .then(() => {
            ProjectNotifications.getNotificationsByUserId(req.user.id).then(
              notifications => res.json(notifications)
            );
          })
          .catch(err => {
            errors.error = "Some error with update this notification";
            return res.status(400).json(errors);
          })
    );
  }
);

//@ route   GET api/projectNotifications
//@desc     get notifications by user id
//@access   private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectNotifications.getNotificationsByUserId(req.user.id)
      .then(notifications => {
        res.json(notifications);
      })
      .catch(err => res.status(404).json({ data: "no notifications found" }));
  }
);

//@ route   DELETE api/projectNotifications/instrumentId/:projectInstrumentId
//@desc     delete notifications by project_instrument_id
//@access   private
router.delete(
  "/instrumentId/:projectInstrumentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectNotifications.deleteNotificationsByInstrumentId(
      req.params.projectInstrumentId
    )
      .then(() => {
        ProjectNotifications.getNotificationsByUserId(req.user.id)
          .then(notifications => {
            res.json(notifications);
          })
          .catch(err =>
            res.status(404).json({ data: "no notifications found" })
          );
      })
      .catch(err => res.status(404).json({ data: "no notifications found" }));
  }
);

//@ route   DELETE api/projectNotifications/projectId/:projectId
//@desc     delete notifications by project_id
//@access   private
router.delete(
  "/projectId/:projectId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectNotifications.deleteNotificationsByProjectId(req.params.projectId)
      .then(() => {
        ProjectNotifications.getNotificationsByUserId(req.user.id)
          .then(notifications => {
            res.json(notifications);
          })
          .catch(err =>
            res.status(404).json({ data: "no notifications found" })
          );
      })
      .catch(err => res.status(404).json({ data: "no notifications found" }));
  }
);

//@ route   DELETE api/projectNotifications/:notificationId
//@desc     delete notifications by notification id
//@access   private
router.delete(
  "/:notificationId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectNotifications.deleteNotificationById(req.params.notificationId)
      .then(() => {
        ProjectNotifications.getNotificationsByUserId(req.user.id)
          .then(notifications => {
            res.json(notifications);
          })
          .catch(err =>
            res.status(404).json({ data: "no notifications found" })
          );
      })
      .catch(err => res.status(404).json({ data: "no notifications found" }));
  }
);

module.exports = router;

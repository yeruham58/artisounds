import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectNotificationItem from "./ProjectNotificationItem";

class ProjectNotificationFeed extends Component {
  render() {
    const { notifications, loading } = this.props.notifications;
    if (!notifications || notifications.length <= 0 || loading) {
      return (
        <div className="text-center mt-8">
          <strong>Notification board is still empty</strong>
        </div>
      );
    } else {
      return notifications
        .reverse()
        .map(notification => (
          <ProjectNotificationItem
            key={notification.id}
            notification={notification}
          />
        ));
    }
  }
}

ProjectNotificationFeed.propTypes = {
  notifications: PropTypes.object.isRequired
};

export default ProjectNotificationFeed;

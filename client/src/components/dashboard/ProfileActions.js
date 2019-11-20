import React from "react";
import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      {/* <a href="/edit-profile" className="btn btn-light">
        <i className="fas fa-graduation-cap text-info mr-1" /> Edit Profile
      </a> */}
      <Link to="create-project" className="btn btn-light">
        <i className="fas fa-sliders-h text-info mr-1" />
        Create New Project
      </Link>
    </div>
  );
};

export default ProfileActions;

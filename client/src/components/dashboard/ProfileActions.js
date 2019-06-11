import React from "react";
import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      {/* <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-info mr-1" /> Edit Profile
      </Link> */}
      <a href="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-info mr-1" /> Edit Profile
      </a>
      {/* <Link to="add-art-types" className="btn btn-light">
        <i className="fab fa-black-tie text-info mr-1" />
        Add Art Types
      </Link> */}
      <Link to="edit-profile-img" className="btn btn-light">
        <i className="fas fa-graduation-cap text-info mr-1" />
        Edit Profile Img
      </Link>
    </div>
  );
};

export default ProfileActions;

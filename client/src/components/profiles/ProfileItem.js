import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/isEmpty";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;
    const scoreLine =
      profile.user_score > 0 ? (
        <span>
          Artist score: <strong>{profile.user_score}</strong>
        </span>
      ) : (
        <span className="form-text text-muted">
          This user still don't have a score yet
        </span>
      );

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img src={profile.avatar} alt="" className="rounded-circle" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h5>{profile.name}</h5>
            <p>{scoreLine}</p>
            <p>
              {isEmpty(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
            <Link to={`/profile/${profile.id}`} className="btn btn-info">
              View profile
            </Link>
          </div>

          <div className="col-md-4 d-none d-md-block">
            <h4>Art types</h4>
            <ul className="list-group">
              {profile.art_types.slice(0, 4).map((artType, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" />
                  {artType.art_type_details.art_type_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;

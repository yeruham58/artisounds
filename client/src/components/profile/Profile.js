import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import ProfileHeader from "./ProfileHeader";
import Spinner from "../common/Spinner";
import { getProfileById } from "../../actions/profileActions";
import ProfileNav from "./ProfileNav";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getProfileById(this.props.match.params.id);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      if (profile.profile === null) {
        profileContent = <p>{profile.name} dont have an artist profile yet</p>;
      } else {
        profileContent = (
          <div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10">
                <button
                  type="button"
                  className="btn btn-light mb-3"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>

                <ProfileHeader profile={profile} />
                {this.props.auth.user.id === profile.id && (
                  <a href="/edit-profile" className="btn btn-light mb-2">
                    <i className="fas fa-graduation-cap text-info mr-1" /> Edit
                    Profile
                  </a>
                )}

                <ProfileNav profile={profile} />
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfileById }
)(Profile);

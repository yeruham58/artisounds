import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";

class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: ""
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.imgHeight) {
      this.setState({
        imgHeight: newProps.imgHeight
      });
    }
  }

  onImgLoad() {
    const img = document.getElementById("profile-img");
    if (img.offsetWidth) {
      this.componentWillReceiveProps({ imgHeight: img.offsetWidth });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onImgLoad.bind(this));
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.onImgLoad.bind(this));
  }

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
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile.avatar}
                  alt=""
                  id="profile-img"
                  height={this.state.imgHeight + "px"}
                  onLoad={this.onImgLoad.bind(this)}
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.name}</h1>
              <p className="lead text-center">{scoreLine}</p>
              {isEmpty(profile.profile.location) ? null : (
                <p>{profile.location}</p>
              )}
              <p>
                {isEmpty(
                  profile.profile.social && profile.profile.social.website
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.profile.social.website}
                    target="blank"
                  >
                    <i className="fas fa-globe fa-2x" />
                  </a>
                )}
                {isEmpty(
                  profile.profile.social && profile.profile.social.youtube
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.profile.social.youtube}
                    target="blank"
                  >
                    <i className="fab fa-youtube fa-2x" />
                  </a>
                )}
                {isEmpty(
                  profile.profile.social && profile.profile.social.facebook
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.profile.social.facebook}
                    target="blank"
                  >
                    <i className="fab fa-facebook fa-2x" />
                  </a>
                )}
                {isEmpty(
                  profile.profile.social && profile.profile.social.instagram
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.profile.social.instagram}
                    target="blank"
                  >
                    <i className="fab fa-instagram fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;

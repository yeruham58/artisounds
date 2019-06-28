import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { logoutUser } from "../../actions/authActions";
import {
  clearCurrentProfile,
  getCurrentProfile
} from "../../actions/profileActions";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // userAvatar: this.props.auth.user.avatar
      userAvatar:
        this.props.profile && this.props.profile.avatar
          ? this.props.profile.avatar
          : this.props.auth.user.avatar
    };
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.auth) {
      this.setState({
        userAvatar: newProps.auth.user.avatar
      });
    }
    if (newProps.profile && newProps.profile.profile) {
      this.setState({
        userAvatar: newProps.profile.profile.avatar
      });
      this.props.auth.user.avatar = newProps.profile.profile.avatar;
    }
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/feed" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to={`/profile/${user.id}`}>
            <img
              className="rounded-circle ml-2"
              src={this.state.userAvatar}
              alt={user.name}
              style={{
                width: "25px",
                height: "25px",
                pxmarginRight: "5px",
                marginTop: "7px"
              }}
              title="you must have a Gravatar connected to your email to display an image"
            />
          </Link>
        </li>
        <li className="nav-item">
          <a
            href="/login"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    const logoDir = isAuthenticated ? "/feed" : "/";

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to={logoDir}>
            ArtiSounds
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  {" "}
                  Profiles
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile, getCurrentProfile }
)(Navbar);

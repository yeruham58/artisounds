import React, { Component } from "react";
import ProfileAbout from "./ProfileAbout";
import ProjectFeed from "../projects/projects/ProjectFeed";
import PostFeed from "../posts/PostFeed";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getUserProjects } from "../../actions/projectActions";
import { getUserPosts } from "../../actions/postActions";

class ProfileNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: true,
      inAction: false,
      finished: false,
      posts: false
    };
  }

  componentDidMount() {
    this.props.getUserPosts(this.props.profile.id);
    this.props.getUserProjects(this.props.profile.id);
  }

  render() {
    const { projects } = this.props.project;
    const { posts } = this.props.post;

    let filterdProjects = [];
    if (projects) {
      filterdProjects = this.state.inAction
        ? projects.filter(project => project.in_action)
        : projects.filter(project => !project.in_action);
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <button
              className={`btn ${
                this.state.about ? "btn-outline-info" : "btn-light"
              } col-md-3 col-6 mb-3`}
              style={{ width: "100%" }}
              onClick={() => {
                this.setState({
                  about: true,
                  inAction: false,
                  finished: false,
                  posts: false
                });
              }}
            >
              About me
            </button>
            <button
              className={`btn ${
                this.state.inAction ? "btn-outline-info" : "btn-light"
              } col-md-3 col-6 mb-3`}
              style={{ width: "100%" }}
              onClick={() => {
                this.setState({
                  about: false,
                  inAction: true,
                  finished: false,
                  posts: false
                });
              }}
            >
              Projects in action
            </button>
            <button
              className={`btn ${
                this.state.finished ? "btn-outline-info" : "btn-light"
              } col-md-3 col-6 mb-3`}
              style={{ width: "100%" }}
              onClick={() =>
                this.setState({
                  about: false,
                  inAction: false,
                  finished: true,
                  posts: false
                })
              }
            >
              Finished projects
            </button>
            <button
              className={`btn ${
                this.state.posts ? "btn-outline-info" : "btn-light"
              } col-md-3 col-6 mb-3`}
              style={{ width: "100%" }}
              onClick={() =>
                this.setState({
                  about: false,
                  inAction: false,
                  finished: false,
                  posts: true
                })
              }
            >
              Posts
            </button>
          </div>
        </div>
        {this.state.about && <ProfileAbout profile={this.props.profile} />}
        {(this.state.inAction || this.state.finished) && (
          <div style={{ minHeight: window.innerHeight * 0.75 }}>
            <ProjectFeed filterdProjects={filterdProjects} />
          </div>
        )}
        {this.state.posts && (
          <div style={{ minHeight: window.innerHeight * 0.75 }}>
            <PostFeed posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

ProfileNav.propTypes = {
  getUserProjects: PropTypes.func.isRequired,
  getUserPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  post: state.post
});

export default connect(
  mapStateToProps,
  { getUserProjects, getUserPosts }
)(ProfileNav);

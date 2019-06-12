import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link } from "react-router-dom";

class PostItem extends Component {
  onDeleteClick(postId) {
    console.log("postId");
    console.log(postId);
  }

  render() {
    const { auth, post } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text_contant}</p>
            <button type="button" className="btn btn-light mr-1">
              <i className="text-info fas fa-thumbs-up" />
              {post.likes ? (
                <span className="badge badge-light">{post.likes.length}</span>
              ) : null}
            </button>
            <button type="button" className="btn btn-light mr-1">
              <i className="text-secondary fas fa-thumbs-down" />
            </button>
            <Link to={`/post/${post.id}`} className="btn btn-info mr-1">
              Comments
            </Link>
            {post.user_id === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, post.id)}
                type="button"
                className="btn btn-danger mr-1"
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(PostItem);

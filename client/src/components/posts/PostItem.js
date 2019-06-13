import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link } from "react-router-dom";
import {
  deletePost,
  addAndRemoveLike,
  addAndRemoveDislike
} from "../../actions/postActions";

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeNum: this.props.post.likes.length,
      dislikeNum: this.props.post.dislikes.length,
      like: this.findUserLikeOrDisilke(this.props.post.likes),
      dislike: this.findUserLikeOrDisilke(this.props.post.dislikes)
    };
  }

  onDeleteClick(postId) {
    this.props.deletePost(postId);
  }

  onLikeClick(postId) {
    this.props.addAndRemoveLike(postId);
    const likeNum = !this.state.like
      ? this.state.likeNum + 1
      : this.state.likeNum - 1;
    this.setState({
      likeNum: likeNum,
      like: !this.state.like,
      dislike: false
    });
  }

  onDislikeClick(postId) {
    const dislikeNum = !this.state.dislike
      ? this.state.dislikeNum + 1
      : this.state.dislikeNum - 1;
    this.props.addAndRemoveDislike(postId);
    this.setState({
      dislikeNum: dislikeNum,
      dislike: !this.state.dislike,
      like: false
    });
  }

  findUserLikeOrDisilke(likesOrDislikes) {
    const { auth } = this.props;
    return likesOrDislikes.filter(
      likeOrDislike => likeOrDislike.user_id === auth.user.id
    )[0];
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
            <p className="text-center">
              <strong>{post.name}</strong>
            </p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text_contant}</p>
            <button
              onClick={this.onLikeClick.bind(this, post.id)}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames(
                  "fas fa-thumbs-up",
                  {
                    "text-info": this.state.like
                  },
                  {
                    "text-secondary": !this.state.like
                  }
                )}
              />
              {post.likes ? (
                <span className="badge badge-light">{this.state.likeNum}</span>
              ) : null}
            </button>
            <button
              onClick={this.onDislikeClick.bind(this, post.id)}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames(
                  "fas fa-thumbs-down",
                  {
                    "text-danger": this.state.dislike
                  },
                  {
                    "text-secondary": !this.state.dislike
                  }
                )}
              />
              {post.dislikes ? (
                <span className="badge badge-light">
                  {this.state.dislikeNum}
                </span>
              ) : null}
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
  deletePost: PropTypes.func.isRequired,
  addAndRemoveLike: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, addAndRemoveLike, addAndRemoveDislike }
)(PostItem);

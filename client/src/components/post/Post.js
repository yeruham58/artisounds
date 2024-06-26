import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";
import Spinner from "../common/Spinner";
import { getPost } from "../../actions/postActions";

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    let postContant;
    if (post === null || loading || Object.keys(post).length === 0) {
      postContant = <Spinner />;
    } else {
      postContant = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post.id} />
          <CommentFeed postId={post.id} comments={post.comments} />
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-md-1">{""}</div>
        <div className="col-md-10">
          <button
            type="button"
            className="btn btn-light mb-3"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          {postContant}
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPost }
)(Post);

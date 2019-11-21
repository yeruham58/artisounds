import React, { Component } from "react";
import PropTypes from "prop-types";
import PostItem from "./PostItem";

class PostFeed extends Component {
  render() {
    const { posts, loading } = this.props;
    if ((!posts && !loading) || posts.length < 1) {
      return (
        <div className="text-center mt-4">
          <strong>Don't have any posts yet</strong>
        </div>
      );
    }

    const postsElemnts = [];
    posts.map(post =>
      postsElemnts.push(<PostItem key={post.id} post={post} />)
    );
    return (
      <div className="row">
        {window.location.href.indexOf("profile") < 0 ? (
          <div className="col-md-1"></div>
        ) : null}

        <div
          className={
            window.location.href.indexOf("profile") < 0
              ? "col-md-10"
              : "col-md-12"
          }
        >
          {postsElemnts}
        </div>
      </div>
    );
    // return posts.map(post => <PostItem key={post.id} post={post} />);
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostFeed;

import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  render() {
    const { comments } = this.props;
    return comments.map(comment => (
      <CommentItem key={comment.id} comment={comment} />
    ));
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired
  // postId: PropTypes.string.isRequired
};

export default CommentFeed;

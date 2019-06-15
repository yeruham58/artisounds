import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { deleteComment } from "../../actions/postActions";

class CommentItem extends Component {
  onDeleteClick(commentId) {
    console.log("this i s the func step 1");
    this.props.deleteComment(commentId);
  }

  render() {
    const { comment, auth } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`/profile/${comment.user_id}`}>
              <img
                className="rounded-circle d-none d-md-block"
                src={comment.avatar}
                alt=""
              />
            </Link>
          </div>
          <div className="col-md-10">
            <Link to={`/profile/${comment.user_id}`}>
              <p className="mb-2 text-dark">
                <strong>{comment.name}</strong>
              </p>
            </Link>
            <p className="lead">{comment.comment_contant}</p>
            {comment.user_id === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, comment.id)}
                type="button"
                className="btn btn-light mr-1"
              >
                <i className="far fa-trash-alt" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);

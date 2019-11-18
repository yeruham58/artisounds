import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { deleteComment } from "../../../actions/projectActions";

class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: ""
    };
  }
  onDeleteClick(commentId) {
    this.props.deleteComment(commentId);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.imgHeight) {
      this.setState({
        imgHeight: newProps.imgHeight
      });
    }
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  onImgLoad() {
    const img = document.getElementById("profile-img");
    if (img && img.offsetWidth) {
      this.componentWillReceiveProps({ imgHeight: img.offsetWidth });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onImgLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onImgLoad);
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
                src={
                  comment.user_detailes
                    ? comment.user_detailes.avatar
                    : comment.avatar
                }
                alt=""
                id="profile-img"
                height={this.state.imgHeight + "px"}
                onLoad={this.onImgLoad.bind(this)}
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

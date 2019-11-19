import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";

import {
  addAndRemoveLike,
  addAndRemoveDislike
} from "../../../actions/projectActions";
import GiveLikePopup from "../../common/GiveLikePopup";

class projectLikesAndCommentsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeUserInfo: {
        name: this.props.authUser.name,
        avatar: this.props.authUser.avatar
      },
      likeNum: this.props.project.likes ? this.props.project.likes.length : 0,
      dislikeNum: this.props.project.dislikes
        ? this.props.project.dislikes.length
        : 0,
      like: this.findUserLikeOrDisilke(this.props.project.likes),
      dislike: this.findUserLikeOrDisilke(this.props.project.dislikes),
      likeNumColor: "grey"
    };
  }

  findUserLikeOrDisilke(likesOrDislikes) {
    const { auth } = this.props;
    return likesOrDislikes
      ? likesOrDislikes.find(
          likeOrDislike => likeOrDislike.user_id === auth.user.id
        )
      : false;
  }

  onLikeClick(projectId) {
    this.props.addAndRemoveLike(projectId, this.state.likeUserInfo);
    const likeNum = !this.state.like
      ? this.state.likeNum + 1
      : this.state.likeNum - 1;
    const dislikeNum = !this.state.dislike
      ? this.state.dislikeNum
      : this.state.dislikeNum - 1;
    this.setState({
      dislikeNum: dislikeNum,
      likeNum: likeNum,
      like: !this.state.like,
      dislike: false
    });
  }

  onDislikeClick(projectId) {
    const dislikeNum = !this.state.dislike
      ? this.state.dislikeNum + 1
      : this.state.dislikeNum - 1;
    const likeNum = !this.state.like
      ? this.state.likeNum
      : this.state.likeNum - 1;
    this.props.addAndRemoveDislike(projectId, this.state.likeUserInfo);
    this.setState({
      likeNum: likeNum,
      dislikeNum: dislikeNum,
      dislike: !this.state.dislike,
      like: false
    });
  }

  render() {
    const { project } = this.props;
    return (
      <div>
        <span>
          <button
            onClick={this.onLikeClick.bind(this, project.id)}
            type="button"
            className="btn btn-light"
            style={project.likes[0] && { paddingRight: "5px" }}
          >
            <i
              className={`fas fa-thumbs-up ${
                this.state.like ? "text-info" : "text-secondary"
              }`}
            />
          </button>
          {project.likes[0] ? (
            <Popup
              modal
              trigger={
                <span
                  className="badge badge-light mr-3"
                  style={{
                    paddingLeft: "2px",
                    color: this.state.likeNumColor,
                    cursor: "pointer"
                  }}
                  onMouseOver={() => {
                    this.setState({ likeNumColor: "black" });
                  }}
                  onMouseOut={() => {
                    this.setState({ likeNumColor: "grey" });
                  }}
                >
                  {this.state.likeNum}
                </span>
              }
            >
              <GiveLikePopup giveLikeList={project.likes} />
            </Popup>
          ) : null}
          <button
            onClick={this.onDislikeClick.bind(this, project.id)}
            type="button"
            className="btn btn-light"
            style={project.dislikes[0] && { paddingRight: "5px" }}
          >
            <i
              className={`fas fa-thumbs-down ${
                this.state.dislike ? "text-danger" : "text-secondary"
              }`}
            />
          </button>

          {project.dislikes[0] ? (
            <Popup
              modal
              trigger={
                <span
                  className="badge badge-light mr-3"
                  style={{
                    paddingLeft: "2px",
                    color: this.state.likeNumColor,
                    cursor: "pointer"
                  }}
                  onMouseOver={() => {
                    this.setState({ likeNumColor: "black" });
                  }}
                  onMouseOut={() => {
                    this.setState({ likeNumColor: "grey" });
                  }}
                >
                  {this.state.dislikeNum}
                </span>
              }
            >
              <GiveLikePopup giveLikeList={project.dislikes} />
            </Popup>
          ) : null}

          <Link to={`/project/${project.id}`} className="btn btn-light mr-1">
            <i className="far fa-comment"></i>

            {project.comments ? (
              <span className="badge badge-light">
                {project.comments.length}
              </span>
            ) : null}
          </Link>
        </span>
      </div>
    );
  }
}

projectLikesAndCommentsControl.propTypes = {
  addAndRemoveLike: PropTypes.func.isRequired,
  addAndRemoveDislike: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addAndRemoveLike, addAndRemoveDislike }
)(projectLikesAndCommentsControl);

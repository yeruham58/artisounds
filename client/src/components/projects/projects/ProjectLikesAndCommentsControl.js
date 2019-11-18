import React, { Component } from "react";
import { Link } from "react-router-dom";

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
        : 0
      // like: this.findUserLikeOrDisilke(this.props.project.likes),
      // dislike: this.findUserLikeOrDisilke(this.props.project.dislikes)
    };
  }
  render() {
    const { project } = this.props;
    console.log(project);
    return (
      <div>
        <span>
          <button
            // onClick={this.onLikeClick.bind(this, project.id)}
            type="button"
            className="btn btn-light mr-1"
            // onDoubleClick={() => {
            //   console.log("dublle klick");
            // }}
          >
            <i
              className={`fas fa-thumbs-up ${
                this.state.like ? "text-info" : "text-secondary"
              }`}
            />
            {project.likes ? (
              <span className="badge badge-light">{this.state.likeNum}</span>
            ) : null}
          </button>
          <button
            // onClick={this.onDislikeClick.bind(this, project.id)}
            type="button"
            className="btn btn-light mr-1"
          >
            <i
              className={`fas fa-thumbs-down ${
                this.state.dislike ? "text-danger" : "text-secondary"
              }`}
            />
            {project.dislikes ? (
              <span className="badge badge-light">{this.state.dislikeNum}</span>
            ) : null}
          </button>
          <Link
            to={`/project/${project.id}`}
            // style={{ fontSize: "18px", color: "grey" }}
            className="btn btn-light mr-1"
          >
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

export default projectLikesAndCommentsControl;

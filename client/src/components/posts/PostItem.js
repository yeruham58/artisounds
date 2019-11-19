import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import Popup from "reactjs-popup";

import musicGif from "../../img/musicGif.gif";
import {
  deletePost,
  addAndRemoveLike,
  addAndRemoveDislike
} from "../../actions/postActions";
import GiveLikePopup from "../common/GiveLikePopup";

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeUserInfo: {
        name: this.props.auth.user.name,
        avatar: this.props.auth.user.avatar
      },
      likeNum: this.props.post.likes ? this.props.post.likes.length : 0,
      dislikeNum: this.props.post.dislikes
        ? this.props.post.dislikes.length
        : 0,
      like: this.findUserLikeOrDisilke(this.props.post.likes),
      dislike: this.findUserLikeOrDisilke(this.props.post.dislikes),
      imgHeight: "",
      videoPlayerConfig: { playing: false, volume: 2 }
    };
    this.onImgLoad = this.onImgLoad.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.videoPlayerConfig) {
      this.setState({
        videoPlayerConfig: newProps.videoPlayerConfig
      });
    }
    if (newProps.imgHeight) {
      this.setState({
        imgHeight: newProps.imgHeight
      });
    }
  }

  onDeleteClick(postId) {
    this.props.deletePost(postId);
  }

  onLikeClick(postId) {
    this.props.addAndRemoveLike(postId, this.state.likeUserInfo);
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

  onDislikeClick(postId) {
    const dislikeNum = !this.state.dislike
      ? this.state.dislikeNum + 1
      : this.state.dislikeNum - 1;
    const likeNum = !this.state.like
      ? this.state.likeNum
      : this.state.likeNum - 1;
    this.props.addAndRemoveDislike(postId, this.state.likeUserInfo);
    this.setState({
      likeNum: likeNum,
      dislikeNum: dislikeNum,
      dislike: !this.state.dislike,
      like: false
    });
  }

  findUserLikeOrDisilke(likesOrDislikes) {
    const { auth } = this.props;
    return likesOrDislikes
      ? likesOrDislikes.filter(
          likeOrDislike => likeOrDislike.user_id === auth.user.id
        )[0]
      : false;
  }

  onImgLoad() {
    const img = document.getElementById("profile-img");
    if (img && img.offsetWidth) {
      this.componentWillReceiveProps({ imgHeight: img.offsetWidth });
    }
  }

  onScroll() {
    const video = document.getElementById("videoPlayer" + this.props.post.id);
    if (video && video.getBoundingClientRect()) {
      if (
        video.getBoundingClientRect().top > 0 - video.offsetHeight / 2 &&
        video.getBoundingClientRect().bottom - video.offsetHeight / 2 <
          window.innerHeight
      ) {
        this.componentWillReceiveProps({
          videoPlayerConfig: { playing: true, volume: 2 }
        });
      } else {
        if (this.state.videoPlayerConfig.playing) {
          this.componentWillReceiveProps({
            videoPlayerConfig: { playing: false, volume: 2 }
          });
        }
      }
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onImgLoad);
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onImgLoad);
    window.removeEventListener("scroll", this.onScroll);
  }

  render() {
    const { auth, post, showActions } = this.props;
    const { videoPlayerConfig } = this.state;
    let imgLink;
    let videoLink;
    let audioLink;
    if (post.img) {
      imgLink = post.link;
    }

    if (post.video) {
      videoLink = post.link;
    }

    if (post.audio) {
      audioLink = post.link;
    }
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`/profile/${post.user_id}`}>
              <img
                className="rounded-circle d-none d-md-block"
                src={
                  post.user_detailes ? post.user_detailes.avatar : post.avatar
                }
                alt=""
                id="profile-img"
                height={this.state.imgHeight + "px"}
                onLoad={this.onImgLoad.bind(this)}
              />
            </Link>
          </div>
          <div className="col-md-10">
            <Link to={`/profile/${post.user_id}`}>
              <p className="text-dark">
                <strong>{post.name}</strong>
              </p>
            </Link>
            <br />

            <p className="lead">{post.text_contant}</p>
            {imgLink && (
              <div className="mb-3">
                <img src={imgLink} alt="" className="rounded" />
              </div>
            )}
            {videoLink && (
              <div className="mb-3">
                <ReactPlayer
                  url={videoLink}
                  playing={videoPlayerConfig.playing}
                  controls
                  volume={videoPlayerConfig.volume}
                  muted
                  width="100%"
                  id={"videoPlayer" + post.id}
                />
              </div>
            )}
            {audioLink && (
              <div className="mb-3">
                <img src={musicGif} alt="" className="rounded" />
                <ReactPlayer
                  height="70px"
                  url={audioLink}
                  playing={false}
                  controls
                  volume={2}
                  muted
                  width="100%"
                />
              </div>
            )}
            {showActions ? (
              <span>
                <button
                  onClick={this.onLikeClick.bind(this, post.id)}
                  type="button"
                  className={`btn btn-light ${!post.likes[0] && "mr-2"}`}
                  style={post.likes[0] && { paddingRight: "5px" }}
                >
                  <i
                    className={`fas fa-thumbs-up ${
                      this.state.like ? "text-info" : "text-secondary"
                    }`}
                  />
                </button>
                {post.likes[0] ? (
                  <Popup
                    modal
                    trigger={
                      <span
                        className="badge mr-3"
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
                    <GiveLikePopup giveLikeList={post.likes} />
                  </Popup>
                ) : null}
                <button
                  onClick={this.onDislikeClick.bind(this, post.id)}
                  type="button"
                  className={`btn btn-light ${!post.dislikes[0] && "mr-2"}`}
                  style={post.dislikes[0] && { paddingRight: "5px" }}
                >
                  <i
                    className={`fas fa-thumbs-down ${
                      this.state.dislike ? "text-danger" : "text-secondary"
                    }`}
                  />
                </button>

                {post.dislikes[0] ? (
                  <Popup
                    modal
                    trigger={
                      <span
                        className="badge mr-3"
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
                    <GiveLikePopup giveLikeList={post.dislikes} />
                  </Popup>
                ) : null}

                <Link
                  to={`/post/${post.id}`}
                  // style={{ fontSize: "18px", color: "grey" }}
                  className="btn btn-light mr-1"
                >
                  <i className="far fa-comment"></i>

                  {post.comments ? (
                    <span className="badge badge-light">
                      {post.comments.length}
                    </span>
                  ) : null}
                </Link>
                {post.user_id === auth.user.id ? (
                  <button
                    onClick={this.onDeleteClick.bind(this, post.id)}
                    type="button"
                    className="btn btn-light mr-1"
                  >
                    {/* <i className="fas fa-times" /> */}
                    <i className="far fa-trash-alt" />
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

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

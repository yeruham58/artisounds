import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

// import musicGif from "../../img/musicGif.gif";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import {
  addPost,
  addPostWithFile,
  clearErrors
} from "../../actions/postActions";
import { uploadDataWithFile } from "../../actions/uploadFileActions";
import Spinner from "../common/Spinner";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {},
      displayAddFileIcon: true,
      selectedFile: null,
      fileUrl: null,
      fileType: null,
      videoPlayerConfig: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
      this.props.upload.loading = false;
    }
    if (
      newProps.upload &&
      newProps.upload.uploadRes &&
      !newProps.upload.loading
    ) {
      this.setState({
        selectedFile: null,
        displayAddFileIcon: true,
        text: "",
        fileUrl: null
      });
      this.props.addPostWithFile(newProps.upload.uploadRes);
    }
    if (Object.keys(newProps)[0] === "displayAddFileIcon") {
      this.setState({ displayAddFileIcon: newProps.displayAddFileIcon });
      if (newProps.displayAddFileIcon) {
        this.setState({
          errors: {},
          selectedFile: null,
          fileUrl: null
        });
      }
    }
    if (newProps.fileUrl) {
      this.setState({ fileUrl: newProps.fileUrl, displayAddFileIcon: true });
    }
  }

  onChange(e) {
    if (this.state.errors.text_contant_or_link) {
      this.props.clearErrors("text_contant_or_link");
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props.auth;
    const newPost = {
      user_id: user.id,
      name: user.name,
      avatar: user.avatar,
      text: true,
      img: false,
      video: false,
      audio: false,
      text_contant: this.state.text
    };

    this.props.addPost(newPost);
    this.setState({ text: "" });
  }

  onSelectFile = event => {
    const videoPlayerConfig = event.target.files[0].type.indexOf("video")
      ? { playing: false, volume: 2 }
      : this.state.videoPlayerConfig;

    this.setState({
      selectedFile: event.target.files[0],
      fileUrl: URL.createObjectURL(event.target.files[0]),
      fileType: event.target.files[0].type,
      videoPlayerConfig: videoPlayerConfig
    });
    if (Object.keys(this.state.errors).length > 0) {
      // this.props.clearErrors("uploadErrors");
      this.componentWillReceiveProps({ errors: {} });
    }
  };

  uploadFile = event => {
    const data = new FormData();
    // If file selected
    if (this.state.selectedFile) {
      data.append(
        "postMedia",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      data.append("endPoint", "post-media-upload");
      data.append("text_contant", this.state.text);

      this.props.uploadDataWithFile(data);
    } else {
      this.componentWillReceiveProps({
        errors: {
          ...this.state.errors,
          uploadErrors: "No file selected"
        }
      });
    }
  };

  render() {
    const { errors, displayAddFileIcon } = this.state;
    const uploadDataWithFile = (
      <div
        className="card border-light mb-3 mt-5"
        style={{ boxShadow: "0 5px 10px 2px rgba(195,192,192,.5)" }}
      >
        {/* <div className="card-header">
          <p className="text-muted" style={{ marginLeft: "12px" }}>
            Upload Size: 250px x 250px ( Max 2MB )
          </p>
        </div> */}
        <div className="card-body">
          <input type="file" onChange={this.onSelectFile} />

          {errors.uploadErrors ? (
            <div>
              <small className="text-danger">{errors.uploadErrors}</small>
            </div>
          ) : null}
          <div className="mt-5">
            <label className="btn btn-info" onClick={this.uploadFile}>
              Submit and post
            </label>
            <label
              className="btn btn-light ml-3"
              onClick={() => {
                this.componentWillReceiveProps({ displayAddFileIcon: true });
              }}
            >
              Cancle
            </label>
          </div>
        </div>
      </div>
    );
    const { fileUrl, fileType, videoPlayerConfig } = this.state;
    const { loading } = this.props.upload;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Somthing...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              {loading && <Spinner />}
              {fileUrl && !loading && (
                <div className="mb-3">
                  {fileType.indexOf("image") > -1 && (
                    <img src={fileUrl} alt="" className="rounded" />
                  )}
                  {fileType.indexOf("video") > -1 && (
                    <ReactPlayer
                      url={fileUrl}
                      playing={videoPlayerConfig.playing}
                      controls
                      muted
                      volume={videoPlayerConfig.volume}
                      width="100%"
                    />
                  )}
                  {fileType.indexOf("audio") > -1 && (
                    <div>
                      {/* <img src={musicGif} alt="" className="rounded" /> */}
                      <ReactPlayer
                        height="70px"
                        url={fileUrl}
                        playing={false}
                        controls
                        muted
                        volume={2}
                        width="100%"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text_contant_or_link}
                />
              </div>
              {displayAddFileIcon ? null : uploadDataWithFile}
              {displayAddFileIcon ? (
                <div>
                  <div>
                    <label
                      className="btn btn-light mr-1"
                      onClick={() => {
                        this.componentWillReceiveProps({
                          displayAddFileIcon: false
                        });
                      }}
                    >
                      <i className="far fa-file-image" />
                    </label>
                  </div>
                  <button type="submit" className="btn btn-dark">
                    Submit
                  </button>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  addPostWithFile: PropTypes.func.isRequired,
  uploadDataWithFile: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
  upload: state.upload
});

export default connect(
  mapStateToProps,
  { addPost, clearErrors, uploadDataWithFile, addPostWithFile }
)(PostForm);

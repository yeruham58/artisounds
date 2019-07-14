import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  uploadDataWithFile,
  deleteProfileImg
} from "../../actions/uploadFileActions";

class EditProfilImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      fileDisable: true,
      selectedFile: null,
      selectedFiles: null,
      fileUrl: this.props.profile.avatar,
      imgHeight: ""
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }

    if (newProps.upload && newProps.upload.uploadRes) {
      this.setState({
        selectedFile: null,
        fileDisable: true,
        fileUrl: newProps.upload.uploadRes.location
      });
    }

    if (newProps.fileUrl) {
      this.setState({
        fileUrl: newProps.fileUrl
      });
    }

    if (newProps.imgHeight) {
      this.setState({
        imgHeight: newProps.imgHeight
      });
    }

    if (Object.keys(newProps)[0] === "fileDisable") {
      this.setState({
        fileDisable: newProps.fileDisable,
        fileUrl: this.props.profile.avatar
      });
      if (newProps.fileDisable) {
        this.setState({
          selectedFile: null
        });
      }
    }
  }

  singleFileChangedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      fileUrl: URL.createObjectURL(event.target.files[0])
    });
    if (this.state.errors.uploadErrors) {
      this.componentWillReceiveProps({
        errors: {}
      });
    }
  };

  uploadFile = event => {
    const data = new FormData();
    // If file selected
    if (this.state.selectedFile) {
      data.append(
        "profileImage",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      data.append("endPoint", "profile-img-upload");
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
    const { profile } = this.props;
    const { errors, fileDisable } = this.state;
    const uploadDataWithFile = (
      <div
        className="card border-light mb-3 mt-5"
        style={{ boxShadow: "0 5px 10px 2px rgba(195,192,192,.5)" }}
      >
        <div className="card-header">
          <p className="text-muted" style={{ marginLeft: "12px" }}>
            Upload Size: 250px x 250px ( Max 2MB )
          </p>
        </div>
        <div className="card-body">
          <input
            type="file"
            onChange={this.singleFileChangedHandler}
            disabled={this.state.selectedFile}
          />

          {errors.uploadErrors ? (
            <div>
              <small className="text-danger">{errors.uploadErrors}</small>
            </div>
          ) : null}
          <div className="mt-5">
            <label className="btn btn-info" onClick={this.uploadFile}>
              Change profile img
            </label>
            <label
              className="btn btn-light ml-3"
              onClick={() => {
                this.componentWillReceiveProps({ fileDisable: true });
              }}
            >
              Cancle
            </label>
          </div>
        </div>
      </div>
    );
    const { fileUrl } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3 mt-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={fileUrl}
                  alt=""
                  id="profile-img"
                  height={this.state.imgHeight + "px"}
                  onLoad={this.onImgLoad.bind(this)}
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.name}</h1>
            </div>
            {fileDisable ? null : uploadDataWithFile}
            {fileDisable ? (
              <div>
                <div>
                  <label
                    className="btn btn-light mr-1"
                    onClick={() => {
                      this.componentWillReceiveProps({ fileDisable: false });
                    }}
                  >
                    Edit profile img
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

EditProfilImg.propTypes = {
  uploadDataWithFile: PropTypes.func.isRequired,
  deleteProfileImg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  upload: state.upload
});

export default connect(
  mapStateToProps,
  { uploadDataWithFile, deleteProfileImg }
)(EditProfilImg);

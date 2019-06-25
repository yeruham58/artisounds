import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { singleFileUpload } from "../../actions/uploadFileActions";
import { setProfileImg } from "../../actions/authActions";

class EditProfilImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      fileDisable: true,
      selectedFile: null,
      selectedFiles: null,
      fileUrl: null
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }

    if (newProps.upload && newProps.upload.fileUrl) {
      this.setState({
        selectedFile: null,
        fileDisable: true,
        fileUrl: newProps.upload.fileUrl
      });
      this.props.setProfileImg({ avatar: newProps.upload.fileUrl });
    }

    if (Object.keys(newProps)[0] === "fileDisable") {
      this.setState({ fileDisable: newProps.fileDisable });
      if (newProps.fileDisable) {
        this.setState({
          selectedFile: null
        });
      }
    }
  }

  singleFileChangedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
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
      this.props.singleFileUpload(data);
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
    const { profile } = this.props;
    const { errors, fileDisable } = this.state;
    const singleFileUpload = (
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
                  src={fileUrl ? fileUrl : profile.avatar}
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.name}</h1>
            </div>
            {fileDisable ? null : singleFileUpload}
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
  singleFileUpload: PropTypes.func.isRequired,
  setProfileImg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  upload: state.upload
});

export default connect(
  mapStateToProps,
  { singleFileUpload, setProfileImg }
)(EditProfilImg);

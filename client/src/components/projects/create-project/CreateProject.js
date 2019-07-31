import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";
import SelectListGroup from "../../common/SelectListGroup";
import RadioButtenGroup from "../../common/RadioButtenGroup";
import RangeSlider from "../../common/RangeSlider";
import { scalesList } from "./ScalesList";
import { projectBitValidation } from "../../../validation/projectBitValidation";
import { createProject, clearErrors } from "../../../actions/projectActions";

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allArtTypes: [],
      musicGenres: [],
      name: "",
      original: false,
      original_by: "",
      tempo: null,
      bit: "4/4",
      scale: "",
      major: true,
      genre_id: null,
      description: "",
      comment: "",
      text: "",
      public: true,
      errors: {}
    };

    // // Get all art types from database
    // axios
    //   .get("/api/profile/art-types")
    //   .then(artTypes => {
    //     this.setState({ allArtTypes: artTypes.data });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // Get all music genres from database
    axios
      .get("/api/profile/music-genres")
      .then(musicGenres => {
        this.setState({ musicGenres: musicGenres.data });
      })
      .catch(err => {
        console.log(err);
      });
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.radioButtonOnChange = this.radioButtonOnChange.bind(this);
    this.onTempoChange = this.onTempoChange.bind(this);
    this.scaleOnChange = this.scaleOnChange.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.errors) {
      this.setState({
        errors: nextProp.errors
      });
    }
  }

  onChange(e) {
    const { errors } = this.state;
    if (errors[e.target.name] && errors[e.target.name] !== "") {
      this.props.clearErrors(e.target.name);
    }

    this.setState({ [e.target.name]: e.target.value });
  }

  radioButtonOnChange(e) {
    if (e.target.name === "genre_id") {
      this.setState({
        genre_id: e.target.id
      });
    } else {
      this.setState({
        [e.target.name]: !this.state[e.target.name]
      });
      if (e.target.name === "original") {
        this.setState({
          original_by: ""
        });
      }
    }
  }

  onTempoChange(e) {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;
    slider.oninput = function() {
      output.innerHTML = this.value;
    };
    this.setState({ tempo: this.value });
  }

  scaleOnChange(e) {
    this.setState({
      scale: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.bit && projectBitValidation(this.state.bit) !== undefined) {
      const bitErr = projectBitValidation(this.state.bit);
      const errors = this.state.errors;
      errors.bit = bitErr;

      this.componentWillReceiveProps({ errors });
    } else {
      const newProject = {};
      newProject.name = this.state.name;
      newProject.original = this.state.original;
      newProject.original_by = this.state.original_by;
      newProject.tempo = this.state.tempo;
      newProject.bit = this.state.bit;
      newProject.scale = this.state.scale;
      newProject.scale_type = this.state.major ? "Major" : "Minor";
      newProject.genre_id = this.state.genre_id;
      newProject.description = this.state.description;
      newProject.comment = this.state.comment;
      newProject.text = this.state.text;
      newProject.public = this.state.public;

      this.props.createProject(newProject);
    }
  }

  render() {
    const { errors, musicGenres } = this.state;

    const genresList = [];
    musicGenres.map((genre, index) => {
      genresList.push({
        name: genre.music_genre_name,
        value: this.state.genre_id === genre.id.toString(),
        id: genre.id
      });
      return genresList;
    });

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <p className="display-4 text-center">
              <strong>Create Your New Project</strong>
            </p>
            <small className="d-block pb-3">* = required field</small>
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Song name"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                error={errors.name}
                info="Please enter name of the song you gonna play, This name will be also the name of the project"
              />
              <RadioButtenGroup
                name="original"
                value="original"
                onChange={this.radioButtonOnChange}
                options={[
                  {
                    id: "original1",
                    value: this.state.original,
                    name: "Original"
                  },
                  {
                    id: "original2",
                    value: !this.state.original,
                    name: "Cover"
                  }
                ]}
                error={errors.original}
                info="Is that song is original or a cover"
              />

              {!this.state.original ? (
                <TextFieldGroup
                  placeholder="Original song created by"
                  name="original_by"
                  value={this.state.original_by}
                  onChange={this.onChange}
                  error={errors.original_by}
                  info="Please enter name of the original performer"
                />
              ) : null}
              <div className="row">
                <div className="col-4">
                  <SelectListGroup
                    options={scalesList}
                    name="scale"
                    value={this.state.scale !== "" ? this.state.scale : "Scale"}
                    onChange={this.scaleOnChange}
                    error={errors.scale}
                    info="Please choose the scale of your project"
                  />
                </div>
                <div className="col-6">
                  <RadioButtenGroup
                    name="major"
                    value="major"
                    onChange={this.radioButtonOnChange}
                    options={[
                      { id: "major1", value: this.state.major, name: "Major" },
                      { id: "major2", value: !this.state.major, name: "Minor" }
                    ]}
                    error={errors.music_genres}
                  />
                </div>
              </div>

              <RangeSlider
                onChange={this.onTempoChange}
                error={errors.tempo}
                info="Please config the tempo of your project"
              />

              <TextFieldGroup
                placeholder="Config your bit"
                name="bit"
                value={this.state.bit}
                onChange={this.onChange}
                error={errors.bit}
                info="Please config the bit of your project"
              />

              <RadioButtenGroup
                name="genre_id"
                value="genre_id"
                onChange={this.radioButtonOnChange}
                options={genresList}
                error={errors.genre}
                info="Please select the music genre of your project"
              />

              <TextAreaFieldGroup
                placeholder="Description"
                name="description"
                value={this.state.description}
                onChange={this.onChange}
                error={errors.description}
                info="You can describe your purpose in the project"
              />

              <TextAreaFieldGroup
                placeholder="Comment"
                name="comment"
                value={this.state.comment}
                onChange={this.onChange}
                error={errors.comment}
                info="You can add comments about the project"
              />

              <TextAreaFieldGroup
                placeholder="Text of the song"
                name="text"
                value={this.state.text}
                onChange={this.onChange}
                error={errors.text}
                info="If your project incliuding words, you can add it here"
              />
              <RadioButtenGroup
                name="public"
                value="public"
                onChange={this.radioButtonOnChange}
                options={[
                  { id: "public1", value: this.state.public, name: "Public" },
                  { id: "public2", value: !this.state.public, name: "Private" }
                ]}
                error={errors.music_genres}
                info="Do you want to anable other people to see that you opend a new project?"
              />
              <input
                type="submit"
                value="Create project"
                className="btn btn-info btn-block mt-4 mb-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateProject.propTypes = {
  createProject: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProject, clearErrors }
)(withRouter(CreateProject));

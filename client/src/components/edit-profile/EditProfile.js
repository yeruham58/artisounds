import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";
import CheckboxListGroup from "../common/CheckboxListGroup";
import EditProfileImg from "./EditProfileImg";
import {
  createProfile,
  getCurrentProfile,
  clearErrors
} from "../../actions/profileActions";
import isEmpty from "../../validation/isEmpty";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      displayArtPractics: false,
      displayAddedArtTypes: false,
      allArtTypes: [],
      musicGenres: [],
      art_types: "",
      art_practics: [],
      art_types_to_send: [],
      art_practics_to_send: [],
      music_genres_to_send: [],
      location: "",
      description: "",
      website: "",
      youtube: "",
      facebook: "",
      instagram: "",
      inkedin: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.artTypesOnChange = this.artTypesOnChange.bind(this);
    this.checkboxOnChange = this.checkboxOnChange.bind(this);
    this.addArtTypesToSend = this.addArtTypesToSend.bind(this);
    this.createListToCheckbox = this.createListToCheckbox.bind(this);
    this.createMarkupListToAddedCechkbox = this.createMarkupListToAddedCechkbox.bind(
      this
    );
    this.restartArtTypes = this.restartArtTypes.bind(this);
    this.editArtType = this.editArtType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.errors) {
      this.setState({
        errors: nextProp.errors
      });
    }
    if (nextProp.profile) {
      if (nextProp.profile.profile && !Object.keys(nextProp.errors)[0]) {
        const profile = nextProp.profile.profile.profile;
        const profileArts = nextProp.profile.profile.art_types;
        const userMusicGenres = nextProp.profile.profile.music_genres;
        const allArtTypes = nextProp.profile.profile.allArtTypes;
        const musicGenres = nextProp.profile.profile.musicGenres;
        const artTypesList = [];
        const artPracticsList = [];

        for (let artType of profileArts) {
          artTypesList.push(artType.art_type_id);
          for (let artPractic of artType.art_practics.filter(
            artPractic => artPractic.is_active
          )) {
            artPracticsList.push(artPractic.art_practic_details.id);
          }
        }

        const musicGenresList = [];
        for (let musicGenre of userMusicGenres) {
          musicGenresList.push(musicGenre.music_genre_id);
        }

        // Make art types & sub arts to string for to use "isEmpty"
        const artTypesString = artTypesList.toString();
        const artPracticsString = artPracticsList.toString();
        const musicGenresString = musicGenresList.toString();

        profile.art_types = !isEmpty(artTypesString) ? artTypesList : [];
        profile.art_practics = !isEmpty(artPracticsString)
          ? artPracticsList
          : [];
        profile.music_genres = !isEmpty(musicGenresString)
          ? musicGenresList
          : [];
        profile.description = !isEmpty(profile.description)
          ? profile.description
          : "";
        profile.location = !isEmpty(profile.location) ? profile.location : "";
        profile.social = !isEmpty(profile.social) ? profile.social : {};
        profile.social.website = !isEmpty(profile.social.website)
          ? profile.social.website
          : "";
        profile.social.youtube = !isEmpty(profile.social.youtube)
          ? profile.social.youtube
          : "";
        profile.social.facebook = !isEmpty(profile.social.facebook)
          ? profile.social.facebook
          : "";
        profile.social.instagram = !isEmpty(profile.social.instagram)
          ? profile.social.instagram
          : "";
        // Set state with profile data
        this.setState({
          allArtTypes: allArtTypes,
          musicGenres: musicGenres,
          art_types_to_send: profile.art_types,
          art_practics_to_send: profile.art_practics,
          music_genres_to_send: profile.music_genres,
          location: profile.location,
          description: profile.description,
          website: profile.social.website,
          youtube: profile.social.youtube,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram,
          displayAddedArtTypes: profile.art_types[0],
          displayArtPractics: false
        });
      }
    } else {
      this.setState({
        art_types: nextProp,
        displayArtPractics: true
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

  artTypesOnChange(e) {
    this.setState({
      errors: {
        ...this.state.errors,
        art_types: ""
      },
      [e.target.name]: e.target.value,
      art_practics: [],
      displayArtPractics: e.target.value !== "0"
    });
  }

  checkboxOnChange(e) {
    this.props.clearErrors(e.target.name);
    if (e.target.name !== "music_genres_to_send") {
      this.props.clearErrors("art_types");
    }

    if (e.target.checked) {
      this.setState({
        [e.target.name]: [
          ...this.state[e.target.name],
          parseInt(e.target.value)
        ]
      });
      if (e.target.name === "art_types_to_send") {
        this.setState({
          art_practics_to_send: [
            ...this.state.art_practics_to_send,
            this.state.allArtTypes.find(
              artType => artType.id.toString() === e.target.value
            ).art_practics[0].id
          ]
        });
      }
    } else {
      this.setState({
        [e.target.name]: this.state[e.target.name].filter(
          (_, i) =>
            i !== this.state[e.target.name].indexOf(parseInt(e.target.value))
        )
      });
      if (e.target.name === "art_types_to_send") {
        this.setState({
          art_practics_to_send: this.state.art_practics_to_send.filter(
            artPracticId =>
              artPracticId !==
              this.state.allArtTypes.find(
                artType => artType.id.toString() === e.target.value
              ).art_practics[0].id
          )
        });
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (
      this.state.art_types === "0" ||
      this.state.art_types === "" ||
      window.confirm(
        "Are you sure you dont want to add the art types you have marked? if you want to add it,  - press the button 'add' before you submit, press 'ok' to submit, and 'cancle' to add your art types"
      )
    ) {
      const profileData = {
        art_types: this.state.art_types_to_send,
        art_practics: this.state.art_practics_to_send,
        music_genres: this.state.music_genres_to_send,
        location: this.state.location,
        description: this.state.description,
        website: this.state.website,
        youtube: this.state.youtube,
        facebook: this.state.facebook,
        instagram: this.state.instagram
      };

      this.props.createProfile(profileData, this.props.history);
    }
  }

  addArtTypesToSend() {
    if (this.state.art_practics[0] === undefined) {
      const { errors } = this.state;
      this.setState({
        errors: {
          ...errors,
          art_practics:
            "To add an art type to your profile, you shold check at least one art practic"
        }
      });
    } else {
      const art_types_to_send = [
        ...this.state.art_types_to_send,
        parseInt(this.state.art_types)
      ];

      const art_practics_to_send = this.state.art_practics_to_send.concat(
        this.state.art_practics
      );

      this.setState({
        art_types_to_send: art_types_to_send,
        art_practics_to_send: art_practics_to_send,
        displayAddedArtTypes: true
      });
      this.restartArtTypes();
    }
  }

  restartArtTypes() {
    this.setState({
      art_types: "0",
      art_practics: [],
      displayArtPractics: false
    });
  }

  createListToCheckbox(artType, listToEdit) {
    const objList = this.state.allArtTypes.find(
      art_type => art_type.art_type_name === artType
    ).art_practics;
    for (var checkbox in objList) {
      listToEdit.push({
        name: objList[checkbox].art_practic_name,
        value: objList[checkbox].id,
        id: objList[checkbox].id,
        checked: this.state.art_practics.indexOf(objList[checkbox].id) > -1
      });
    }
  }

  createMarkupListToAddedCechkbox(artTypeId, listToEdit) {
    const fullArtType = this.state.allArtTypes.find(
      artType => artType.id === artTypeId
    );
    const objList = fullArtType.art_practics.filter(
      details => this.state.art_practics_to_send.indexOf(details.id) > -1
    );
    for (var subart in objList) {
      listToEdit.push(
        <li key={subart} id={subart}>
          {objList[subart].art_practic_name}
        </li>
      );
    }
  }

  editArtType(artTypeId) {
    const { art_types_to_send, art_practics_to_send, allArtTypes } = this.state;

    const fullArtType = allArtTypes.find(artType => artType.id === artTypeId);

    this.setState({
      art_types_to_send: art_types_to_send.filter(
        (_, i) => i !== art_types_to_send.indexOf(parseInt(artTypeId))
      )
    });
    this.componentWillReceiveProps(artTypeId.toString());

    const filterdArtPractics = art_practics_to_send.filter(subArtId =>
      fullArtType.art_practics.find(subArt => subArt.id === subArtId)
    );

    const filterdArtPracticsToSend = art_practics_to_send.filter(
      subArtId =>
        !fullArtType.art_practics.find(subArt => subArt.id === subArtId)
    );

    this.setState({
      art_practics: filterdArtPractics,
      art_practics_to_send: filterdArtPracticsToSend
    });
  }

  render() {
    const {
      errors,
      allArtTypes,
      art_types_to_send,
      displaySocialInputs,
      displayArtPractics,
      displayAddedArtTypes
    } = this.state;
    let socialInput;
    let artPractics;
    let addedArtTypes;
    let editButton;

    // Select options for art type
    const lableToOptions = this.state.art_types_to_send[0]
      ? "Select another art type (Optional)"
      : "* Select art type";
    let artTypesOptions = [
      {
        lable: lableToOptions,
        value: 0
      }
    ];

    const filterdArtTypes = allArtTypes
      .filter(artType => artType.art_practics[1])
      .filter(artType => this.state.art_types_to_send.indexOf(artType.id) < 0);
    for (var artType in filterdArtTypes) {
      artTypesOptions.push({
        lable: filterdArtTypes[artType].art_type_name,
        value: filterdArtTypes[artType].id
      });
    }

    let checkboxArtTypeOptions = [];

    const filterdArtTypesToCheckbox = allArtTypes.filter(
      artType => !artType.art_practics[1]
    );

    for (var checkboxArtType in filterdArtTypesToCheckbox) {
      checkboxArtTypeOptions.push({
        name: filterdArtTypesToCheckbox[checkboxArtType].art_type_name,
        value: filterdArtTypesToCheckbox[checkboxArtType].id,
        id: filterdArtTypesToCheckbox[checkboxArtType].id,
        checked:
          this.state.art_types_to_send.indexOf(
            filterdArtTypesToCheckbox[checkboxArtType].id
          ) > -1
      });
    }

    if (displaySocialInputs) {
      socialInput = (
        <div>
          <InputGroup
            placeholder="Website URL"
            name="website"
            icon="fas fa-globe"
            value={this.state.website}
            onChange={this.onChange}
            error={errors.website}
          />
          <InputGroup
            placeholder="Youtube Profill URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Facebook Profill URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Instagram Profill URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }

    if (displayArtPractics) {
      // Checkbox options for sub art types and art practics
      let checkboxArtPractics = [];

      const artType = allArtTypes.find(
        artType => artType.id === parseInt(this.state.art_types)
      ).art_type_name;

      this.createListToCheckbox(artType, checkboxArtPractics);

      artPractics = (
        <div>
          <CheckboxListGroup
            name="art_practics"
            value={"art_practics"}
            onChange={this.checkboxOnChange}
            options={checkboxArtPractics}
            lable="* select some art practics"
            error={errors.art_practics}
            info="Check the art practics that relevant to you"
          />
          <small className="text-danger mb-2">{errors.art_practics}</small>
          <div className="mb-3">
            <button
              type="button"
              onClick={this.addArtTypesToSend}
              className="btn btn-light"
            >
              Add
            </button>
            <button
              type="button"
              onClick={this.restartArtTypes}
              className="btn btn-light ml-3"
            >
              Delete
            </button>
          </div>
        </div>
      );
    }

    if (displayAddedArtTypes) {
      addedArtTypes = [];
      for (const [index, artTypeId] of art_types_to_send
        .filter(
          id => allArtTypes.find(artType => artType.id === id).art_practics[1]
        )
        .entries()) {
        const artPractics = [];
        const fullArtType = allArtTypes.find(
          artType => artType.id === artTypeId
        );
        if (this.state.art_types_to_send[0] && this.state.allArtTypes[0]) {
          this.createMarkupListToAddedCechkbox(artTypeId, artPractics);
        }

        editButton = !displayArtPractics ? (
          <button
            type="button"
            onClick={() => this.editArtType(fullArtType.id)}
            className="btn btn-light mt-3"
            value={fullArtType.id}
          >
            Edit
          </button>
        ) : (
          undefined
        );

        addedArtTypes.push(
          <div key={index} id={fullArtType.id} className="mb-3">
            <h3>
              <strong>For {fullArtType.art_type_name}</strong>
            </h3>
            <strong>Your practics are: </strong>
            <div>{artPractics}</div>

            {editButton}
          </div>
        );
      }
    }

    let checkboxMusicGenres = [];

    const { musicGenres } = this.state;

    for (var checkboxMusicGenre in musicGenres) {
      checkboxMusicGenres.push({
        name: musicGenres[checkboxMusicGenre].music_genre_name,
        value: musicGenres[checkboxMusicGenre].id,
        id: musicGenres[checkboxMusicGenre].id,
        checked:
          this.state.music_genres_to_send.indexOf(
            musicGenres[checkboxMusicGenre].id
          ) > -1
      });
    }

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>

              <h1 className="display-4 text-center">Edit Profile</h1>
              <small className="d-block pb-3">* = required field</small>
              {this.props.profile && this.props.profile.profile ? (
                <EditProfileImg profile={this.props.profile.profile} />
              ) : null}

              <form onSubmit={this.onSubmit}>
                {checkboxArtTypeOptions ? (
                  <CheckboxListGroup
                    name="art_types_to_send"
                    value={"art_types"}
                    onChange={this.checkboxOnChange}
                    options={checkboxArtTypeOptions}
                    error={errors.art_types}
                    info="Select from those checkbox what is relevant to you"
                  />
                ) : null}
                {addedArtTypes}
                <SelectListGroup
                  placeholder="* Select your art types"
                  name="art_types"
                  value={this.state.art_types}
                  onChange={this.artTypesOnChange}
                  options={artTypesOptions}
                  error={errors.art_types}
                  info="Please tel us what kind of art are you doing"
                />
                {artPractics}
                <br />
                <strong className="mb-4">
                  Select yout favorit music genres:
                </strong>
                {checkboxArtTypeOptions ? (
                  <CheckboxListGroup
                    name="music_genres_to_send"
                    value={"music_genres"}
                    onChange={this.checkboxOnChange}
                    options={checkboxMusicGenres}
                    error={errors.music_genres}
                    info="Select your favorit music genres"
                  />
                ) : null}
                <TextAreaFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="You can insert some description about you"
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="Please enter your location to help other artist in your area to find for you"
                />
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted ml-3">Optional</span>
                </div>
                {socialInput}
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile, clearErrors }
)(withRouter(CreateProfile));

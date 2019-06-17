import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";
import CheckboxListGroup from "../common/CheckboxListGroup";
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
      displaySubArtTypes: false,
      displayAddedArtTypes: false,
      allArtTypes: [],
      art_types: "",
      sub_art_types: [],
      art_practics: [],
      art_types_to_send: [],
      sub_art_types_to_send: [],
      art_practics_to_send: [],
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
        const allArtTypes = nextProp.profile.profile.allArtTypes;

        const artTypesList = [];
        const subArtTypesList = [];
        const artPracticsList = [];

        for (let artType of profileArts) {
          artTypesList.push(artType.art_type_id);
          for (let subArtType of artType.sub_art_types.filter(
            subArtType => subArtType.is_active
          )) {
            subArtTypesList.push(subArtType.sub_art_type_details.id);
          }
          for (let artPractic of artType.art_practics.filter(
            artPractic => artPractic.is_active
          )) {
            artPracticsList.push(artPractic.art_practic_details.id);
          }
        }

        // Make art types & sub arts to string for to use "isEmpty"
        const artTypesString = artTypesList.toString();
        const subArtTypesString = subArtTypesList.toString();
        const artPracticsString = artPracticsList.toString();

        profile.art_types = !isEmpty(artTypesString) ? artTypesList : [];
        profile.sub_art_types = !isEmpty(subArtTypesString)
          ? subArtTypesList
          : [];
        profile.art_practics = !isEmpty(artPracticsString)
          ? artPracticsList
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
          art_types_to_send: profile.art_types,
          sub_art_types_to_send: profile.sub_art_types,
          art_practics_to_send: profile.art_practics,
          location: profile.location,
          description: profile.description,
          website: profile.social.website,
          youtube: profile.social.youtube,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram,
          displayAddedArtTypes: profile.art_types[0],
          displaySubArtTypes: false
        });
      }
    } else {
      this.setState({
        art_types: nextProp,
        displaySubArtTypes: true
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
      sub_art_types: [],
      art_practics: [],
      displaySubArtTypes: e.target.value !== "0"
    });
  }

  checkboxOnChange(e) {
    this.props.clearErrors(e.target.name);
    this.props.clearErrors("art_types");
    if (e.target.checked) {
      this.setState({
        [e.target.name]: [
          ...this.state[e.target.name],
          parseInt(e.target.value)
        ]
      });
    } else {
      this.setState({
        [e.target.name]: this.state[e.target.name].filter(
          (_, i) =>
            i !== this.state[e.target.name].indexOf(parseInt(e.target.value))
        )
      });
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
        sub_art_types: this.state.sub_art_types_to_send,
        art_practics: this.state.art_practics_to_send,
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
            "To add an art type to your profile, you shold check at list one art practic"
        }
      });
    } else {
      const art_types_to_send = [
        ...this.state.art_types_to_send,
        parseInt(this.state.art_types)
      ];

      const sub_art_types_to_send = this.state.sub_art_types_to_send.concat(
        this.state.sub_art_types
      );
      const art_practics_to_send = this.state.art_practics_to_send.concat(
        this.state.art_practics
      );

      this.setState({
        art_types_to_send: art_types_to_send,
        sub_art_types_to_send: sub_art_types_to_send,
        art_practics_to_send: art_practics_to_send,
        displayAddedArtTypes: true
      });
      this.restartArtTypes();
    }
  }

  restartArtTypes() {
    this.setState({
      art_types: "0",
      sub_art_types: [],
      art_practics: [],
      displaySubArtTypes: false
    });
  }

  createListToCheckbox(listType, artType, listToEdit) {
    const objList = this.state.allArtTypes.find(
      art_type => art_type.art_type_name === artType
    )[listType];
    const subDitailName =
      listType === "sub_art_types" ? "sub_art_type_name" : "art_practic_name";
    for (var checkbox in objList) {
      listToEdit.push({
        name: objList[checkbox][subDitailName],
        value: objList[checkbox].id,
        id: objList[checkbox].id,
        checked: this.state[listType].indexOf(objList[checkbox].id) > -1
      });
    }
  }

  createMarkupListToAddedCechkbox(listType, artTypeId, listToEdit) {
    const fullArtType = this.state.allArtTypes.find(
      artType => artType.id === artTypeId
    );
    const objList = fullArtType[listType].filter(
      details => this.state[listType + "_to_send"].indexOf(details.id) > -1
    );
    const subDitailName =
      listType === "sub_art_types" ? "sub_art_type_name" : "art_practic_name";
    for (var subart in objList) {
      listToEdit.push(
        <li key={subart} id={subart}>
          {objList[subart][subDitailName]}
        </li>
      );
    }
  }

  editArtType(artTypeId) {
    const {
      art_types_to_send,
      sub_art_types_to_send,
      art_practics_to_send,
      allArtTypes
    } = this.state;

    const fullArtType = allArtTypes.find(artType => artType.id === artTypeId);

    this.setState({
      art_types_to_send: art_types_to_send.filter(
        (_, i) => i !== art_types_to_send.indexOf(parseInt(artTypeId))
      )
    });
    this.componentWillReceiveProps(artTypeId.toString());

    const filterdSubArtTypes = sub_art_types_to_send.filter(subArtId =>
      fullArtType.sub_art_types.find(subArt => subArt.id === subArtId)
    );

    const filterdArtPractics = art_practics_to_send.filter(subArtId =>
      fullArtType.art_practics.find(subArt => subArt.id === subArtId)
    );

    const filterdSubArtTypesToSend = sub_art_types_to_send.filter(
      subArtId =>
        !fullArtType.sub_art_types.find(subArt => subArt.id === subArtId)
    );

    const filterdArtPracticsToSend = art_practics_to_send.filter(
      subArtId =>
        !fullArtType.art_practics.find(subArt => subArt.id === subArtId)
    );

    this.setState({
      sub_art_types: filterdSubArtTypes,
      art_practics: filterdArtPractics,
      sub_art_types_to_send: filterdSubArtTypesToSend,
      art_practics_to_send: filterdArtPracticsToSend
    });
  }

  render() {
    const {
      errors,
      allArtTypes,
      art_types_to_send,
      displaySocialInputs,
      displaySubArtTypes,
      displayAddedArtTypes
    } = this.state;
    let socialInput;
    let subArtTypeAndPrctics;
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

    const filterdArtTypes = allArtTypes.filter(
      artType => this.state.art_types_to_send.indexOf(artType.id) < 0
    );
    for (var artType in filterdArtTypes) {
      artTypesOptions.push({
        lable: filterdArtTypes[artType].art_type_name,
        value: filterdArtTypes[artType].id
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

    if (displaySubArtTypes) {
      // Checkbox options for sub art types and art practics
      let checkboxSubArtTypes = [];
      let checkboxArtPractics = [];

      const artType = allArtTypes.find(
        artType => artType.id === parseInt(this.state.art_types)
      ).art_type_name;

      this.createListToCheckbox("sub_art_types", artType, checkboxSubArtTypes);
      this.createListToCheckbox("art_practics", artType, checkboxArtPractics);

      subArtTypeAndPrctics = (
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
          <CheckboxListGroup
            name="sub_art_types"
            value={"sub_art_types"}
            onChange={this.checkboxOnChange}
            options={checkboxSubArtTypes}
            lable="select some sub art types"
            error={errors.sub_art_types}
            info="Check the sub art types that relevant to you"
          />
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
      for (const [index, artTypeId] of art_types_to_send.entries()) {
        const artPractics = [];
        const subArtTypes = [];
        const fullArtType = allArtTypes.find(
          artType => artType.id === artTypeId
        );
        // if (this.state.art_types.indexOf(artTypeId.toString()) < 0) {
        if (this.state.art_types_to_send[0] && this.state.allArtTypes[0]) {
          this.createMarkupListToAddedCechkbox(
            "art_practics",
            artTypeId,
            artPractics
          );
          this.createMarkupListToAddedCechkbox(
            "sub_art_types",
            artTypeId,
            subArtTypes
          );
        }

        editButton = !displaySubArtTypes ? (
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

        const textForSubArtTypes =
          subArtTypes.length > 0 ? "Your sub art types are: " : "";
        addedArtTypes.push(
          <div key={index} id={fullArtType.id} className="mb-3">
            <h3>
              <strong>For {fullArtType.art_type_name}</strong>
            </h3>
            <strong>Your practics are: </strong>
            <div>{artPractics}</div>
            <strong>{textForSubArtTypes}</strong>
            <div>{subArtTypes}</div>
            {editButton}
          </div>
        );
      }
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
              {addedArtTypes}
              <form onSubmit={this.onSubmit}>
                <SelectListGroup
                  placeholder="* Select your art types"
                  name="art_types"
                  value={this.state.art_types}
                  onChange={this.artTypesOnChange}
                  options={artTypesOptions}
                  error={errors.art_types}
                  info="Please tel us what kind of art are you doing"
                />
                {subArtTypeAndPrctics}
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

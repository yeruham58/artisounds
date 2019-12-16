import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import {
  addInstrument,
  updateInstrument
} from "../../../actions/projectActions";
import SelectListGroup from "../../common/SelectListGroup";
import RadioButtenGroup from "../../common/RadioButtenGroup";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";

class AddInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allArtTypes: [],
      instrument_category: "",
      instrument_id: this.props.instrument
        ? this.props.instrument.instrument_detailes.id.toString()
        : null,
      project_id: this.props.project_id,
      original: true,
      role:
        this.props.instrument && this.props.instrument.role
          ? this.props.instrument.role
          : "",
      comments:
        this.props.instrument && this.props.instrument.comments
          ? this.props.instrument.comments
          : "",
      errors: {}
    };

    // Get all art types from database
    axios
      .get("/api/profile/art-types")
      .then(artTypes => {
        this.setState({ allArtTypes: artTypes.data });
        if (this.props.instrument) {
          this.setState({
            instrument_category: artTypes.data
              .find(artType =>
                artType.art_practics.find(
                  artPractic =>
                    artPractic.id.toString() === this.state.instrument_id
                )
              )
              .id.toString()
          });
        }
      })
      .catch(err => {
        console.log(err);
      });

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.categoryOnChange = this.categoryOnChange.bind(this);
    this.radioButtonOnChange = this.radioButtonOnChange.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.instrument_category) {
      this.setState({
        instrument_category: nextProp.instrument_category,
        instrument_id: null
      });
    }
    if (nextProp.errors) {
      this.setState({ errors: nextProp.errors });
    }
  }

  onChange(e) {
    const { errors } = this.state;
    if (errors[e.target.name] && errors[e.target.name] !== "") {
      // this.props.clearErrors(e.target.name);
    }
    this.setState({ [e.target.name]: e.target.value });
  }

  categoryOnChange(e) {
    this.setState({
      errors: {
        ...this.state.errors,
        instrument_category: "",
        instrument: null
      }
    });
    this.componentWillReceiveProps({
      instrument_category: e.target.value
    });

    const instrumentsList = this.state.allArtTypes.find(
      list => list.id === parseInt(e.target.value)
    );

    if (instrumentsList && instrumentsList.art_practics) {
      const filterdInstrumentsList = instrumentsList.art_practics;
      if (filterdInstrumentsList.length === 1) {
        this.setState({
          instrument_id: filterdInstrumentsList[0].id.toString()
        });
      }
    }
  }

  radioButtonOnChange(e) {
    if (e.target.name === "instrument") {
      this.setState({
        errors: {
          ...this.state.errors,
          instrument: null
        }
      });
      this.setState({
        instrument_id: e.target.id
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.state.instrument_id) {
      return this.componentWillReceiveProps({
        errors: { instrument: "This field is required" }
      });
    }
    const newInstrument = {};
    newInstrument.instrument_id = parseInt(this.state.instrument_id);
    newInstrument.project_id = this.state.project_id;
    newInstrument.original = true;
    newInstrument.role = this.state.role;
    newInstrument.comments = this.state.comments;

    if (this.props.instrument) {
      this.props.updateInstrument(this.props.instrument.id, newInstrument);
      this.props.close();
    } else {
      this.props.addInstrument(this.state.project_id, newInstrument);
    }

    this.clearState();
  }

  clearState() {
    this.setState({
      instrument_category: "",
      instrument_id: null,
      role: "",
      comments: "",
      errors: {}
    });
  }

  render() {
    // Select options for instrument categorys
    let instrumentCategorys = [
      {
        lable: "Add instrument",
        value: 0
      }
    ];

    const { allArtTypes } = this.state;
    for (var artType in allArtTypes) {
      instrumentCategorys.push({
        lable: allArtTypes[artType].art_type_name,
        value: allArtTypes[artType].id
      });
    }

    const radioButtenList = [];

    const instrumentsList = this.state.allArtTypes.find(
      list => list.id === parseInt(this.state.instrument_category)
    );

    if (instrumentsList && instrumentsList.art_practics) {
      const filterdInstrumentsList = instrumentsList.art_practics;
      for (var instrument in filterdInstrumentsList) {
        radioButtenList.push({
          name: filterdInstrumentsList[instrument].art_practic_name,
          value:
            filterdInstrumentsList[instrument].id.toString() ===
            this.state.instrument_id,
          id: filterdInstrumentsList[instrument].id
        });
      }
    }

    const { errors } = this.state;

    return (
      <div
        className="container"
        style={{ maxHeight: window.innerHeight, overflowY: "scroll" }}
      >
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={this.onSubmit}>
              <SelectListGroup
                placeholder="Add instrument"
                name="instrument_category"
                value={this.state.instrument_category}
                onChange={this.categoryOnChange}
                options={instrumentCategorys}
                error={errors.instrument_category}
                info="Please select instrument category"
              />
              {this.state.instrument_category !== "" &&
              this.state.instrument_category !== "0" ? (
                <div>
                  <RadioButtenGroup
                    name="instrument"
                    value="instrument"
                    onChange={this.radioButtonOnChange}
                    options={radioButtenList}
                    error={errors.instrument}
                    info="Select the instrument you want to your project"
                  />
                  <TextFieldGroup
                    placeholder="Role"
                    name="role"
                    value={this.state.role}
                    onChange={this.onChange}
                    error={errors.role}
                    info="Please discribe the role of this instrument"
                  />
                  <TextAreaFieldGroup
                    placeholder="Comments"
                    name="comments"
                    value={this.state.comments}
                    onChange={this.onChange}
                    error={errors.comments}
                    info="You can insert some comment about this instrument"
                  />
                  <input
                    type="submit"
                    value={this.props.instrument ? "Update" : "Add instrument"}
                    className="btn btn-info  mt-4 mb-4 mr-3"
                  />
                  <div
                    className="btn btn-light  mt-4 mb-4"
                    onClick={this.clearState}
                  >
                    Cancel
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddInstrument.propTypes = {
  addInstrument: PropTypes.func.isRequired,
  updateInstrument: PropTypes.func.isRequired,
  project_id: PropTypes.number.isRequired,
  instrument: PropTypes.object,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addInstrument, updateInstrument })(
  AddInstrument
);

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";

import ProjectItem from "../projects/ProjectItem";
import InstrumentsFeed from "./InstrumentsFeed";
import Spinner from "../../common/Spinner";
import {
  getProject,
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
      instrument_id: null,
      project_id: null,
      original: true,
      role: "",
      comments: "",
      errors: {}
    };

    // Get all art types from database
    axios
      .get("/api/profile/art-types")
      .then(artTypes => {
        this.setState({ allArtTypes: artTypes.data });
      })
      .catch(err => {
        console.log(err);
      });

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateInstrument = this.updateInstrument.bind(this);
    this.categoryOnChange = this.categoryOnChange.bind(this);
    this.radioButtonOnChange = this.radioButtonOnChange.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
  }

  componentWillReceiveProps(nextProp) {
    if (
      nextProp.project &&
      nextProp.project.project &&
      !nextProp.project.loading
    ) {
      this.setState({
        project_id: nextProp.project.project.id
      });
    }
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

    this.props.addInstrument(this.state.project_id, newInstrument);

    this.setState({
      instrument_category: "",
      instrument_id: null,
      role: "",
      comments: "",
      errors: {}
    });
  }

  updateInstrument(instrumentId, data) {
    this.props.updateInstrument(instrumentId, data);
  }

  render() {
    const { project, loading } = this.props.project;

    let projectContant;
    if (project === null || loading || Object.keys(project).length === 0) {
      projectContant = <Spinner />;
    } else {
      projectContant = (
        <div>
          <ProjectItem project={project} />
        </div>
      );
    }

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
    if (this.props.project.loading || !this.props.project.project) {
      return <Spinner />;
    }
    return (
      <div className="project">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/dashboard" className="btn btn-light mb-3">
                Back to dashboard
              </Link>
              {projectContant}
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
                      value="Add instrument"
                      className="btn btn-info btn-block mt-4 mb-4"
                    />
                  </div>
                ) : null}
              </form>
              {project.instruments && project.instruments[0] ? (
                <InstrumentsFeed
                  instruments={project.instruments}
                  projectOwner={this.props.auth.user.id === project.user_id}
                  projectOwnerId={project.user_id}
                  updateInstrument={this.updateInstrument}
                  logedInUserId={this.props.auth.user.id}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddInstrument.propTypes = {
  getProject: PropTypes.func.isRequired,
  addInstrument: PropTypes.func.isRequired,
  updateInstrument: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProject, addInstrument, updateInstrument }
)(AddInstrument);

import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    //get first name
    const firstName = profile.name.trim().split(" ")[0];

    const artsList = profile.art_types.map((artType, index) => (
      <div key={index} className="p-3">
        <h3>
          <strong>For {artType.art_type_details.art_type_name}:</strong>
        </h3>
        <div>
          {artType.art_practics.filter(
            artPractic => artPractic.is_active
          )[0] ? (
            <div>
              <div className="mb-2">
                <strong>My art practics are:</strong>
              </div>
              {artType.art_practics.map((artPractic, index) => (
                <span key={index} className="p-3">
                  <i className="fas fa-music" />
                  {" " + artPractic.art_practic_details.art_practic_name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          {artType.sub_art_types.filter(subArt => subArt.is_active)[0] ? (
            <div>
              <div className="mb-2 mt-1">
                <strong>My sub art types are:</strong>
              </div>
              {artType.sub_art_types.map((subArt, index) => (
                <span key={index} className="p-3">
                  <i className="fas fa-music" />
                  {" " + subArt.sub_art_type_details.sub_art_type_name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    ));
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            {isEmpty(profile.profile.description) ? null : (
              <div>
                <h3 className="text-center text-info mb-3">
                  {firstName}'s Bio
                </h3>
                <p className="lead">
                  <span>{profile.profile.description}</span>
                </p>
                <hr />
              </div>
            )}

            <h3 className="text-center text-info mb-3">Art Types</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                <div>{artsList}</div>
              </div>
            </div>
            <hr />
            {isEmpty(profile.profile.description) ? null : (
              <div>
                <h3 className="text-center text-info mb-3">
                  {firstName}'s Location
                </h3>
                <p className="lead">
                  <span>{profile.profile.location}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileAbout;

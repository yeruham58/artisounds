import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    //get first name
    const firstName =
      profile.name.charAt(0).toUpperCase() +
      profile.name
        .trim()
        .split(" ")[0]
        .slice(1);

    let singelCategoryArtSrt = "";

    profile.art_types
      .filter(artType => !artType.art_practics[1])
      .map(
        artType =>
          (singelCategoryArtSrt +=
            artType.art_type_details.art_type_name + ", ")
      );

    let userMusicGenres = "";

    profile.music_genres.map(
      musicGenre =>
        (userMusicGenres +=
          musicGenre.music_genre_details.music_genre_name + ", ")
    );

    const artsList = profile.art_types
      .filter(artType => artType.art_practics[1])
      .map((artType, index) => (
        <div key={index} className="p-3">
          <h5>
            <strong>For {artType.art_type_details.art_type_name}:</strong>
          </h5>
          <div>
            {artType.art_practics.filter(
              artPractic => artPractic.is_active
            )[0] ? (
              <div>
                <div className="mb-2">
                  <strong>The instruments I play are are:</strong>
                </div>
                {artType.art_practics
                  .filter(artPractic => artPractic.is_active)
                  .map((artPractic, index) => (
                    <span key={index} className="p-3">
                      <i className="fas fa-music" />
                      {" " + artPractic.art_practic_details.art_practic_name}
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

            <h3 className="text-center text-info mb-3">
              {firstName}'s music sciles
            </h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                <div className="p-3">
                  <h5>
                    <strong>
                      {" "}
                      {singelCategoryArtSrt.substring(
                        0,
                        singelCategoryArtSrt.length - 2
                      ) + "."}
                    </strong>
                  </h5>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                <div>{artsList}</div>
              </div>
            </div>
            <hr />
            {isEmpty(userMusicGenres) ? null : (
              <div>
                <h3 className="text-center text-info mb-3">
                  {firstName}'s favorit genres
                </h3>
                <div className="row">
                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                    <div className="p-3">
                      <h5>
                        <strong>
                          {" "}
                          {userMusicGenres.substring(
                            0,
                            userMusicGenres.length - 2
                          ) + "."}
                        </strong>
                      </h5>
                    </div>
                  </div>
                </div>

                <hr />
              </div>
            )}

            {isEmpty(profile.profile.location) ? null : (
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

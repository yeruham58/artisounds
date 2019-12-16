import React, { Component } from "react";
import isEmpty from "../../validation/isEmpty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // if (!profile.profile && !loading) {
    //   return (
    //     <div className="text-center mt-5">
    //       <strong>This user still don't have an artist profile yet</strong>
    //     </div>
    //   );
    // }

    //get first name
    const firstName =
      profile.name.charAt(0).toUpperCase() +
      profile.name
        .trim()
        .split(" ")[0]
        .slice(1);

    let singelCategoryArtSrt = [];

    profile.art_types
      .filter(artType => !artType.art_practics[1])
      .map(artType =>
        singelCategoryArtSrt.push(
          // (singelCategoryArtSrt +=
          //   artType.art_type_details.art_type_name + ", ")
          <span key={artType.art_type_details.id} className="p-3">
            <i className="fas fa-music" />
            {" " + artType.art_type_details.art_type_name}
          </span>
        )
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
          <div>
            {artType.art_practics.filter(
              artPractic => artPractic.is_active
            )[0] ? (
              <div>
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
                <h5 className="text-center text-info mb-3">
                  <strong>{firstName}'s Bio</strong>
                </h5>
                <p className="lead">
                  <span>{profile.profile.description}</span>
                </p>
                <hr />
              </div>
            )}

            <h5 className="text-center text-info mb-3">
              <strong>{firstName}'s music skills</strong>
            </h5>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                <div className="p-3">{singelCategoryArtSrt}</div>
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
                <h5 className="text-center text-info mb-3">
                  <strong>{firstName}'s favorite genres</strong>
                </h5>
                <div className="row">
                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                    <div className="p-3">
                      <div>
                        {profile.music_genres.map(musicGenre => (
                          <strong
                            key={
                              musicGenre.music_genre_details.music_genre_name
                            }
                            className="genre ml-3"
                          >
                            {"#" +
                              musicGenre.music_genre_details.music_genre_name}
                          </strong>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
              </div>
            )}

            {isEmpty(profile.profile.location) ? null : (
              <div>
                <h5 className="text-center text-info mb-3">
                  <strong>{firstName}'s Location</strong>
                </h5>
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

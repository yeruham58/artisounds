import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class GiveLikePopup extends Component {
  render() {
    const { giveLikeList } = this.props;
    console.log(giveLikeList);
    return giveLikeList.map(giveLike => (
      <div key={giveLike.id}>
        <div
          className="container"
          style={{ maxHeight: window.innerHeight, overflowY: "scroll" }}
        >
          <div className="row" style={{ marginBottom: "5px" }}>
            <div style={{ width: "60px" }}>
              <Link to={`/profile/${giveLike.user_id}`}>
                <img
                  className="rounded-circle"
                  src={giveLike.avatar}
                  alt=""
                  style={{ height: "40px", width: "40px" }}
                />
              </Link>
            </div>
            <div style={{ marginTop: "8px" }}>
              <div>{giveLike.name}</div>
            </div>
          </div>
        </div>
      </div>
    ));
  }
}

GiveLikePopup.propTypes = {
  giveLikeList: PropTypes.array.isRequired
};

export default GiveLikePopup;

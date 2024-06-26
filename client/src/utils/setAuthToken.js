import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // apply to every request
    axios.defaults.headers.common["authorization"] = token;
  } else {
    // Delete the auth header
    delete axios.defaults.headers.common["authorization"];
  }
};

export default setAuthToken;

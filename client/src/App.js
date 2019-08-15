import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import store from "./store";
import PrivateRoute from "./components/common/PrivateRoute";

import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import Navbar from "./components/layout/Navbar";
// import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import Chat from "./components/chat/ChatPage";
import TestChat from "./components/chat/TestChat";
import CreateProject from "./components/projects/create-project/CreateProject";
import ProjectView from "./components/projects/project/ProjectView";
import ProjectFeed from "./components/projects/projects/ProjectFeed";

import "./App.css";

// Chack for token
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token to get user data
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set current user
  store.dispatch(setCurrentUser(decoded));

  // Chace for expired token
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current profile
    store.dispatch(clearCurrentProfile());
    // redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/projects" component={ProjectFeed} />
            <Route
              exact
              path="/project/project-view/:projectId"
              component={ProjectView}
            />
            <Switch>
              <Route
                exact
                path="/profiles/:projectId/:instrumentId"
                component={Profiles}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/feed" component={Posts} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/test-chat" component={TestChat} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/chat" component={Chat} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/chat/:nameAndId" component={Chat} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/create-project"
                component={CreateProject}
              />
            </Switch>
            {/* <Switch>
              <PrivateRoute
                exact
                path="/project/project-view/:projectId"
                component={ProjectView}
              />
            </Switch> */}
            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>
          </div>
          {/* <Footer /> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;

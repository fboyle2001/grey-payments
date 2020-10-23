import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import authContext from './utils/authContext.js';

import NavigationBar from './components/nav/NavigationBar';

import LoginPage from './components/pages/LoginPage';
import LogoutPage from './components/pages/LogoutPage';
import GymPage from './components/pages/GymPage';
import PaymentSuccessPage from './components/pages/PaymentSuccessPage';
import PaymentFailurePage from './components/pages/PaymentFailurePage';

import AdminGymPage from './components/admin-pages/AdminGymPage';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // We store the authContext user in local storage
    // Retrieve it and parse it
    const storedUserState = localStorage.getItem("user");
    let user = null;

    if(storedUserState !== null) {
      try {
        user = JSON.parse(storedUserState);
      } catch (error) {
        user = null;
      }
    }

    this.state = {
      user,
      forceLogout: false
    };
  }

  /*
  * Important to note that all of these functions are client side
  * hence local storage etc are able to be modified. These functions
  * should solely be used to alter things like the navigation bar
  * rather than relied on to check if the user really has permission to
  * access data!
  *
  * Instead the server MUST check on every request (via the session stored
  * server side) whether the user has the correct permissions.
  */

  componentDidUpdate = (oldProps, oldState) => {
    // Updates the local storage with the user info when it is changed
    if(this.state.user !== oldState.user) {
      if(this.state.user === null) {
        localStorage.setItem("user", null);
        return;
      }

      localStorage.setItem("user", JSON.stringify(this.state.user));
    }
  }

  hasLoginExpired = () => {
    // Check if the login session has expired
    if(this.state.user === null) {
      return false;
    }

    const currentDate = new Date().getTime();
    const expires = new Date(this.state.user.expires).getTime();

    return currentDate > expires;
  }

  isLoggedIn = () => {
    // Check if the user is logged in
    // Perform basic checks on the user if it is clearly modified
    if(this.state.user === null) {
      return false;
    }

    if(!this.state.user.hasOwnProperty("expires")) {
      return false;
    }

    if(!this.state.user.hasOwnProperty("username")) {
      return false;
    }

    if(this.hasLoginExpired()) {
      return false;
    }

    return true;
  }

  isAdmin = () => {
    if(!this.isLoggedIn()) {
      return false;
    }

    if(!this.state.user.hasOwnProperty("admin")) {
      return false;
    }

    return this.state.user.admin;
  }

  loginUser = (user) => {
    this.setState({ user });
  }

  logoutUser = () => {
    this.setState({ user: null });
  }

  forceLogout = () => {
    this.setState({ forceLogout: true });
    this.logoutUser();
  }

  componentDidMount = () => {
    if(this.state.user !== null) {
      if(!this.isLoggedIn()) {
        // This is to make things consistent with the server
        // essentially acts as a reset if the user modifies their state heavily
        this.forceLogout();
      }
    }
  }

  render () {
    if(this.state.forceLogout) {
      return (
        <authContext.Provider value={this.state.user}>
          <Router>
            <Redirect to="/logout" />
          </Router>
        </authContext.Provider>
      );
    }

    return (
      <authContext.Provider value={this.state.user}>
        <Router>
          <div className="App">
            <div>
              <Route exact path="/" render={() => (
                <NavigationBar />
              )} />
              <Route exact path="/payments/success/:id" render={(props) => (
                <PaymentSuccessPage {...props} />
              )} />
              <Route exact path="/payments/failure/:id" render={(props) => (
                <PaymentFailurePage {...props} />
              )} />
              <Route exact path="/admin/gym" render={() => (
                this.isAdmin() ? ( <AdminGymPage /> ) : ( <Redirect to="/" /> )
              )} />
              <Route exact path="/login" render={() => (
                this.isLoggedIn() ? ( <Redirect to="/" /> ) : ( <LoginPage loginUser={this.loginUser} /> )
              )} />
              <Route exact path="/logout" render={() => ( <LogoutPage logoutUser={this.logoutUser} /> )} />
              <Route exact path="/gym" render={() => (
                this.isLoggedIn() ? ( <GymPage /> ) : ( <Redirect to="/login" /> )
              )} />
            </div>
          </div>
        </Router>
      </authContext.Provider>
    );
  }
}

export default App;

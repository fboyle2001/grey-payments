import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import authContext from './utils/authContext.js';

import LoginPage from './components/pages/LoginPage';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const storedUser = localStorage.getItem("user");
    let user = null;

    if(storedUser !== null) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.log(error);
        user = null;
      }
    }

    this.state = { user };
  }

  componentDidUpdate = (oldProps, oldState) => {
    if(this.state.user !== oldState.user) {
      if(this.state.user === null) {
        localStorage.setItem("user", null);
        return;
      }

      localStorage.setItem("user", JSON.stringify(this.state.user));
    }
  }

  isLoggedIn = () => {
    return this.state.user != null;
  }

  loginUser = (user) => {
    this.setState({ user });
  }

  logoutUser = () => {
    this.setState({ user: null });
  }

  render() {
    return (
      <authContext.Provider value={this.state.user}>
        <Router>
          <div className="App">
            <div>
              <Route exact path="/login" render={() => (
                this.isLoggedIn() ? ( <Redirect to="/" /> ) : ( <LoginPage loginUser={this.loginUser} /> ))
              } />
            </div>
          </div>
        </Router>
      </authContext.Provider>
    );
  }
}

export default App;

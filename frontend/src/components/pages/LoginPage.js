import React from 'react'
import api from '../../utils/axiosConfig.js';

import LoginForm from '../login/LoginForm';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      disabled: false
    };
  }

  // Will be passed as a prop to LoginForm to allow it to change the message
  updateMessage = message => {
    this.setState({ message });
  }

  // Query the server and attempt to login to the account
  attemptLogin = async (username, password) => {
    this.setState({ disabled: true });

    try {
      await api.post('/api/auth/login', { username, password });
      this.setState({ message: "Logged in" });
    } catch (error) {
      // axios will error if we do not get a 2XX code
      let message;

      switch(error.response.status) {
        case 400:
          message = "Please enter a username and password.";
          break;
        case 401:
          message = "Login failed. Please check your username and password."
          break;
        default:
          message = "Server error. Please try again later."
          break;
      }

      this.setState({ message, disabled: false });
    }
  }

  render () {
    return (
      <React.Fragment>
        <h1>Login Page</h1>
        <LoginForm
          disabled={this.state.disabled}
          updateMessage={this.updateMessage}
          attemptLogin={this.attemptLogin}
        />
        <p>{this.state.message}</p>
      </React.Fragment>
    );
  }
}

export default LoginPage;

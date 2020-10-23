import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ErrorPage extends React.Component {
  constructor(props) {
    super(props);

    let code;

    if(this.props.code) {
      code = this.props.code;
    } else {
      code = this.props.match.params.code;
    }

    this.state = {
      code
    };
  }

  render () {
    switch(this.state.code) {
      case "400":
      case 400:
        return (
          <React.Fragment>
            <h1>Error: Bad Request</h1>
            <p>There was an issue with the action you were trying to perform. Please try again.</p>
            <Link to="/">Click here to return to the homepage</Link>
          </React.Fragment>
        );
      case "401":
      case 401:
        return (
          <React.Fragment>
            <h1>Error: Not Logged In</h1>
            <p>Your session may have expired or you are not logged in.</p>
            <Link to="/accounts/login">Click here to login</Link>
          </React.Fragment>
        );
      case "403":
      case 403:
        return (
          <React.Fragment>
            <h1>Error: Unauthorised Access</h1>
            <p>You were prevented from accessing a restricted page.</p>
            <Link to="/">Click here to return to the homepage</Link>
          </React.Fragment>
        );
      case "404":
      case 404:
        return (
          <React.Fragment>
            <h1>Error: Page Not Found</h1>
            <p>The page you were trying to access does not exist.</p>
            <Link to="/">Click here to return to the homepage</Link>
          </React.Fragment>
        );
      case "500":
      case 500:
        return (
          <React.Fragment>
            <h1>Error: Server Issue</h1>
            <p>There was an issue with the server processing your request. Please try again later.</p>
            <Link to="/">Click here to return to the homepage</Link>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <h1>Error: Unexpected</h1>
            <p>An unexpected error has occurred. Please try again later.</p>
            <Link to="/">Click here to return to the homepage</Link>
          </React.Fragment>
        );
    }
    return (
      <h1>Error {this.state.code}</h1>
    )
  }
}

export default ErrorPage;

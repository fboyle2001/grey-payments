import React from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/axiosConfig.js';
import { Redirect } from 'react-router';

class LogoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  componentDidMount = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error);
      return;
    }

    this.props.logoutUser();
    this.setState({ redirect: true });
  }

  render () {
    if(this.state.redirect) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <React.Fragment />
    )
  }
}

LogoutPage.propTypes = {
  logoutUser: PropTypes.func.isRequired
}

export default LogoutPage;

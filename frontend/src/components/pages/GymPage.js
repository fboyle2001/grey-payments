import React from 'react';
import PropTypes from 'prop-types';

import api from '../../utils/axiosConfig.js';
import NavigationBar from '../nav/NavigationBar';
import ExistingMembership from '../gym/ExistingMembership';
import { Redirect } from 'react-router';

class GymPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      existingMemberships: []
    };
  }

  componentDidMount = async () => {
    let existing;

    try {
      existing = await api.get("/gym");
    } catch (error) {
      if(error.response.status === 401) {
        // User has been logged out
        this.setState({ logout: true });
      }
      return;
    }

    this.setState({ existingMemberships: existing.data.existingEntries });
  }

  render () {
    if(this.state.logout) {
      return (
        <Redirect to="/logout" />
      );
    }

    return (
      <React.Fragment>
        <NavigationBar />
        <h1>Purchase Gym Membership</h1>
        <ExistingMembership
          existingMemberships={this.state.existingMemberships}
        />
      </React.Fragment>
    )
  }
}

export default GymPage;

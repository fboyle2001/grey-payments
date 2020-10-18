import React from 'react';
import PropTypes from 'prop-types';

import NavigationBar from '../nav/NavigationBar';

class GymPage extends React.Component {
  render () {
    return (
      <React.Fragment>
        <NavigationBar />
        <h1>Purchase Gym Membership</h1>
      </React.Fragment>
    )
  }
}

export default GymPage;

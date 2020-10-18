import React from 'react';
import NavigationBarItem from './NavigationBarItem';
import authContext from '../../utils/authContext.js'

// Basic navigation bar for all pages
class NavigationBar extends React.Component {
  render () {
    const user = this.context;

    if(user) {
      // User is logged in
      return (
        <nav>
          <ul>
            <NavigationBarItem title="Home" url="/" />
            <NavigationBarItem title="Gym" url="/gym" />
            <NavigationBarItem title="Logout" url="/logout" />
          </ul>
        </nav>
      );
    }

    // User is logged out

    return (
      <nav>
        <ul>
          <NavigationBarItem title="Home" url="/" />
          <NavigationBarItem title="Login" url="/login" />
        </ul>
      </nav>
    );
  }
}

NavigationBar.contextType = authContext;

export default NavigationBar;

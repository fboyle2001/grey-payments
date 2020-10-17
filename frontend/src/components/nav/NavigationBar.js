import React from 'react';
import NavigationBarItem from './NavigationBarItem';

// Basic navigation bar for all pages
class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <nav>
        <ul>
          <NavigationBarItem title="Home" url="/" />
        </ul>
      </nav>
    );
  }
}

export default NavigationBar;

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class NavigationBarItem extends React.Component {
  render () {
    return (
      <Link to={this.props.url}><li>{this.props.title}</li></Link>
    );
  }
}

NavigationBarItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

export default NavigationBarItem;

import React from 'react';
import PropTypes from 'prop-types';
import api from '../../../utils/axiosConfig';

class ApprovalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      status: 0,
      message: "",
      approved: this.props.approved,
      queried: false
    };
  }

  approveMembership = async () => {
    this.setState({ disabled: true });

    try {
      await api.post("/gym/approve", { id: this.props.id });
    } catch (error) {
      this.setState({ status: error.response.status, message: error.response.data.message, queried: true });
      return;
    }

    this.setState({ approved: true, queried: true });
  }

  render () {
    if(!this.state.queried) {
      if(this.state.approved) {
        return (
          <p>N/A</p>
        );
      }

      return (
        <button
          onClick={this.approveMembership}
          disabled={this.state.disabled}
        >Approve</button>
      );
    }

    if(this.state.approved) {
      return (
        <p>Successfully approved</p>
      );
    }

    return (
      <p>Unable to approve. Please try again later.</p>
    );
  }
}

ApprovalButton.propTypes = {
  approved: PropTypes.bool.isRequired
};

export default ApprovalButton;

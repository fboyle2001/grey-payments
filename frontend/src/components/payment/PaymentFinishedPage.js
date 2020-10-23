import React from 'react';
import PropTypes from 'prop-types';

import api from '../../utils/axiosConfig.js';

class PaymentFinishedPage extends React.Component {
  constructor(props) {
    super(props);

    const { jwt, result } = this.props.match.params;
    const invalidResult = !(result.toLowerCase() === "success" || result.toLowerCase() === "failure");

    this.state = {
      errors: {
        invalidResult
      },
      jwt,
      result: result.toLowerCase(),
      queried: false,
      status: 0,
      message: ""
    };
  }

  componentDidMount = async () => {
    let query;

    try {
      query = await api.post(`/payments/${this.state.result}`, { transactionJWT: this.state.jwt });
    } catch (error) {
      this.setState({ status: error.response.status, message: error.response.data.message, queried: true });
      return;
    }

    this.setState({ status: query.status, message: query.data.message, queried: true });
  }

  render () {
    if(this.state.errors.invalidResult) {
      return (
        <React.Fragment>
          <h1>Invalid RESULT</h1>
        </React.Fragment>
      );
    }

    if(!this.state.queried) {
      return (
        <React.Fragment>
          <h1>Loading...</h1>
        </React.Fragment>
      );
    }

    if(this.state.status !== 200) {
      return (
        <React.Fragment>
          <h1>Non-200 Code {this.state.status}</h1>
        </React.Fragment>
      );
    }

    if(this.state.result === "failure") {
      return (
        <React.Fragment>
          <h1>Payment Failed</h1>
        </React.Fragment>
      )
    } else if (this.state.result === "success") {
      return (
        <React.Fragment>
          <h1>Payment Successful</h1>
        </React.Fragment>
      )
    }
  }
}

export default PaymentFinishedPage;

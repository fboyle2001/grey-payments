import React from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/axiosConfig.js';

class PaymentSuccessPage extends React.Component {
  constructor(props) {
    super(props);
    const transactionId = this.props.match.params.id;
    this.state = {
      transactionId: transactionId,
      queried: false,
      status: 0,
      message: ""
    };
  }

  componentDidMount = async () => {
    let submission;

    try {
      submission = await api.post("/payments/success", { transactionId: this.state.transactionId });
    } catch (error) {
      this.setState({
        status: error.response.status,
        message: error.response.data.message
      });

      if(error.response.status === 401) {
        this.setState({ logout: true });
      }
      return;
    }

    this.setState({
      status: submission.status,
      message: submission.data.message
    });
  }

  render () {
    return (
      <React.Fragment>
        <h1>Payment: SUCCEEDED</h1>
        <h1>{this.state.status}</h1>
        <h1>{this.state.message}</h1>
      </React.Fragment>
    )
  }
}

export default PaymentSuccessPage;

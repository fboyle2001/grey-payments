import React from 'react';
import PropTypes from 'prop-types';

import api from '../../utils/axiosConfig.js';
import NavigationBar from '../nav/NavigationBar';
import ExistingMembership from '../gym/ExistingMembership';
import { Redirect } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51HHsHPKDASE1Hc3S7z0DxdBmHEFhyCxUW0gItUyjdpngmvJlrApgVMw8bEBFRpz3KhbMzMMyPQTzNN8650IGIQo3003jB4idHf");

class GymPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      existingMemberships: [],
      membershipOption: 0
    };
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  purchaseOption = async (e) => {
    const stripe = await stripePromise;
    const response = await api.post("/gym/create_stripe_checkout", { option: this.state.membershipOption });
    const session = await response.data;

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if(result.error) {
      console.log("Handle this error!", result.error);
    }
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
        <select
          name="membershipOption"
          onChange={this.onInputChange}
          value={this.state.membershipOption}
        >
          <option value="0">1 Term</option>
          <option value="1">2 Terms</option>
          <option value="2">Full Year</option>
        </select>
        <button role="link" onClick={this.purchaseOption}>
          Checkout
        </button>
      </React.Fragment>
    )
  }
}

export default GymPage;

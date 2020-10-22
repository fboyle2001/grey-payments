import React from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/axiosConfig';

class AdminGymPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      memberships: []
    };
  }
  componentDidMount = async () => {
    let query;

    try {
      query = await api.get("/gym/all");
    } catch (error) {
      console.log(error);
      // Handle this better
      return;
    }

    const memberships = query.data.memberships;

    this.setState({ ready: true, memberships });
  }

  render () {
    if(!this.state.ready) {
      return (
        <React.Fragment>
          <h1>View Gym Memberships</h1>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <h1>View Gym Memberships</h1>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Purchase Time</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.memberships.map((membership, index) => (
                <tr key={index}>
                  <td>{membership.User.username}</td>
                  <td>{membership.createdAt}</td>
                  <td>{membership.approved ? "Yes" : "No"}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

export default AdminGymPage;

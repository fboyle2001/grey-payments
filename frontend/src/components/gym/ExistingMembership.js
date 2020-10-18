import React from 'react';
import PropTypes from 'prop-types';

class ExistingMembership extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    console.log(JSON.stringify(this.props.existingMemberships, undefined, 2));
    return (
      <React.Fragment>
        <table>
          <thead>
            <tr>
              <th>Created At</th>
              <th>Option</th>
              <th>Approved</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.existingMemberships.map((membership, index) => {
                return (
                  <tr key={index}>
                    <td>{membership.createdAt}</td>
                    <td>{membership.option}</td>
                    <td>{membership.approved ? "Yes": "No"}</td>
                    <td>Need to calculate</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

export default ExistingMembership;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequireAuth from '../components/RequireAuth';

class ManageFeedback extends Component {
  render() {
    return (
      <div>Manage your feedback here.</div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, null)(ManageFeedback);

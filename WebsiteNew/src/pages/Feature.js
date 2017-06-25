import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequireAuth from '../components/RequireAuth';

class Feature extends Component {
  render() {
    return (
      <div>{this.props.message}</div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, null)(RequireAuth(Feature));

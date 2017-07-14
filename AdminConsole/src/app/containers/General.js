import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { General } from '../views';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterGeneral: actions.enterGeneral,
        leaveGeneral: actions.leaveGeneral
      },
      dispatch)
  };
};

class test extends Component {
  render() {
    return (
      <div>Testing 123. Testing 123. Testing 123. Testing 123. Testing 123. Testing 123. Testing 123. Testing 123. Testing 123. Testing 123. </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(General);

// Import libaries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import components
import Router from '../navigation/router';

// Import actions
import { pullProjects } from '../actions';

// Update every 5 minutes (value in milliseconds)
const UPDATE_FREQUENCY = 5 * 60 * 1000;
// Check if update is needed every 1 minute
const CHECK_FREQUENCY = 1 * 60 * 1000;

class Container extends Component {
  componentDidMount() {
    setInterval(this.updateFeedbackFromServer, CHECK_FREQUENCY);
  }

  updateFeedbackFromServer = () => {
    const now = new Date();
    const { lastPulled } = this.props.projects;
    if (now.getTime() - lastPulled.getTime() > UPDATE_FREQUENCY) {
      this.props.pullProjects(this.props.auth.token);
    }
  }

  render() {
    return (
      <Router onNavigationStateChange={null} />
    );
  }
}

Container.propTypes = {
  projects: React.PropTypes.object,
  auth: React.PropTypes.object,
  pullProjects: React.PropTypes.func,
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { pullProjects })(Container);

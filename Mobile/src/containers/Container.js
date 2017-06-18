// Import libaries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import components
import Router from '../navigation/router';

// Import actions
import { pullSuggestions } from '../actions';

// Update every 5 minutes (value in milliseconds)
const UPDATE_FREQUENCY = 5 * 60 * 1000;
// Check if update is needed every 1 minute
const CHECK_FREQUENCY = 1 * 60 * 1000;

class Container extends Component {
  componentDidMount() {
    setInterval(this.updateSuggestionsFromServer, CHECK_FREQUENCY);
  }

  updateSuggestionsFromServer = () => {
    const now = new Date();
    const { lastPulled } = this.props.suggestions;
    if (now.getTime() - lastPulled.getTime() > UPDATE_FREQUENCY) {
      this.props.pullSuggestions(this.props.auth.token);
    }
  }

  render() {
    return (
      <Router onNavigationStateChange={null} />
    );
  }
}

Container.propTypes = {
  suggestions: React.PropTypes.object,
  auth: React.PropTypes.object,
  pullSuggestions: React.PropTypes.func,
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { pullSuggestions })(Container);

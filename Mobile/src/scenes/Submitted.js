// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SubmittedStyles';

// Import tracking
import { sendGoogleAnalytics } from '../actions';

class Submitted extends Component {
  constructor(props) {
    super(props);
    props.sendGoogleAnalytics('Submitted');
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  render() {
    const navToFeedbackList = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
    });
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          {/* To do: To do: Update navigation to use react-navigation */}
          <Button onPress={() => this.props.navigation.dispatch(navToFeedbackList)}>
            Vote on Feedback!
          </Button>
        </View>
      </View>
    );
  }
}

Submitted.propTypes = {
  navigation: PropTypes.object,
  group: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { group } = state;
  return { group };
}

export default connect(mapStateToProps, { sendGoogleAnalytics })(Submitted);

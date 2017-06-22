// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SubmittedStyles';

// Import tracking
// import { tracker } from '../constants';
import { sendGoogleAnalytics } from '../actions';

class Submitted extends Component {
  constructor(props) {
    super(props);

    // tracker.trackScreenViewWithCustomDimensionValues('Submitted', { domain: props.group.domain });
    this.props.sendGoogleAnalytics('Submitted')
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          {/* To do: To do: Update navigation to use react-navigation */}
          <Button onPress={() => this.props.navigation.navigate('FeedbackSwipe')}>
            Vote on Feedback!
          </Button>
        </View>
      </View>
    );
  }
}

Submitted.propTypes = {
  navigation: React.PropTypes.object,
  group: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { group } = state;
  return { group };
}

export default connect(mapStateToProps, { sendGoogleAnalytics })(Submitted);

// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/styles_main';

// Import tracking
// import { tracker } from '../constants';

class Submitted extends Component {
  constructor(props) {
    super(props);

    // tracker.trackScreenViewWithCustomDimensionValues('Submitted', { domain: props.features.domain });
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
  features: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { features } = state;
  return { features };
}

export default connect(mapStateToProps)(Submitted);

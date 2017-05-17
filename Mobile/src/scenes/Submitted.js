// Import Libraries
import React, { Component } from 'react';
import { View, BackAndroid, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import actions
import { navigate } from '../actions';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/styles_main';

class Submitted extends Component {
  constructor(props, context) {
    super(props, context);

    BackAndroid.addEventListener('hardwareBackPress', () => {
      // To do: Update navigation to use react-navigation
      props.navigate({ type: 'pop' });
      return true;
    });
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, paddingTop: 20 }}>
          {/* To do: To do: Update navigation to use react-navigation */}
          <Button onPress={() => this.props.navigation.navigate('NewProjects')}>
            Vote on Feedback!
          </Button>
        </View>
      </View>
    );
  }
}

Submitted.propTypes = {
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { navigate })(Submitted);

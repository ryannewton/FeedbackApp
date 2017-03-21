// Import Libaries
import React, { Component } from 'react';
import { View, BackAndroid, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Import actions
import * as actions from '../actions';

// Import components, functions, and styles
import { Button, Header } from '../components/common';
import styles from '../styles/styles_main';

class Submitted extends Component {
  constructor(props, context) {
    super(props, context);

    BackAndroid.addEventListener('hardwareBackPress', () => {
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
        <Header>
          You Submitted Feedback
        </Header>

        <View style={{ flex: 1, paddingTop: 20 }}>
          <Button onPress={() => this.props.navigate({ type: 'pop-switch', tabKey: 'NewProjects' })}>
            Vote on Feedback!
          </Button>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Submitted);

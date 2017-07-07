// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { authorizeUser, sendGoogleAnalytics } from '../actions';
import loadOnLaunch from '../reducers/load_on_launch';
import styles from '../styles/scenes/AuthorizeStyles';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import { Makiko } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth2.jpg';

class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      cleared: false,
      groupCode: '',
    };

    this.route = this.route.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);

    // tracker.trackScreenView('Authorize');
    props.sendGoogleAnalytics('Authorize');
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cleared === false) {
      this.route(nextProps);
    }
  }

  route(nextProps) {
    if (
      nextProps.auth.loggedIn === true &&
      nextProps.feedback.lastPulled.getTime() !== 0
    ) {
      const navToFeedbackList = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
      });
      this.props.navigation.dispatch(navToFeedbackList);
      this.setState({ cleared: true });
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  authorizeUser() {
    this.props.authorizeUser(
      this.props.auth.email,
      this.state.code,
      this.props.group.groupAuthCode || this.state.groupCode);
    loadOnLaunch();
  }

  renderReportButton() {
    return (
      <Button onPress={this.authorizeUser}>
        ?
      </Button>
    );
  }

  renderSignupButton() {
    return (
      <Button onPress={this.authorizeUser}>
        Verify Email
      </Button>
    );
  }

  renderButtons() {
    if (this.props.auth.loading) {
      return <Spinner />;
    }

    return (
      <View style={{ flex: 1, flexDirection:'row' }}>
        <View style={{ flex: 1 }}>
          {this.renderReportButton()}
        </View>
        <View style={{ flex: 5 }}>
          {this.renderSignupButton()}
        </View>
      </View>
    );
  }

  renderGroup() {
    if (this.props.group.groupAuthCode) {
      return null;
    }

    // User enters group code if email is not in the server
    return (
      <View>
        <Makiko
            label={'Your Group Code'}
            iconClass={FontAwesomeIcon}
            iconName={'user-circle'}
            iconColor={'#00A2FF'}
            inputStyle={{ color: 'black' }}
            value={this.state.groupCode}
            onChangeText={text => this.setState({ groupCode: text })}
            keyboardType="phone-pad"
            maxLength={10}
            // TextInput props
            autoCapitalize={'none'}
            autoCorrect={false}
            style={{ marginLeft: 20, marginRight: 20, marginTop: 0, backgroundColor:'white' }}
            maxLength={100}
          />
      </View>
    );
  }


  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Image style={styles.background} source={fullScreen} resizeMode="cover">
          <Text style={{padding:20, backgroundColor:'rgba(0,0,0,0)', fontSize:18, color:'white'}}>
            We have just sent an Email with 4-digit code to {this.props.auth.email}!
          </Text>
          {/* Email input */}
          <Makiko
            label={'Code from Email'}
            iconClass={FontAwesomeIcon}
            iconName={'envelope-open'}
            iconColor={'#00A2FF'}
            inputStyle={{ color: 'black' }}
            value={this.state.code}
            onChangeText={text => this.setState({ code: text })}
            keyboardType="phone-pad"
            maxLength={10}
            // TextInput props
            autoCapitalize={'none'}
            autoCorrect={false}
            style={{ marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
            maxLength={100}
          />

          {/* Error message (blank if no error) */}
          <Text style={styles.errorTextStyle}>
            {this.props.auth.error}
          </Text>

          {this.renderGroup()}

          {/* Confirmation button, and 'go to login' button */}
          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15, zIndex:5 }}>
            {this.renderButtons()}
          </View>
        </Image>
      </TouchableWithoutFeedback>
    );
  }

}

Authorize.propTypes = {
  auth: PropTypes.object,
  authorizeUser: PropTypes.func,
  navigation: PropTypes.object,
  group: PropTypes.object,
  feedback: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { auth, feedback, group } = state;
  return { auth, feedback, group };
}


export default connect(mapStateToProps, { authorizeUser, sendGoogleAnalytics })(Authorize);

// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { sendAuthorizationEmail, authorizeUserFail, closeInstructions, sendGoogleAnalytics } from '../actions';
import styles from '../styles/scenes/SendAuthorizationEmailStyles';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';

class SendAuthorizationEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };

    this.props.sendGoogleAnalytics('SendAuthEmail')

    this.sendAuthorizationEmail = this.sendAuthorizationEmail.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  sendAuthorizationEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email)) {
      Keyboard.dismiss();
      this.props.sendAuthorizationEmail(this.state.email, () => this.props.navigation.navigate('AuthCode'));
    } else {
      this.props.authorizeUserFail('Invalid Email Address');
    }
  }

  closeInstructions() {
    this.props.closeInstructions('Send Email Scene');
  }

  renderSignupButton() {
    return (
      <Button onPress={this.sendAuthorizationEmail}>
        Send Authorization Email
      </Button>
    );
  }

  renderButtons() {
    if (this.props.auth.loading) {
      return <Spinner />;
    }

    return (
      <View style={{ flex: 1 }}>
        {this.renderSignupButton()}
      </View>
    );
  }

  render() {
    const SendEmailScene = (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container, {backgroundColor: '#00A2FF', flex:1}}>
            {/* Email input */}
            <Sae
              label={'Email Address'}
              iconClass={FontAwesomeIcon}
              iconName={'pencil'}
              iconColor={'white'}
              value={this.state.email}
              // TextInput props
              autoCapitalize={'none'}
              autoCorrect={false}
              style={{margin:20}}
            />
            {/* Error message (blank if no error) */}
            <Text style={styles.errorTextStyle}>
              {this.props.auth.error}
            </Text>

            {/* Confirmation button, and 'go to login' button */}
            <View>
              {this.renderButtons()}
            </View>
        </View>
      </TouchableWithoutFeedback>
    );

    return SendEmailScene;
  }
}

SendAuthorizationEmail.propTypes = {
  auth: React.PropTypes.object,
  sendAuthorizationEmail: React.PropTypes.func,
  authorizeUserFail: React.PropTypes.func,
  user: React.PropTypes.object,
  navigation: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user, auth } = state;
  return { user, auth };
};

export default connect(mapStateToProps, {
  sendAuthorizationEmail,
  authorizeUserFail,
  closeInstructions,
  sendGoogleAnalytics
})(SendAuthorizationEmail);

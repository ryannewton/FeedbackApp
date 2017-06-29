// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { sendAuthorizationEmail, authorizeUserFail, closeInstructions, sendGoogleAnalytics } from '../actions';
import styles from '../styles/scenes/SendAuthorizationEmailStyles';

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
        <View style={styles.container}>
          <Card>
            {/* Email input */}
            <CardSection>
              <Input
                label="Your Email"
                placeholder="tyler@collaborativefeedback.com"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
                keyboardType="email-address"
              />
            </CardSection>

            {/* Error message (blank if no error) */}
            <Text style={styles.errorTextStyle}>
              {this.props.auth.error}
            </Text>

            {/* Confirmation button, and 'go to login' button */}
            <CardSection>
              {this.renderButtons()}
            </CardSection>

            <CardSection>
              <Text style={styles.text}>
                  Why do we need your email? Two reasons:{'\n'}
                  1) We need to confirm you are member of your organization{'\n'}
                  2) We will keep you updated as changes are made based on your feedback
              </Text>
            </CardSection>
          </Card>
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

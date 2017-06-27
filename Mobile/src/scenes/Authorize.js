// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { authorizeUser } from '../actions';
 import loadOnLaunch from '../reducers/load_on_launch';
import styles from '../styles/scenes/AuthorizeStyles';

// Import tracking
// import { tracker } from '../constants';
import { sendGoogleAnalytics } from '../actions';

class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      cleared: false,
      groupCode: ''
    };

    this.route = this.route.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);

    // tracker.trackScreenView('Authorize');
    this.props.sendGoogleAnalytics('Authorize')
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
      nextProps.navigation.navigate('FeedbackList');
      this.setState({ cleared: true });
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  authorizeUser() {
    this.props.authorizeUser(this.props.auth.email, this.state.code, this.props.group.groupAuthCode || this.state.groupCode);
    loadOnLaunch();
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
      <View style={{ flex: 1 }}>
        {this.renderSignupButton()}
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
        <CardSection>
          <Input
            label="Group Code: "
            placeholder="Enter group code here"
            value={this.state.groupCode}
            onChangeText={text => this.setState({ groupCode: text })}
            keyboardType="phone-pad"
          />
        </CardSection>
        <CardSection>
          <Text style={styles.text}>
              Your email was not automatically recognized.{'\n'}
              Please enter your group code.
          </Text>
        </CardSection>
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Card>
            {/* Email input */}
            <CardSection>
              <Input
                label="Code: "
                placeholder="Enter code here"
                value={this.state.code}
                onChangeText={text => this.setState({ code: text })}
                keyboardType="phone-pad"
              />
            </CardSection>

            {/* Error message (blank if no error) */}
            <Text style={styles.errorTextStyle}>
              {this.props.auth.error}
            </Text>

            {/* Confirmation button, and 'go to login' button */}

            <CardSection>
              <Text style={styles.text}>
                  We sent you an email with a 4 digit code.{'\n'}
                  Please enter it here to verify your email address{'\n'}
              </Text>
            </CardSection>
            {this.renderGroup()}
            <CardSection>
              {this.renderButtons()}
            </CardSection>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Authorize.propTypes = {
  auth: React.PropTypes.object,
  authorizeUser: React.PropTypes.func,
  navigation: React.PropTypes.object,
  group: React.PropTypes.object,
  feedback: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { auth, feedback, group } = state;
  return { auth, feedback, group };
}


export default connect(mapStateToProps, { authorizeUser, sendGoogleAnalytics })(Authorize);

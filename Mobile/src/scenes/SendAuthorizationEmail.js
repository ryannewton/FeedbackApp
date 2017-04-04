// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { sendAuthorizationEmail, authorizeUserFail } from '../actions';
import styles from '../styles/styles_main';

class SendAuthorizationEmail extends Component {
  constructor(props) {
    super(props);

    this.route();
    this.state = {
      email: '',
    };
  }

  componentWillUpdate() {
    this.route();
  }

  route() {
    // Route to main if logged in
    if (this.props.auth.loggedIn) {
      this.navigateTo('Tabs', 'NewProjects');
    }
  }

  onButtonPress() {
    const re = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*(?:hbs\.edu|stanford\.edu)$/;
    if (re.test(this.state.email)) {
      this.props.sendAuthorizationEmail(this.state.email, () => this.navigateTo('Auth', 'AuthCode'));
    } else {
      this.props.authorizeUserFail('Invalid Email Address');
    }
  }

  navigateTo(routeName, subRouteName) {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params: {},
      action: NavigationActions.navigate({ routeName: subRouteName }),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderSignupButton() {
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
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
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Card>
            {/* Email input */}
            <CardSection>
              <Input
                label="School Email"
                placeholder="joe@university.edu"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
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
                  1) We need to confirm you are member of your university{'\n'}
                  2) We will keep you updated as changes are made based on your feedback
              </Text>
            </CardSection>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

SendAuthorizationEmail.propTypes = {
  auth: React.PropTypes.object,
  sendAuthorizationEmail: React.PropTypes.func,
  authorizeUserFail: React.PropTypes.func,
  navigation: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

export default connect(mapStateToProps, {
  sendAuthorizationEmail,
  authorizeUserFail,
})(SendAuthorizationEmail);

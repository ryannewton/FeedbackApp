// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { authorizeUser } from '../actions';
import styles from '../styles/styles_main';

class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    this.route = this.route.bind(this);
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

  navigateTo(routeName, subRouteName) {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params: {},
      action: NavigationActions.navigate({ routeName: subRouteName }),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  onButtonPress() {
    this.props.authorizeUser(this.props.auth.email, this.state.code);
  }

  renderSignupButton() {
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
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
                  We sent you an email with a 4 digit code.{'\n'}
                  Please enter it here to verify your email address{'\n'}
              </Text>
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
};

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

export default connect(mapStateToProps, { authorizeUser })(Authorize);

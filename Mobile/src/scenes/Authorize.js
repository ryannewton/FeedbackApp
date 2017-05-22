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
    this.authorizeUser = this.authorizeUser.bind(this);
  }

  componentWilUpdate() {
    this.route();
  }

  route() {
    // We want to naviagte when loggedIn is true (we logged in) and we have stored all the data we need in state
    //   - We need projects and enableNewFeedback
    if (
        this.props.auth.loggedIn === true &&
        this.props.projects !== null &&
        this.props.enableNewFeedback !== null
      ) {
      // If enableNewFeedback is true then we navigate to new projects as normal
      if (this.props.enableNewFeedback) {
        this.props.navigation.navigate('NewProjects');
      // If not, then we navigate to Feedback and disable the New Projects tab
      } else {
        this.props.navigation.navigate('Feedback');
      }
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  authorizeUser() {
    this.props.authorizeUser(this.props.auth.email, this.state.code);
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
  enableNewFeedback: React.PropTypes.bool,
  projects: React.PropTypes.array,
};

function mapStateToProps(state) {
  const { auth, projects } = state;
  const { enableNewFeedback } = state.features;
  return { auth, enableNewFeedback, projects };
}


export default connect(mapStateToProps, { authorizeUser })(Authorize);

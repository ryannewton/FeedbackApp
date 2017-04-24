// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { sendAuthorizationEmail, authorizeUserFail, closeInstructions } from '../actions';
import styles from '../styles/styles_main';
import fullScreen from '../../images/backgrounds/EmailInfo.png';

var styles2 = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  image: {
    flex: 1
  }
});

class SendAuthorizationEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };

    this.sendAuthorizationEmail = this.sendAuthorizationEmail.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  sendAuthorizationEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email)) {
      this.props.sendAuthorizationEmail(this.state.email, () => this.navigateTo('AuthCode'));
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
                label="School Email"
                placeholder="joe@university.edu"
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
                  1) We need to confirm you are member of your university{'\n'}
                  2) We will keep you updated as changes are made based on your feedback
              </Text>
            </CardSection>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );

    const instructionsScreen = (
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={this.closeInstructions} style={{ flex: 1 }}>
          <Image style={styles2.background} source={fullScreen} resizeMode="cover" />
        </TouchableOpacity>
      </View>
    );

    //const screenToShow = (!this.props.user.instructionsViewed.includes('Send Email Scene')) ? instructionsScreen : SendEmailScene;
    const screenToShow = SendEmailScene;

    return screenToShow;
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
})(SendAuthorizationEmail);

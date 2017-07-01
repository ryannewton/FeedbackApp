// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { sendAuthorizationEmail, authorizeUserFail, closeInstructions, sendGoogleAnalytics } from '../actions';
import styles from '../styles/scenes/SendAuthorizationEmailStyles';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Sae, Fumi, Kohana, Makiko, Akira } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth6.jpg';

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
        <Image style={styles.background} source={fullScreen} resizeMode="cover">
            {/* Email input */}
            <Makiko
              label={'Email Address'}
              iconClass={FontAwesomeIcon}
              iconName={'envelope'}
              iconColor={'#00A2FF'}
              inputStyle={{ color: 'black' }}
                            value={this.state.email}
              onChangeText={text => this.setState({ email: text })}
              keyboardType="email-address"
              // TextInput props
              autoCapitalize={'none'}
              autoCorrect={false}
              style={{marginLeft:20, marginRight:20, marginTop:100}}
            />
            {/* Error message (blank if no error) */}
            <Text style={styles.errorTextStyle}>
              {this.props.auth.error}
            </Text>

            {/* Confirmation button, and 'go to login' button */}
            <View style={{marginLeft:15, marginRight:15, marginTop:5}}>
              {this.renderButtons()}
            </View>
        </Image>
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

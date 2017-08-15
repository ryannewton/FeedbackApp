// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { Text } from '../components/common';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

// Import components and action creators
import { Button, Spinner } from '../components/common';
import { verifyEmail, sendGoogleAnalytics } from '../actions';
import styles from '../styles/scenes/AuthorizeStyles';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth2.jpg';
import translate from '../translation'


class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      cleared: false,
    };

    props.sendGoogleAnalytics('Authorize');
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cleared === false) {
      this.route(nextProps);
    }
  }

  route = (nextProps) => {
    if (
      nextProps.auth.loggedIn === true &&
      nextProps.group.groupName !== '' &&
      nextProps.feedback.lastPulled.getTime() !== 0
    ) {
      const navToFeedbackList = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      });
      this.props.navigation.dispatch(navToFeedbackList);
      this.setState({ cleared: true });
    } else if (nextProps.auth.needsGroupCode === true) {
      this.setState({ cleared: true });
      this.props.navigation.navigate('AuthGroupCode', translate(this.props.user.language).ENTER_GROUP_CODE);
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  verifyEmail = () => {
    Keyboard.dismiss();
    this.props.verifyEmail(this.props.auth.email, this.state.code);
  }

  renderSignupButton() {
    const { language } = this.props.user
    return (
      <Button onPress={this.verifyEmail}>
        {translate(language).VERIFY_EMAIL}
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
    const { language } = this.props.user
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Image style={styles.background} source={fullScreen} resizeMode="cover">
          <Text style={{fontWeight: '500', padding:20, backgroundColor:'rgba(0,0,0,0)', fontSize:18, color:'white'}}>
            {translate(language).EMAIL_BLURB_FOR_CODE} {this.props.auth.email}!
          </Text>
          {/* Email input */}
          <Fumi
            label={translate(language).ENTER_CODE}
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
            style={{ height:65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
            maxLength={100}
          />

          {/* Error message (blank if no error) */}
          <Text style={styles.errorTextStyle}>
            {this.props.auth.error}
          </Text>

          {/* Confirmation button, and 'go to login' button */}
          {/*<View style={{ marginLeft: 15, marginRight: 15, marginTop: 15, zIndex:5 }}>*/}
          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
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
  const { auth, feedback, group, user } = state;
  return { auth, feedback, group, user };
}


export default connect(mapStateToProps, { verifyEmail, sendGoogleAnalytics })(Authorize);

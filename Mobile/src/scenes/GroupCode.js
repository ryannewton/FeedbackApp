// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Text } from '../components/common';
import { authorizeUser, sendGoogleAnalytics } from '../actions';
import loadOnLaunch from '../reducers/load_on_launch';
import styles from '../styles/scenes/AuthorizeStyles';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth3.jpg';
import translate from '../translation'

class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupSignupCode: '',
      cleared: false,
    };

    this.route = this.route.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);

    props.sendGoogleAnalytics('Group Code', 'Not Logged In');
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cleared === false) {
      this.route(nextProps);
    }
  }

  route(nextProps) {
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
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  authorizeUser() {
    Keyboard.dismiss();
    this.props.authorizeUser(
      this.props.auth.email,
      this.props.auth.code,
      this.state.groupSignupCode
    );
  }

  renderSignupButton() {
    const { language } = this.props.user
    return (
      <Button onPress={this.authorizeUser}>
        {translate(language).JOIN_GROUP}
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

  requestTrialAlert = () => {
    const { language } = this.props;
    const { OK,
            NEED_GROUP_CODE,
            DISMISS,
            SHARE,
          } = translate(language);

    return (
      Alert.alert(
        NEED_GROUP_CODE,
        'If your community has not been set up yet, send an email to tyler@suggestionboxapp.com to receive your unique group code!',
        [
          {text: OK, onPress: () => null },
        ],
        { cancelable: false }
      )
    );
  }

  render() {
    const { language } = this.props.user
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Image style={styles.background} source={fullScreen} resizeMode="cover">
          <View style={{flexDirection:'row'}}>
            <Text style={{ flex:7, fontWeight: '500', padding: 20, paddingRight:0, backgroundColor: 'rgba(0,0,0,0)', fontSize: 18, color: 'white' }}>
              {translate(language).GROUP_DESCRIPTION}
            </Text>
            <TouchableOpacity onPress={() => this.requestTrialAlert()} style={{ flex:1, margin: 20}}>
              <Icon name="question-circle" type="font-awesome" size={25} color="white" />
            </TouchableOpacity>
          </View>
          {/* Email input */}
          <Fumi
            label={translate(language).GROUP_CODE}
            iconClass={FontAwesomeIcon}
            iconName={'user-circle'}
            iconColor={'#00A2FF'}
            inputStyle={{ color: 'black' }}
            value={this.state.groupSignupCode}
            onChangeText={text => this.setState({ groupSignupCode: text })}

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


export default connect(mapStateToProps, { authorizeUser, sendGoogleAnalytics })(Authorize);

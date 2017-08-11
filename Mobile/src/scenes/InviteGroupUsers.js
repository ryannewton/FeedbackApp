// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Text } from '../components/common';
import { createGroup, sendGoogleAnalytics, updateInviteEmails, sendInviteEmail } from '../actions';
import loadOnLaunch from '../reducers/load_on_launch';
import styles from '../styles/scenes/AuthorizeStyles';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth3.jpg';
import translate from '../translation'

class InviteGroupUsers extends Component {
  state = {
    groupName: '',
    cleared: false,
    email: '',
    showSentNotfication: false,
    showErrorMessage: false,
  }

  componentDidMount() {
    this.props.sendGoogleAnalytics('Invite group users', 'Not Logged In');
  }
  renderSentNotification() {
    if (this.state.showSentNotfication) {
      return (
        <Text>
          Sent!
        </Text>
      );
    }
    return null;
  }
  renderErrorMessage() {
    if (this.state.showErrorMessage) {
      return (
        <Text>
          Please enter a valid email address.
        </Text>
      );
    }
    return null;
  }
  renderInstructions() {
    const { language } = this.props.user;
    return (
      <View style={{ flexDirection:'row' }}>
        <Text style={{ flex:7, fontWeight: '500', padding: 20, backgroundColor: 'rgba(0,0,0,0)', fontSize: 18, color: 'white' }}>
           Your group has been created!{'\n'}
           Group code: {this.props.group.groupName}{'\n'}
           Invite a few people to join the Suggestion Box.
        </Text>
      </View>
    );
  }

  renderGroupNameInput() {
    const { language } = this.props.user;
    return (
      <View style={{ paddingTop: 30, flexDirection: 'column' }}>
        <Fumi
          label={"Enter an email here..."}
          iconClass={FontAwesomeIcon}
          iconName={'users'}
          iconColor={'#00A2FF'}
          inputStyle={{ color: 'black' }}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          keyboardType={'email-address'}

          // TextInput props
          autoCapitalize={'none'}
          autoCorrect={false}
          style={{ height:65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
          maxLength={100}
        />

        <Button onPress={() => {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(this.state.email)) {
            this.props.sendInviteEmail(this.state.email);
            this.setState({ email: '', showSentNotfication: true });
            setTimeout(() => this.setState({ showSentNotfication: false }), 8000);
          } else {
            this.setState({ email: '', showErrorMessage: true });
            setTimeout(() => this.setState({ showErrorMessage: false }), 8000);
          }
          Keyboard.dismiss()

        }}> Send! </Button>
      </View>
    );
  }

  maybeRenderErrorMessage() {
    return (
      <Text style={styles.errorTextStyle}>
        {this.props.group.error}
      </Text>
    );
  }

  renderEnterToBoxButton() {
    return (
      <View>
        <Button onPress={() => {
          const navToFeedbackList = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          });
          this.props.navigation.dispatch(navToFeedbackList);}}
        >
          Enter the Suggestion Box!
        </Button>
      </View>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Image style={styles.background} source={fullScreen} resizeMode="cover">
            {this.renderInstructions()}
            {this.renderSentNotification()}
            {this.renderGroupNameInput()}
            {this.renderErrorMessage()}
            {this.maybeRenderErrorMessage()}
            <View style={{ paddingTop: 40}}>
              {this.renderEnterToBoxButton()}
            </View>
          </Image>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

InviteGroupUsers.propTypes = {
  auth: PropTypes.object,
  createGroup: PropTypes.func,
  navigation: PropTypes.object,
  group: PropTypes.object,
  feedback: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { auth, feedback, group, user } = state;
  return { auth, feedback, group, user };
}


export default connect(mapStateToProps, { createGroup, sendGoogleAnalytics, updateInviteEmails, sendInviteEmail })(InviteGroupUsers);

// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Text } from '../components/common';
import { createGroup, sendGoogleAnalytics, updateInviteEmails } from '../actions';
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
    email1: '',
    email2: '',
    email3: '',
  }

  componentDidMount() {
    this.props.sendGoogleAnalytics('Invite group users', 'Not Logged In');
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.state.cleared === false) {
  //     this.route(nextProps);
  //   }
  // }

  renderInstructions() {
    const { language } = this.props.user;
    return (
      <View style={{ flexDirection:'row' }}>
        <Text style={{ flex:7, fontWeight: '500', padding: 20, paddingRight:0, backgroundColor: 'rgba(0,0,0,0)', fontSize: 18, color: 'white' }}>
          Your group has been created! Invite a few people to get the feedback started.
        </Text>
      </View>
    );
  }

  renderGroupNameInput() {
    const { language } = this.props.user;
    return (
      <View>
        <Fumi
          label={"Enter a friend's email..."}
          iconClass={FontAwesomeIcon}
          iconName={'users'}
          iconColor={'#00A2FF'}
          inputStyle={{ color: 'black' }}
          value={this.props.group.inviteEmails[0]}
          onChangeText={email1 => {
            console.log('updateInviteEmails: ', updateInviteEmails);
            this.props.updateInviteEmails([ email1, this.props.group.inviteEmails[1], this.props.group.inviteEmails[2]])
          }}

          // TextInput props
          autoCapitalize={'none'}
          autoCorrect={false}
          style={{ height:65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
          maxLength={100}
        />
        <Fumi
          label={"Enter a friend's email..."}
          iconClass={FontAwesomeIcon}
          iconName={'users'}
          iconColor={'#00A2FF'}
          inputStyle={{ color: 'black' }}
          value={this.props.group.inviteEmails[1]}
          onChangeText={email2 => this.props.x([ this.props.group.inviteEmails[0], email2, this.props.group.inviteEmails[2]])}

          // TextInput props
          autoCapitalize={'none'}
          autoCorrect={false}
          style={{ height:65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
          maxLength={100}
        />
        <Fumi
          label={"Enter a friend's email..."}
          iconClass={FontAwesomeIcon}
          iconName={'users'}
          iconColor={'#00A2FF'}
          inputStyle={{ color: 'black' }}
          value={this.props.group.inviteEmails[2]}
          onChangeText={email3 => this.props.updateInviteEmails([ this.props.group.inviteEmails[0], this.props.group.inviteEmails[1], email3])}

          // TextInput props
          autoCapitalize={'none'}
          autoCorrect={false}
          style={{ height:65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
          maxLength={100}
        />
      </View>
    );
  }

  maybeRenderErrorMessage() {
    return (
      <Text style={styles.errorTextStyle}>
        {this.props.auth.error}
      </Text>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Image style={styles.background} source={fullScreen} resizeMode="cover">
            {this.renderInstructions()}
            {this.renderGroupNameInput()}
            {this.maybeRenderErrorMessage()}
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


export default connect(mapStateToProps, { createGroup, sendGoogleAnalytics, updateInviteEmails })(InviteGroupUsers);

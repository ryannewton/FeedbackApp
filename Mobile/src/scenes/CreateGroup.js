// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Text } from '../components/common';
import { createGroup, sendGoogleAnalytics } from '../actions';
import loadOnLaunch from '../reducers/load_on_launch';
import styles from '../styles/scenes/AuthorizeStyles';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth3.jpg';
import translate from '../translation'

class CreateGroup extends Component {
  state = {
    groupName: '',
    cleared: false,
  }

  componentDidMount() {
    this.props.sendGoogleAnalytics('Create Group', 'Not Logged In');
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cleared === false) {
      this.route(nextProps);
    }
  }

  renderInstructions() {
    const { language } = this.props.user;
    return (
      <View style={{ flexDirection:'row' }}>
        <Text style={{ flex:7, fontWeight: '500', padding: 20, paddingRight:0, backgroundColor: 'rgba(0,0,0,0)', fontSize: 18, color: 'white' }}>
          {translate(language).CREATE_GROUP_DESCRIPTION}
        </Text>
      </View>
    );
  }

  renderGroupNameInput() {
    const { language } = this.props.user;
    return (
      <Fumi
        label={translate(language).CREATE_GROUP_TEXTINPUT}
        iconClass={FontAwesomeIcon}
        iconName={'users'}
        iconColor={'#00A2FF'}
        inputStyle={{ color: 'black' }}
        value={this.state.groupName}
        onChangeText={groupName => this.setState({ groupName })}

        // TextInput props
        autoCapitalize={'none'}
        autoCorrect={false}
        style={{ height:65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor:'white' }}
        maxLength={100}
      />
    );
  }

  maybeRenderErrorMessage() {
    return (
      <Text style={styles.errorTextStyle}>
        {this.props.auth.error}
      </Text>
    );
  }

  renderSubmitButton() {
    const { language } = this.props.user
    if (this.props.auth.loading) {
      return (
        <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
          <Spinner />
        </View>
      );
    }
    return (
      <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
        <View style={{ flex: 1 }}>
          <Button onPress={() => console.log('you should create an action creator this.props.createGroup')}>
            {translate(language).CREATE_GROUP_BUTTON}
          </Button>
        </View>
      </View>
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
            {this.renderSubmitButton()}
          </Image>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

CreateGroup.propTypes = {
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


export default connect(mapStateToProps, { createGroup, sendGoogleAnalytics })(CreateGroup);

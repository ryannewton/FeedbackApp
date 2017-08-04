// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import components and action creators
import { Button, Spinner, Text } from '../components/common';
import { authorizeUser, sendGoogleAnalytics } from '../actions';
import styles from '../styles/scenes/AuthorizeStyles';

import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import fullScreen from '../../images/backgrounds/auth3.jpg';
import translate from '../translation';

class Authorize extends Component {
  renderCreateButton() {
    const { language } = this.props.user;
    if (this.props.auth.loading) {
      return <Spinner />;
    }

    return (
      <View style={{ flex: 1 }}>
        <Button onPress={this.authorizeUser}>
          {translate(language).CREATE_GROUP}
        </Button>
      </View>
    );
  }

  render() {
    const { language } = this.props.user;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Image style={styles.background} source={fullScreen} resizeMode="cover">
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 7, fontWeight: '500', padding: 20, paddingRight: 0, backgroundColor: 'rgba(0,0,0,0)', fontSize: 18, color: 'white' }}>
              {translate(language).GROUP_DESCRIPTION}
            </Text>
            <TouchableOpacity onPress={() => this.requestTrialAlert()} style={{ flex: 1, margin: 20 }}>
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
            style={{ height: 65, marginLeft: 20, marginRight: 20, marginTop: 10, backgroundColor: 'white' }}
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
  user: PropTypes.object,
};

function mapStateToProps(state) {
  const { auth, feedback, group, user } = state;
  return { auth, feedback, group, user };
}


export default connect(mapStateToProps, { authorizeUser, sendGoogleAnalytics })(Authorize);

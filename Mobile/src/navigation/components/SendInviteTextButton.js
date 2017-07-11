// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

const TEXT_INTRO = 'Join me on Suggestion Box!\n\nGROUP CODE: ';
const APP_STORE_URL = 'https://appurl.io/j4kj90r2';

class SendInviteTextButton extends Component {
  shareAppAlert = () => {
    const textLink = this.buildTextLink(this.props.groupAuthCode);

    return (
      Alert.alert(
        'Invite others',
        'Help others in your community voice their feedback through Suggestion Box.',
        [
          { text: 'Dismiss' },
          {
            text: 'Share',
            onPress: () => {
              Linking.openURL(textLink)
              .catch(error => console.log('Error running shareAppAlert(): ', error));
            },
          },
        ],
        { cancelable: true },
      )
    );
  }

  buildTextLink = () => {
    let textLink = '';
    const message = `${TEXT_INTRO}${this.props.groupAuthCode}\n\n `;

    // Use percent-encoding for Android
    if (Platform.OS === 'android') {
      textLink = `sms:?body=${encodeURIComponent(message)}${APP_STORE_URL}`;
    } else {
      textLink = `sms:&body=${message}${APP_STORE_URL}`;
    }
    return textLink;
  }

  render() {
    return (
      <TouchableOpacity
        sytle={{ width: 50}}
        onPress={() => this.shareAppAlert(this.props.navigation)}
      >
        <Icon name="share" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}


function mapStateToProps(state) {
  const { groupAuthCode } = state.group;
  return { groupAuthCode };
}

export default connect(mapStateToProps)(SendInviteTextButton);

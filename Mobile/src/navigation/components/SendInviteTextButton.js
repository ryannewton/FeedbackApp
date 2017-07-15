// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import translate from '../../translation'


const APP_STORE_URL = 'https://appurl.io/j4kj90r2';

class SendInviteTextButton extends Component {
  textIntro() {
    return translate(this.props.language).TEXT_INTRO;
  }
  shareAppAlert = () => {
    const textLink = this.buildTextLink(this.props.groupAuthCode);
    const { language } = this.props;
    const { INVITE_OTHERS,
            INVITE_OTHERS_BODY,
            DISMISS,
            SHARE,
          } = translate(language);

    return (
      Alert.alert(
        INVITE_OTHERS,
        INVITE_OTHERS_BODY,
        [
          { text: DISMISS },
          {
            text: SHARE,
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
    const message = `${this.textIntro()}${this.props.groupAuthCode}\n\n `;

    // Use percent-encoding for Android
    if (Platform.OS === 'android') {
      textLink = `sms:?body=${encodeURIComponent(message)}${APP_STORE_URL}`;
    } else {
      textLink = `sms:&body=${message}${APP_STORE_URL}`;
    }
    return textLink;
  }

  render() {
    if (this.props.groupName === 'Gymboree') {
      return null;
    }
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
  const { groupAuthCode, groupName } = state.group;
  const { language } = state.user;
  return { groupAuthCode, language, groupName };
}

export default connect(mapStateToProps)(SendInviteTextButton);

import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { sendInviteEmails } from '../../actions';

class InviteGroup extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          const navToFeedbackList = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          });
          this.props.navigation.dispatch(navToFeedbackList);
          this.props.sendInviteEmails(this.props.group.inviteEmails);
        }}
      >
        <Text>
          {this.props.inviteText}
        </Text>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state) {
  const { group } = state;
  return { group };
}

export default connect(mapStateToProps, { sendInviteEmails })(InviteGroup);

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { CardSection, Card } from '../components/common';
import ResponseCardItem from './ResponseCardItem';
import styles from '../styles/components/ResponseCardStyles';

class ResponseCard extends Component {
  render() {
    // Has the server been updated to include a response object?
    // (this is technically checked twice but done for good measure)
    if (!this.props.navigation.state.params.feedback.officialReply) {
      return null;
    }

    const { officialReply } = this.props.navigation.state.params.feedback;
    const { subheaderText } = styles;

    // Is there a response?
    if (officialReply.text !== '') {
      return (
        <Card>
          <CardSection>
            <Text style={subheaderText}>
              Offical Response
            </Text>
            <View style={{ width: 25, height: 20, alignItems: 'flex-start' }}>
              <Icon name="verified-user" color="blue" />
            </View>
          </CardSection>
          <ResponseCardItem text={officialReply} author={''} />
        </Card>
      );
    }
    return null;
  }
}

export default ResponseCard;

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { CardSection, Card } from '../components/common';
import ResponseCardItem from './ResponseCardItem';
import styles from '../styles/scenes/FeedbackDetailsStyles';

class ResponseCard extends Component {
  render() {
    // Has the server been updated to include a response object?
    // (this is technically checked twice but done for good measure)
    if (!this.props.navigation.state.params.feedback.response) {
      return null;
    }

    const { response } = this.props.navigation.state.params.feedback;
    const { subheaderText } = styles;

    // Is there a response?
    if (response.text !== '') {
      return (
        <Card>
          <CardSection>
            <Text style={subheaderText}>
            Offical Response
            <View style={{ width: 25, height: 20 }}>
              <Icon name="verified-user" color="blue" />
            </View>
            </Text>
          </CardSection>
          <ResponseCardItem text={response.text} author={response.author} />
        </Card>
      );
    }
    return null;
  }
}

export default ResponseCard;

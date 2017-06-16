import React, { Component } from 'react';
import { Text } from 'react-native';

import { CardSection, Card } from '../components/common';
import ResponseCardItem from './ResponseCardItem';
import styles from '../styles/scenes/FeedbackDetailsStyles';

class ResponseCard extends Component {

  render() {
    if (!this.props.navigation.state.params.project.response) {
      return null;
    }
    const { response } = this.props.navigation.state.params.project;
    const { subheaderText } = styles;

    // Are there responses?
    if (response.text !== '') {
      return (
        <Card>
          <CardSection>
            <Text style={subheaderText}>
            Offical Response
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

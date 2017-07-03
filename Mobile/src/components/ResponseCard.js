// Import Libraries
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

// Import components, styles, and actions
import { CardSection, Card } from '../components/common';
import ResponseCardItem from './ResponseCardItem';
import styles from '../styles/components/ResponseCardStyles';


class ResponseCard extends Component {
  render() {
    const { officialReply } = this.props.feedback;
    const { subheaderText } = styles;

    // Is there a response?
    if (officialReply) {
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

ResponseCard.propTypes = {
  feedback: PropTypes.object,
};

export default ResponseCard;

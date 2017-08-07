// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from '../components/common';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components, styles, and actions
import { CardSection, Card } from '../components/common';
import ResponseCardItem from './ResponseCardItem';
import styles from '../styles/components/ResponseCardStyles';


class ResponseCard extends Component {
  render() {
    const { officialReply } = this.props.feedback;
    const { subheaderText } = styles;
    const { OFFICIAL_RESPONSE } = this.props.translation;
    // Is there a response?
    if (officialReply) {
      return (
        <Card>
          <CardSection>
            <Text style={subheaderText}>
              {OFFICIAL_RESPONSE}
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

function mapStateToProps(state) {
  const { translation } = state;
  return { translation };
}

export default connect(mapStateToProps)(ResponseCard);

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';


import { CardSection, Card } from '../components/common';
import ResponseCardItem from './ResponseCardItem';
import styles from '../styles/scenes/FeedbackDetailsStyles';

class ResponseCard extends Component {

  render() {
    if (!this.props.navigation.state.params.project.response) {
      return null;
    }

    const { response } = this.props.navigation.state.params.project;
    // const response = {text:'This is a terrible idea!', author:'Boss'}
    const { subheaderText } = styles;

    // Are there responses?
    if (response.text !== '') {
      return (
        <Card>
          <CardSection>
            <Text style={subheaderText}>
            Offical Response
            <View style={{ width:25, height:20}}>
              <Icon name='verified-user' color='blue' />
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

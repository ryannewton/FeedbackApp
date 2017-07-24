// Import Libraries
import React, { Component } from 'react';
import { Card } from './common';

class OfficialReplyCard extends Component {

  render() {
    return (
      <Card style={{ backgroundColor: '#EEEEEE' }}>
        <div>{this.props.text}</div>
      </Card>
    );
  }
}

export default OfficialReplyCard;

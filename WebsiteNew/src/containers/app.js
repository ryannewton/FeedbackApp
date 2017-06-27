import React, { Component } from 'react';
import Header from '../components/Header';

import { token } from '../constants';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

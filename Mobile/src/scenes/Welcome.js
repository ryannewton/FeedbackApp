import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { AppLoading } from 'expo';
import Slides from '../components/IntroSlides';

// Import Images
import pageOneImage from '../../images/backgrounds/1_n.jpg';
import pageTwoImage from '../../images/backgrounds/2_n.jpg';
import pageThreeImage from '../../images/backgrounds/3_n.jpg';
import pageFourImage from '../../images/backgrounds/4_n.jpg';


const SLIDE_DATA = [
  { text: 'Welcome to Suggestion Box', image: pageOneImage, color: '#03A9F4' },
  { text: 'Anonymously submit feedback to management', image: pageTwoImage, color: '#009688' },
  { text: 'Vote on feedback to help issues get visibility', image: pageThreeImage, color: '#03A9F4' },
  { text: 'Get official responses on top feedback', image: pageFourImage, color: '#009688' },
];

class WelcomeScreen extends Component {
  onSlidesComplete = () => {
    this.props.navigation.navigate('SubmitEmail');
  }

  render() {
    return (
      <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete} />
    );
  }
}

function mapStateToProps(state) {
  console.log('state: ', state);
  const { token } = state.auth;
  return { token };
}

export default connect(mapStateToProps)(WelcomeScreen);

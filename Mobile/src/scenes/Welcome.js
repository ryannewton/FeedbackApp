import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { AppLoading } from 'expo';
import Slides from '../components/IntroSlides';

// Import Images
import pageZeroImage from '../../images/backgrounds/language.jpg';
import pageOneImage from '../../images/backgrounds/1_n.jpg';
import pageTwoImage from '../../images/backgrounds/2_n.jpg';
import pageThreeImage from '../../images/backgrounds/3_n.jpg';
import pageFourImage from '../../images/backgrounds/4_n.jpg';

const SLIDE_DATA = [
  { text: "", image: pageZeroImage, color: 'white' },
  { text: 'Welcome to the Suggestion Box!', image: pageOneImage, color: '#03A9F4' },
  { text: 'Anonymously submit feedback for your community...', image: pageTwoImage, color: '#009688' },
  { text: "...and prioritize other members' feedback by voting.", image: pageThreeImage, color: '#03A9F4' },
  { text: "Top feedback will either be addressed or receive an official response", image: pageFourImage, color: '#009688' },
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
  const { group } = state
  return { group };
}

export default connect(mapStateToProps)(WelcomeScreen);

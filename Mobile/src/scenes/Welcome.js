import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { AppLoading } from 'expo';
import Slides from '../components/IntroSlides';
import translate from '../translation'
// Import Images
import pageZeroImage from '../../images/backgrounds/language3.jpg';
import pageOneImage from '../../images/backgrounds/1_n.jpg';
import pageTwoImage from '../../images/backgrounds/2_n.jpg';
import pageThreeImage from '../../images/backgrounds/3_n.jpg';
import pageFourImage from '../../images/backgrounds/4_n.jpg';


class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    props.sendGoogleAnalytics('Welcome Screen', 'Not Logged In');
  }

  slideData() {
    const { language } = this.props.user
    const { INTRO_SLIDE_1,
            INTRO_SLIDE_2,
            INTRO_SLIDE_3,
            INTRO_SLIDE_4
    } = translate(language)
    return [
      { text: "", image: pageZeroImage, color: 'white' },
      { text: INTRO_SLIDE_1, image: pageOneImage, color: '#03A9F4' },
      { text: INTRO_SLIDE_2, image: pageTwoImage, color: '#009688' },
      { text: INTRO_SLIDE_3, image: pageThreeImage, color: '#03A9F4' },
      { text: INTRO_SLIDE_4, image: pageFourImage, color: '#009688' },
    ];
  }

  onSlidesComplete = () => {
    this.props.navigation.navigate('SubmitEmail');
  }

  render() {
    // console.log(language('es'))
    // console.log(language)
    return (
      <Slides data={this.slideData()} onComplete={this.onSlidesComplete} />
    );
  }
}

function mapStateToProps(state) {
  console.log('state: ', state);
  const { group, user } = state
  return { group, user };
}

export default connect(mapStateToProps)(WelcomeScreen);

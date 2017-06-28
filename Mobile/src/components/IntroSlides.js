import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class IntroSlides extends Component {
  renderLastSlide(index) {
    if (index === this.props.data.length - 1) {
      return (
        <Button
          title="Get started"
          raised
          buttonStyle={styles.buttonStyle}
          onPress={this.props.onComplete}
        />
      );
    }
    return null;
  }

  renderText(text) {
    return (
      <View style={styles.textContainer}>
        <View style={{ height: SCREEN_HEIGHT * 0.7 }} />
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    );
  }

  renderSlides() {
    return this.props.data.map((slide, index) => {
      return (
        <View key={slide.text} style={styles.slideStyle}>
          <Image source={slide.image} style={styles.backgroundImageStyle}>
            {this.renderText(slide.text)}
            {this.renderLastSlide(index)}
          </Image>
        </View>
      );
    });
  }

  render() {
    return (
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        pagingEnabled
      >
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = {
  slideStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  textStyle: {
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9,
  },
  buttonStyle: {
    backgroundColor: '#0288D1',
    marginTop: 15,
  },
  backgroundImageStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};

IntroSlides.propTypes = {
  data: React.PropTypes.array,
  onComplete: React.PropTypes.func,
};

export default IntroSlides;

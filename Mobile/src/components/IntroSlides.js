// Import Libraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { languageChoice } from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class IntroSlides extends Component {
  constructor(props){
    super(props)
    this.state = {
      language: null
    }
  }
  languageButtonStyle(language) {
    if (this.state.language === language) {
      return (
        [styles.buttonStyle, {backgroundColor: 'yellow'}]
      );
    }
    return styles.buttonStyle;
  }

  languageButtonPress(language) {
    this.setState({ language });
    this.props.languageChoice(language);
    console.log(language)
    this.myScroll.scrollTo({x: SCREEN_WIDTH, y: 0, animated: true});
  }
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
    } else if (index === 0) {
      return (
        <View>
          <Button
            title="English"
            raised
            buttonStyle={this.languageButtonStyle('en')}
            onPress={() => this.languageButtonPress('en')}
          />
          <Button
            title="Spanish"
            raised
            buttonStyle={this.languageButtonStyle('es')}
            onPress={() => this.languageButtonPress('es')}
          />
          <Button
            title="Vietnamese"
            raised
            buttonStyle={this.languageButtonStyle('vi')}
            onPress={() => this.languageButtonPress('vi')}
          />
        </View>
      )
    }
    return null;
  }

  renderText(text, index) {
    if (index === 0) {
      <View style={styles.textContainer}>
        <View style={{ height: SCREEN_HEIGHT * 0.4 }} />
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    }
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
        <View key={slide.text} style={styles.slideStyle, {backgroundColor:'#00A2FF'}}>
          <Image source={slide.image} style={styles.backgroundImageStyle}>
            {this.renderText(slide.text, index)}
            {this.renderLastSlide(index)}
          </Image>
        </View>
      );
    });
  }

  render() {
    return (
      <ScrollView
        ref={(ref) => this.myScroll = ref}
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
  data: PropTypes.array,
  onComplete: PropTypes.func,
};

function mapStateToProps(state) {
  const { group, user } = state
  return { group, user };
}
export default connect(mapStateToProps, { languageChoice })(IntroSlides);

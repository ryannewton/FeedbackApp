// Import Libraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
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
        [styles.buttonStyle, {backgroundColor: 'rgba(0,0,0,0)'}]
      );
    }
    return styles.buttonStyle;
  }

  languageButtonPress(language) {
    this.setState({ language });
    this.props.languageChoice(language);
    console.log('here')
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
            title="English                                   "
            textStyle={{alignItems:'flex-start'}}
            containerViewStyle={{alignItems:'flex-start'}}
            fontSize={28}
            buttonStyle={[this.languageButtonStyle('en'), { backgroundColor:'rgba(0,0,0,0)', width: SCREEN_WIDTH, paddingTop: SCREEN_HEIGHT * 0.1, paddingBottom: SCREEN_HEIGHT * 0.23 }]}
            onPress={() => this.languageButtonPress('en')}
          >
          </Button>
          <Button
            title="Spanish                                   "
            fontSize={28}
            buttonStyle={[this.languageButtonStyle('es'), { backgroundColor:'rgba(0,0,0,0)', paddingTop: SCREEN_HEIGHT * 0.09, paddingBottom: SCREEN_HEIGHT * 0.09 }]}
            onPress={() => this.languageButtonPress('es')}
          />
          <Button
            title="Vietnamese                              "
            textStyle={{textAlign:'left'}}
            fontSize={28}
            buttonStyle={[this.languageButtonStyle('vi'), { backgroundColor:'rgba(0,0,0,0)', paddingTop: SCREEN_HEIGHT * 0.09, paddingBottom: SCREEN_HEIGHT * 0.09 }]}
            onPress={() => this.languageButtonPress('vi')}
          />
        </View>
      )
    } else {
      return (
        <TouchableOpacity
          style={{width: SCREEN_WIDTH, height:SCREEN_HEIGHT}}
          onPress={() => this.myScroll.scrollTo({x: SCREEN_WIDTH*(index+1), y: 0, animated: true})}
        />
      );
    }
    return null;
  }

  renderText(text, index) {
    if (index === 0) {
      return (
        <View style={styles.textContainer}>
          <View style={{ height: SCREEN_HEIGHT * 0.05 }} />
          <Text style={styles.textStyle}>{text}</Text>
        </View>
      );
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
        <View key={slide.text} style={styles.slideStyle, {backgroundColor:'white'}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{zIndex:5, width: SCREEN_WIDTH, height:SCREEN_HEIGHT}}
          onPress={(index === 0 || index === this.props.data.length - 1)?null:() => this.myScroll.scrollTo({x: SCREEN_WIDTH*(index+1), y: 0, animated: true})}
        >
          <Image source={slide.image} style={styles.backgroundImageStyle}>
            {this.renderText(slide.text, index)}
            {this.renderLastSlide(index)}
          </Image>
          </TouchableOpacity>
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

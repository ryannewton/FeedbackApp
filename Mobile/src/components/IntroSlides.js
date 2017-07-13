// Import Libraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { languageChoice } from '../actions';

import l1 from '../../images/backgrounds/l1.png';
import l2 from '../../images/backgrounds/l2.png';
import l3 from '../../images/backgrounds/l3.png';
import l4 from '../../images/backgrounds/l4.png';

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
        [styles.buttonStyle]
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
        <View style={{alignItems:'center', paddingTop:SCREEN_HEIGHT * 0.14 }}>
          <TouchableOpacity
            style={[this.languageButtonStyle('en'), {
              flexDirection:'row',
              alignItems:'center',
              shadowColor: "#000000",
              shadowOpacity: 0.7,
              shadowRadius: 7,
              shadowOffset: {
                  height: 1,
                  width: 1
                },
              backgroundColor: '#0081cb', 
              width: SCREEN_HEIGHT * 0.45, 
              height: SCREEN_HEIGHT * 0.13, 
            }]}
            onPress={() => this.languageButtonPress('en')}
          >
            <Image
              source={l1}
              style={{
                width: SCREEN_HEIGHT * 0.13,
                height: SCREEN_HEIGHT * 0.13,
                resizeMode: 'contain',
                paddingLeft:SCREEN_HEIGHT*0.02,
                flex:1.6
              }}
            />
            <Text style={{flex:3, textAlign:'center', paddingLeft:SCREEN_HEIGHT*0.01, paddingRight:SCREEN_HEIGHT*0.03, fontSize:SCREEN_HEIGHT*0.025, fontWeight:'bold', color:'white'}}>
              Set default language to English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[this.languageButtonStyle('en'), {
              flexDirection:'row',
              alignItems:'center',
              shadowColor: "#000000",
              shadowOpacity: 0.7,
              shadowRadius: 7,
              shadowOffset: {
                  height: 1,
                  width: 1
                },
              backgroundColor: '#f8c61c', 
              width: SCREEN_HEIGHT * 0.45, 
              height: SCREEN_HEIGHT * 0.13, 
            }]}
            onPress={() => this.languageButtonPress('en')}
          >
            <Image
              source={l2}
              style={{
                width: SCREEN_HEIGHT * 0.13,
                height: SCREEN_HEIGHT * 0.13,
                resizeMode: 'contain',
                paddingLeft:SCREEN_HEIGHT*0.02,
                flex:1.6
              }}
            />
            <Text style={{flex:3, textAlign:'center', paddingLeft:SCREEN_HEIGHT*0.01, paddingRight:SCREEN_HEIGHT*0.03, fontSize:SCREEN_HEIGHT*0.022, fontWeight:'bold', color:'white'}}>
              Utilizar el español como idioma predeterminado
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[this.languageButtonStyle('en'), {
              flexDirection:'row',
              alignItems:'center',
              shadowColor: "#000000",
              shadowOpacity: 0.7,
              shadowRadius: 7,
              shadowOffset: {
                  height: 1,
                  width: 1
                },
              backgroundColor: '#f56b4b', 
              width: SCREEN_HEIGHT * 0.45, 
              height: SCREEN_HEIGHT * 0.13, 
            }]}
            onPress={() => this.languageButtonPress('en')}
          >
            <Image
              source={l3}
              style={{
                width: SCREEN_HEIGHT * 0.13,
                height: SCREEN_HEIGHT * 0.13,
                resizeMode: 'contain',
                paddingLeft:SCREEN_HEIGHT*0.02,
                flex:1.6
              }}
            />
            <Text style={{flex:3, paddingLeft:SCREEN_HEIGHT*0.01, paddingRight:SCREEN_HEIGHT*0.03, textAlign:'center', fontSize:SCREEN_HEIGHT*0.022, fontWeight:'bold', color:'white'}}>
              Sử dụng tiếng Việt làm ngôn ngữ mặc định
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[this.languageButtonStyle('en'), {
              flexDirection:'row',
              alignItems:'center',
              shadowColor: "#000000",
              shadowOpacity: 0.7,
              shadowRadius: 7,
              shadowOffset: {
                  height: 1,
                  width: 1
                },
              backgroundColor: '#f44242', 
              width: SCREEN_HEIGHT * 0.45, 
              height: SCREEN_HEIGHT * 0.13, 
            }]}
            onPress={() => this.languageButtonPress('en')}
          >
            <Image
              source={l4}
              style={{
                width: SCREEN_HEIGHT * 0.13,
                height: SCREEN_HEIGHT * 0.13,
                resizeMode: 'contain',
                paddingLeft:SCREEN_HEIGHT*0.02,
                flex:1.6
              }}
            />
            <Text style={{flex:3, textAlign:'center', paddingLeft:SCREEN_HEIGHT*0.01, paddingRight:SCREEN_HEIGHT*0.03, fontSize:SCREEN_HEIGHT*0.027, fontWeight:'bold', color:'white'}}>
              将简体中文设置为默认语言
            </Text>
          </TouchableOpacity>
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

// Import Libraries
import { Platform, StyleSheet, Dimensions } from 'react-native';

// Import Styles
import { button } from '../common/button_styles';
import standardStyles from '../common/standard_styles';

const {
  instructionContainer,
  image,
  container,
  errorTextStyle,
} = standardStyles;

const { width, height } = Dimensions.get('window')
const styles = {
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFrame: {
    backgroundColor: 'white',
    marginTop: 0,
    marginBottom: 5,
    width: width*0.48,
    height: width*0.48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    elevation: 2,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5,
  },
  feedbackInput: {
    borderColor: '#00A2FF',
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    ...Platform.select({
      ios: { height: 200 },
      android: { height: 140 },
    }),
  },
  positiveFeedbackInput: {
    borderColor: '#98FB98',
    borderWidth: 2,
    ...Platform.select({
      ios: { height: 300 },
      android: { height: 240 },
    }),
  },
  negativeFeedbackInput: {
    borderColor: '#F08080',
    borderWidth: 2,
    ...Platform.select({
      ios: { height: 300 },
      android: { height: 240 },
    }),
  },
  feedbackSceneContainer: {
    paddingTop: 10,
  },
  button,
  instructionContainer,
  image,
  container,
  errorTextStyle,
};

export default styles;

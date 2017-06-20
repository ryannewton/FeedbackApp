// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { button } from '../common/button_styles';
import standardStyles from '../common/standard_styles';

const {
  instructionContainer,
  image,
  container,
  errorTextStyle,
} = standardStyles;

const styles = {
  imageContainer: {
    alignItems: 'center',
  },
  imageFrame: {
    backgroundColor: 'white',
    marginTop: 0,
    marginBottom: 5,
    width: 210,
    height: 210,
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
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    ...Platform.select({
      ios: { height: 200 },
      android: { height: 140 },
    }),
  },
  positiveFeedbackInput: {
    backgroundColor: '#98FB98',
  },
  negativeFeedbackInput: {
    backgroundColor: '#F08080',
  },
  feedbackSceneContainer: {
    paddingTop: 10,
  }
  button,
  instructionContainer,
  image,
  container,
  errorTextStyle,
};

export default styles;

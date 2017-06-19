// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { button } from '../common/button_styles';
import FullscreenStyle from './FullscreenStyle';

const {
  imageContainer,
  image,
  feedbackInput,
  positiveFeedbackInput,
  negativeFeedbackInput,
  swiper,
  container,
  errorTextStyle,
} = FullscreenStyle;

const styles = {
  button,
  instructionContainer: imageContainer,
  image,
  feedbackInput,
  positiveFeedbackInput,
  negativeFeedbackInput,
  swiper,
  container,
  errorTextStyle,
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
};

export default styles;

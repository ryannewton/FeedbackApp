// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';
import { inputText } from '../common/input_styles';
//import { buttonText } from '../common/button_styles';

const styles = StyleSheet.create({
  inputText: {
    ...inputText,
    height: 50,
    marginTop: 5,
    marginBottom: 5,
  },
  submitButton: {
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  container,
});

export default styles;

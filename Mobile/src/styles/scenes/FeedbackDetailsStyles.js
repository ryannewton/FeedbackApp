// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';
import { inputText } from '../common/input_styles';
import { buttonText } from '../common/button_styles';

const styles = StyleSheet.create({
  container,
  buttonText,
  lowWeight: {
    fontWeight: '300',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  subheaderText: {
    fontSize: 17,
    textAlign: 'center',
    flex: 1,
    color: '#555555',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputText: {
    ...inputText,
    height: 60,
    marginTop: 5,
    marginBottom: 5
  },
  solutionText: {
    fontSize: 18,
    color: '#444444',
  },
  noSolutionsMessage: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    color: '#595959',
    fontWeight: '500',
  },
});

export default styles;

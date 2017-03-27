// Import Libraries
import { StyleSheet, PixelRatio } from 'react-native';

// Import Styles
import { buttonText } from '../common/button_styles';

const styles = StyleSheet.create({
  buttonText,
  projectTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#555555',
  },
  row: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  lowWeight: {
    fontWeight: '300',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default styles;

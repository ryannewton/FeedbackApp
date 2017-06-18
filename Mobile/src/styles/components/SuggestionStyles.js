// Import Libraries
import { StyleSheet, PixelRatio } from 'react-native';

// Import Styles
import { buttonText } from '../common/button_styles';
import { bodyText } from '../common/textStyles';

const styles = StyleSheet.create({
  buttonText,
  projectTitle: bodyText,
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
    fontSize: 16
  },
});

export default styles;

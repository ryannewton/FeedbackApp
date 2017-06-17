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
});

export default styles;

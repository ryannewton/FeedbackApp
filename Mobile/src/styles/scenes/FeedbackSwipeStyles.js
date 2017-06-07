// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';
import { bodyText } from '../common/textStyles';

const styles = StyleSheet.create({
  container: {
    ...container,
    backgroundColor: '#A41034',
    flex: 86,
    zIndex: 100000
  },
  swiper: {
    paddingTop: 40
  },
  bodyText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
  },
  smallText: {
    fontWeight: '300',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default styles;

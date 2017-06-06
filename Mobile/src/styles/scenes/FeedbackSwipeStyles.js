// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';
import { bodyText } from '../common/textStyles';

const styles = StyleSheet.create({
  container: {
    ...container,
    backgroundColor: '#A41034',
  },
  swiper: {
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
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

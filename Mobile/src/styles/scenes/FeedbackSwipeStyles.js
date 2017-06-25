// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';
import { bodyText } from '../common/textStyles';

const styles = StyleSheet.create({
  container: {
    ...container,
    backgroundColor: '#00A2FF',
    flex: 86,
    zIndex: 100000
  },
  swiper: {
    paddingTop: 40
  },
});

export default styles;

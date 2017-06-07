// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';
import { bodyText } from '../common/textStyles';

const styles = {
  card: {
    backgroundColor: 'white',
    shadowOffset: {width: 10, height: 10}
  },
    cardButton: {
    alignItems: 'center'
  },
  bodyText: {
    maxHeight: 300,
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
  },
  smallText: {
    fontWeight: '300',
    fontSize: 16,
  },
};

export default styles;

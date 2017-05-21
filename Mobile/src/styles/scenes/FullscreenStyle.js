// Import Libraries
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'stretch',
    width: null,
  },
  image: {
    alignSelf: 'stretch',
    width: null,
  },
  touchableOpacityStyle: {
    ...Platform.select({
      ios: { flex: 1 },
    }),
  },
});

export default styles;
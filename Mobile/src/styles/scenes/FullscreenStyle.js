// Import Libraries
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width: null,
    height: null,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  touchableOpacityStyle: {
    ...Platform.select({
      ios: { flex: 1 },
    }),
  },
});

export default styles;

// Import Libraries
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: { height: 60 },
      android: { height: 45 },
    }),
  },
});

export default styles;

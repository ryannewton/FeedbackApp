// Import Libraries
import { Platform } from 'react-native';

const styles = {
  header: {
    ...Platform.select({
      ios: { height: 60 },
      android: {
        height: 45,
        marginTop: 24,
      },
    }),
  },
};

export default styles;

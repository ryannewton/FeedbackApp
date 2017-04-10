// Import Libraries
import { Platform } from 'react-native';

const styles = {
  header: {
    ...Platform.select({
      ios: { height: 60 },
      android: { height: 45 },
    }),
  },
};

export default styles;

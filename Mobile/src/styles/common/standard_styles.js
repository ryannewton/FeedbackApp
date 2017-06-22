// Import Libraries
import { Platform } from 'react-native';

const styles = {
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
  swiper: {
    paddingTop: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
};

export default styles;

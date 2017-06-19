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
  feedbackInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    ...Platform.select({
      ios: { height: 200 },
      android: { height: 140 },
    }),
  },
  positiveFeedbackInput: {
    backgroundColor: '#98FB98',
  },
  negativeFeedbackInput: {
    backgroundColor: '#F08080',
  },
  swiper: {
    paddingTop: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#A41034',
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
};

export default styles;

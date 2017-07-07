// Import Libraries
import { StyleSheet } from 'react-native';
// container, errorTextStyle, text
const styles = StyleSheet.create({

  // Feedback Scene
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
  },
  errorTextStyle: {
    fontSize: 17,
    alignSelf: 'center',
    color: '#F54B5E',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  background: {
    flex: 1,
    width: null,
  },
});

export default styles;

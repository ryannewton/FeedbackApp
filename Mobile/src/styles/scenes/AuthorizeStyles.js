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
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  background: {
    flex: 1,
    width: null,
  },
});

export default styles;

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
    backgroundColor: '#00A2FF',
  },
  text: {
    fontSize: 16,
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
});

export default styles;

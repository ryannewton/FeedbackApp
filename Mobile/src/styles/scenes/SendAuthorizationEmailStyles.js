// Import Libraries
import { StyleSheet } from 'react-native';

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
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  // Unsure what goes here. SendAuthorizationEmail calls it but it didn't exist
  // Wasn't throwing an error because it supports the overlay that wasn't being used
  background: {

  },
});

export default styles;

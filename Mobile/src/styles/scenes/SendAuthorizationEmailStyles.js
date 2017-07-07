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
    fontSize: 17,
    alignSelf: 'center',
    color: '#F54B5E',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  // Unsure what goes here. SendAuthorizationEmail calls it but it didn't exist
  // Wasn't throwing an error because it supports the overlay that wasn't being used
  background: {
    flex: 1,
    width: null,
  },
});

export default styles;

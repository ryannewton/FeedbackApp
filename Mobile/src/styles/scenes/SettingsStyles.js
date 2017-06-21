import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({

  // Settings Scene
  container: {
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  /*normalMargin: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
  textDisplay: {
    fontWeight: 'bold',
    fontSize: 18,
  },*/
  signoutButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  /*textInput: {
    fontSize: 18,
    ...Platform.select({
      ios: {
        height: 24,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
      },
      android: {
        height: 40,
      },
    }),
  },*/
});

// Import Libraries
import { StyleSheet, PixelRatio, Platform } from 'react-native';

const styles = StyleSheet.create({

  // Feedback Scene
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#A41034',
  },
  text: {
    fontSize: 16,
  },
  feedback_input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    margin: 3,
    marginTop: 0,
    marginBottom: 5,
    marginHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 3,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    ...Platform.select({
      ios: { height: 200 },
      android: { height: 140 },
    }),
  },
  // New Projects Scene
  swiper: {
    paddingTop: 10,
  },

  // Navigation

  // Highest level flexbox
  navigator: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  // Within navigator is cardstack and tabs -- note within cardstack are the scenes
  navigatorCardStack: {
    flex: 20,
    backgroundColor: '#fafafa',
  },
  tabs: {
    flex: 2,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#d5d5d5',
  },

  // Within tabs is tab
  tab: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fefefe',
    justifyContent: 'center',
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  tabSelected: {
    backgroundColor: '#2eb4f0',
  },

  // Projects
  row: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  rowText: {
    fontSize: 17,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  project: {

  },
  lowWeight: {
    fontWeight: '300',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
});

export default styles;

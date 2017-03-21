import {
  StyleSheet,
  PixelRatio,
} from 'react-native';

const styles = StyleSheet.create({

  // Feedback Scene
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F7FCFF',
  },
  text: {
    fontSize: 16,
  },
  feedback_input: {
    fontSize: 18,
    height: 180,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    margin: 3,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  // Navigation

  // Highest level flexbox
  navigator: {
    flex: 1,
  },

  // Within navigator is cardstack and tabs -- note within cardstack are the scenes
  navigatorCardStack: {
    flex: 12,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
  },

  // Within tabs is tab
  tab: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  tabSelected: {
    color: 'blue',
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

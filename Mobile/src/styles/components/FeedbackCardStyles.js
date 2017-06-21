// Import Libraries
import { StyleSheet, PixelRatio } from 'react-native';

// Import Styles
import { buttonText } from '../common/button_styles';
import { bodyText } from '../common/textStyles';

const styles = StyleSheet.create({
  buttonText,
  feedbackTitle: bodyText,
  row: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  lowWeight: {
    fontWeight: '300',
    fontSize: 16,
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteCountStyle: {
    flexDirection: 'column',
  },
  upvoteCountStyle: {
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'flex-end',
  },
  upvoteTextStyle: {
    color: '#48D2A0',
    fontSize: 20,
  },
  downvoteTextStyle: {
    color: '#F54B5E',
    fontSize: 20,
  },
  downvoteCountStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  thumbStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
  imageViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default styles;

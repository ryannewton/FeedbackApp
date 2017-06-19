// Import Libraries
import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';

// Import components, functions, and styles
import FeedbackCard from '../components/FeedbackCard';
import styles from '../styles/scenes/FeedbackListStyles';

// Import tracking
// import { tracker } from '../constants';

class FeedbackList extends Component {
  // constructor(props) {
  //   super(props);
  //   tracker.trackScreenViewWithCustomDimensionValues('Feedback', { domain: props.group.domain });
  // }

  renderAllFeedback() {
    const feedbackList = this.props.feedback.list
      .map(feedbackItem => (
        <FeedbackCard
          feedback={feedbackItem}
          key={feedbackItem.id}
          navigate={this.props.navigation.navigate}
        />
      ),
    );

    return feedbackList;
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.props.feedback.list)}
          renderRow={rowData =>
            <FeedbackCard
              feedback={rowData}
              key={rowData.id}
              navigate={this.props.navigation.navigate}
            />
          }
        />
      </View>
    );
  }
}

FeedbackList.propTypes = {
  navigation: React.PropTypes.object,
  feedback: React.PropTypes.object,
  group: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { feedback, group } = state;
  return { feedback, group };
}

const AppScreen = connect(mapStateToProps, {})(FeedbackList);

export default AppScreen;

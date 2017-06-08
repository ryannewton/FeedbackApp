// Import Libraries
import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';

// Import actions
import { saveProjectChanges } from '../actions';

// Import components, functions, and styles
import FeedbackCard from '../components/FeedbackCard';
import styles from '../styles/scenes/FeedbackListStyles';

// Import tracking
import { tracker } from '../constants';

class FeedbackList extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenViewWithCustomDimensionValues('Projects', { domain: props.features.domain });
  }

  renderAllFeedback() {
    const feedbackList = this.props.projects.list
      .map(feedbackItem => (
        <FeedbackCard
          project={feedbackItem}
          key={feedbackItem.id}
          navigate={this.props.navigation.navigate}
          saveProjectChanges={this.props.saveProjectChanges}
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
          dataSource={ds.cloneWithRows(this.props.projects.list)}
          initialListSize={200}
          removeClippedSubviews={false}
          renderRow={rowData =>
            <FeedbackCard
              project={rowData}
              key={rowData.id}
              navigate={this.props.navigation.navigate}
              saveProjectChanges={this.props.saveProjectChanges}
            />
          }
        />
      </View>
    );
  }
}

FeedbackList.propTypes = {
  navigation: React.PropTypes.object,
  projects: React.PropTypes.object,
  saveProjectChanges: React.PropTypes.func,
  features: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { projects, features } = state;
  return { projects, features };
}

const AppScreen = connect(mapStateToProps, {
  saveProjectChanges,
})(FeedbackList);

export default AppScreen;

// Import Libraries
import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';

// Import components, functions, and styles
import SuggestionCard from '../components/SuggestionCard';
import styles from '../styles/scenes/SuggestionListStyles';

// Import tracking
// import { tracker } from '../constants';

class SuggestionList extends Component {
  constructor(props) {
    super(props);
    // tracker.trackScreenViewWithCustomDimensionValues('Projects', { domain: props.group.domain });
  }

  renderAllSuggestion() {
    const feedbackList = this.props.projects.list
      .map(feedbackItem => (
        <SuggestionCard
          project={feedbackItem}
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
          dataSource={ds.cloneWithRows(this.props.projects.list)}
          renderRow={rowData =>
            <SuggestionCard
              project={rowData}
              key={rowData.id}
              navigate={this.props.navigation.navigate}
            />
          }
        />
      </View>
    );
  }
}

SuggestionList.propTypes = {
  navigation: React.PropTypes.object,
  projects: React.PropTypes.object,
  group: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { projects, group } = state;
  return { projects, group };
}

const AppScreen = connect(mapStateToProps, {})(SuggestionList);

export default AppScreen;

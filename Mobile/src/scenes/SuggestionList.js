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
  // constructor(props) {
  //   super(props);
  //   tracker.trackScreenViewWithCustomDimensionValues('Suggestions', { domain: props.group.domain });
  // }

  renderAllSuggestion() {
    const suggestionList = this.props.suggestions.list
      .map(suggestionItem => (
        <SuggestionCard
          suggestion={suggestionItem}
          key={suggestionItem.id}
          navigate={this.props.navigation.navigate}
        />
      ),
    );

    return suggestionList;
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.props.suggestions.list)}
          renderRow={rowData =>
            <SuggestionCard
              suggestion={rowData}
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
  suggestions: React.PropTypes.object,
  group: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { suggestions, group } = state;
  return { suggestions, group };
}

const AppScreen = connect(mapStateToProps, {})(SuggestionList);

export default AppScreen;

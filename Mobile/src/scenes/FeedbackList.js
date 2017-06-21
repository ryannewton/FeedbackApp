// Import Libraries
import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

// Import components, functions, and styles
import FeedbackCard from '../components/FeedbackCard';
import styles from '../styles/scenes/FeedbackListStyles';

// Import tracking
// import { tracker } from '../constants';

class FeedbackList extends Component {
  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.props.feedback.list)}
          renderRow={rowData =>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Details', { feedback: rowData })}
              >
              <FeedbackCard
                feedback={rowData}
                key={rowData.id}
                navigate={this.props.navigation.navigate}
                showResponseTag={Boolean(true)}
              />
            </TouchableOpacity>
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

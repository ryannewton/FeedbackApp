// Import Libraries
import React, { Component } from 'react';
import {
  Image,
  View,
  ListView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { Text } from '../components/common';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'qs';
import Expo from 'expo';

// Import components, functions, and styles
import FeedbackCard from '../components/FeedbackCard';
import styles from '../styles/scenes/FeedbackListStyles';
import registerForNotifications from '../services/push_notifications';
import { Icon } from 'react-native-elements';
import translate from '../translation';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Import tracking
import { sendGoogleAnalytics, pullFeedback, pullSolutions, clearFeedbackOnState, route } from '../actions';

const stopwords = require('stopwords').english;
import nothing from '../../images/backgrounds/nothing.jpg';

class FeedbackList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStatus: 'queue',
    };

    props.sendGoogleAnalytics('FeedbackList');
  }

  componentDidMount() {
    registerForNotifications(this.props.token);

    Linking.getInitialURL().then((url) => {
      if (url) {
        this._handleUrl(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  render() {
    const filteredFeedback = this.filterFeedback();
    const sortedFeedback = this.sortFeedback(filteredFeedback);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = ds.cloneWithRows(sortedFeedback);

    const noFeedbackFound = (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.props.feedback.refreshing}
            onRefresh={this.refresh}
          />
        }
      >
        <Image style={[styles.background, { height: SCREEN_HEIGHT - 88 }]} source={nothing} resizeMode="cover">
        <Text style={{zIndex:100, position:'absolute', top:SCREEN_HEIGHT*0.52, fontSize:SCREEN_HEIGHT*0.05, color:'grey'}}>{translate(this.props.user.language).NOTHING_FOUND}</Text>
        </Image>
      </ScrollView>
    );

    const feedbackFound = (
      <ListView
        style = {{zIndex: -1}}
        dataSource={dataSource}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={this.props.feedback.refreshing}
            onRefresh={this.refresh}
          />
        }
        renderRow={rowData =>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Details', {
              feedback: rowData,
               translate: translate(this.props.user.language).FEEDBACK_DETAIL,
              }
            )}
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
    );

    return (
      <View style={styles.container}>
        {this.renderShowCategory()}
        {sortedFeedback.length ? feedbackFound : noFeedbackFound}
        {this.renderFeedbackSubmitButton()}
      </View>
    )
  }

  sortFeedback = (filteredFeedback) => {
    if (this.props.feedback.sortMethod === 'New') {
      return filteredFeedback.sort((a,b) => new Date(b.date) - new Date(a.date));
    } else {
      return filteredFeedback.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    }
  }

  filterFeedback = () => {
    // Return a list of feedback given the filter/search value
    const { filterMethod, list, searchQuery } = this.props.feedback;
    const { selectedStatus } = this.state;
    const { userId } = this.props.user;

    return list.filter((feedback) => {
      if (selectedStatus === 'queue') {
        if (feedback.status !== 'queue' && feedback.status !== 'new') return false;
      } else {
        if (selectedStatus !== feedback.status) return false;
      }
      switch (filterMethod) {
        case 'all':
          break;
        case 'search':
          if (!feedback.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
          break;
        case 'thisWeek':
          let feedbackDate = new Date(feedback.date).getTime();
          const oneWeekAgo = Date.now() - (60000 * 60 * 24 * 7);
          if (feedbackDate < oneWeekAgo) return false;
          break;
        case 'today':
          feedbackDate = new Date(feedback.date).getTime();
          const oneDayAgo = Date.now() - (60000 * 60 * 24);
          if (feedbackDate < oneDayAgo) return false;
          break;
        case 'myFeedback':
          if (feedback.userId !== userId) return false;
          break;
        default:
          if (feedback.category !== filterMethod) return false;
      }      
      return true;    
    });
  }

  _handleUrl = (url) => {
    if (!url === Expo.Constants.linkingUri) {
      let queryString = url.replace(Expo.Constants.linkingUri, '');
      if (queryString && !this.props.feedback.route) {
        let data = qs.parse(queryString);
        const index = this.props.feedback.list.findIndex(feedback => feedback.id === parseInt(data.feedback));
        this.props.navigation.navigate('Details', {
          feedback: this.props.feedback.list[index],
           translate: translate(this.props.user.language).FEEDBACK_DETAIL,
          }
        );
        this.props.route()
      }
    }
  }

  renderShowCategory = () => {
    const { language } = this.props.user;
    const {
      OPEN,
      INPROCESS,
      COMPLETE,
    } = translate(language)
    const { selectedStatus } = this.state;
    const statusSelectorStyle = [styles.statusSelector];

    if (this.props.group.includePositiveFeedbackBox) return null;

    return (
      <View style={{ flexDirection:'row', backgroundColor:'#00A2FF'}}>
        <TouchableOpacity
          style={(selectedStatus === 'queue') ? [styles.statusSelector, styles.statusSelectorSelected] : [styles.statusSelector]}
          onPress={() => {this.setState({ selectedStatus:'queue' });}}
        >
          <Text
            style={(selectedStatus === 'queue') ? [styles.categoryText, styles.categoryTextSelected] : [styles.categoryText]}
          >
            {OPEN}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={(selectedStatus === 'inprocess') ? [styles.statusSelector, styles.statusSelectorSelected] : [styles.statusSelector]}
          onPress={() => {this.setState({ selectedStatus:'inprocess' });}}
        >
          <Text
            style={(selectedStatus === 'inprocess') ? [styles.categoryText, styles.categoryTextSelected] : [styles.categoryText]}
          >
            {INPROCESS}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={(selectedStatus === 'complete') ? [styles.statusSelector, styles.statusSelectorSelected] : [styles.statusSelector]}
          onPress={() => {this.setState({ selectedStatus:'complete' });}}
        >
          <Text
            style={(selectedStatus === 'complete') ? [styles.categoryText, styles.categoryTextSelected] : [styles.categoryText]}
          >
            {COMPLETE}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  refresh = () => {
    const { token } = this.props;
    this.props.pullFeedback(token);
    this.props.pullSolutions(token);
  }

  renderFeedbackSubmitButton = () => {
    const submitScene = this.props.group.includePositiveFeedbackBox ? 'FeedbackSubmitSplit' : 'FeedbackSubmit';
    return (
      <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate(submitScene, { language: translate(this.props.user.language).SUBMIT_FEEDBACK});
          this.props.clearFeedbackOnState();
        }}>
          <Icon name="mode-edit" size={30} color={'#00A2FF'} backgroundColor={'red'} raised reverse />
        </TouchableOpacity>
      </View>
    )
  }
}

FeedbackList.propTypes = {
  navigation: PropTypes.object,
  feedback: PropTypes.object,
  group: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { feedback, group, user, auth: { token } } = state;
  return { feedback, group, user, token };
}

const AppScreen = connect(mapStateToProps, {
  sendGoogleAnalytics,
  pullFeedback,
  pullSolutions,
  clearFeedbackOnState,
  route,
})(FeedbackList);

export default AppScreen;

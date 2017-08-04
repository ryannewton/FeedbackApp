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
} from 'react-native';
import { Text } from '../components/common';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components, functions, and styles
import FeedbackCard from '../components/FeedbackCard';
import styles from '../styles/scenes/FeedbackListStyles';
import registerForNotifications from '../services/push_notifications';
import { Icon } from 'react-native-elements';
import translate from '../translation';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Import tracking
import { sendGoogleAnalytics, pullFeedback, pullSolutions } from '../actions';

const stopwords = require('stopwords').english;
import nothing from '../../images/backgrounds/nothing.jpg';

class FeedbackList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterCategory: 'new',
    };

    props.sendGoogleAnalytics('FeedbackList', props.group.groupName);
  }

  componentDidMount() {
    registerForNotifications(this.props.token);
  }

  partialWordSearch(query) {
    return this.props.feedback.list.filter((item) => {
      if (item.text.toLowerCase().indexOf(query.toLowerCase()) === -1) {
        return false;
      }
      return true;
    })
  }


  curateFeedbackList = () => {
    // Return a list of feedback given the filter/search value
    if (this.props.feedback.filterMethod === 'search') {
      return this.partialWordSearch(this.props.feedback.searchQuery);
    }
    // Switch through filter methods
    const filteredFeedbackList = this.props.feedback.list.filter((item) => {
      const timeFilter = ['all', 'this_week', 'today', 'my_feedback'];
      const { filterMethod } = this.props.feedback;
      const { date } = item;
      const feedbackDate = new Date(date).getTime();
      if (filterMethod !== '' && !timeFilter.includes(filterMethod) && typeof filterMethod !== 'undefined') {
        return item.category === filterMethod;
      }
      switch (filterMethod) {
        case 'all':
          return true;
        case 'this_week': {
          const oneWeekAgo = Date.now() - (60000 * 60 * 24 * 7);
          return feedbackDate >= oneWeekAgo;
        }
        case 'today': {
          const oneDayAgo = Date.now() - (60000 * 60 * 24);
          return feedbackDate >= oneDayAgo;
        }
        case 'my_feedback': {
          return item.userId == this.props.user.userId;
        }
        default:
          return true;
      }
    });

    return filteredFeedbackList;
  }

  categorizedList = () => {
    const categorizedFeedbackList = this.curateFeedbackList().filter((item) => {
      if (this.state.filterCategory === 'complete') {
        return (this.state.filterCategory === item.status)||(item.status == 'closed');
      }
      if (this.state.filterCategory === 'new') {
        return (this.state.filterCategory === item.status)||(item.status == 'queue')
      }
      return this.state.filterCategory === item.status;
    });

    return categorizedFeedbackList.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    // if (this.state.filterCategory !== 'new') {
    //   return categorizedFeedbackList;
    // }
    // const newFeedback = categorizedFeedbackList.filter((item) => item.status == 'new')
    //   .sort((a, b) => (new Date(b.date) - new Date(a.date)))
    // const queueFeedback = categorizedFeedbackList.filter((item) => item.status == 'queue')
    //   .sort((a, b) => (new Date(b.date) - new Date(a.date)))
    // return [ ...newFeedback, ...queueFeedback];
  }

  renderShowCategory = () => {
    const { language } = this.props.user;
    const {
      OPEN,
      INPROCESS,
      COMPLETE,
    } = translate(language)

    if (this.props.group.includePositiveFeedbackBox)
      return null;

    return (
      <View style={{ flexDirection:'row', backgroundColor:'#00A2FF'}}>
        <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center', paddingTop:3, paddingBottom:5, backgroundColor:((this.state.filterCategory == 'new')?'white':null)}} onPress={() => {this.setState({ filterCategory:'new' });}}>
          <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'new')?'800':'400'), color:((this.state.filterCategory == 'new')?'#00A2FF':'white')}]}>{OPEN}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center', paddingTop:3, paddingBottom:5, backgroundColor:((this.state.filterCategory == 'inprocess')?'white':null)}} onPress={() => {this.setState({ filterCategory:'inprocess' });}}>
          <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'inprocess')?'800':'400'), color:((this.state.filterCategory == 'inprocess')?'#00A2FF':'white')}]}>{INPROCESS}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center', paddingTop:3, paddingBottom:5, backgroundColor:((this.state.filterCategory == 'complete')?'white':null)}} onPress={() => {this.setState({ filterCategory:'complete' });}}>
          <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'complete')?'800':'400'), color:((this.state.filterCategory == 'complete')?'#00A2FF':'white')}]}>{COMPLETE}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  _onRefresh() {
    const { token } = this.props;
    this.props.pullFeedback(token);
    this.props.pullSolutions(token);
  }

  renderFeedbackSubmitButton = () => {
    return (
      <View style={{position: 'absolute', right: 10, bottom: 10}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('FeedbackSubmit', translate(this.props.user.language).SUBMIT_FEEDBACK)}>
          <Icon name="mode-edit" size={30} color={'#00A2FF'} backgroundColor={'red'} raised reverse />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const filteredFeedbackList = this.categorizedList();
    const headerHeight = 80;
    if (!filteredFeedbackList.length) {
      return (
        <View style={styles.container}>
          {this.renderShowCategory()}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.props.feedback.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <Image style={[styles.background, { height: SCREEN_HEIGHT - headerHeight }]} source={nothing} resizeMode="cover" />
            </ScrollView>
            {this.renderFeedbackSubmitButton()}
        </View>
      )

    }
    return (
      <View style={styles.container}>
        {this.renderShowCategory()}
        <ListView
          style = {{zIndex: -1}}
          dataSource={ds.cloneWithRows(filteredFeedbackList)}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.feedback.refreshing}
              onRefresh={this._onRefresh.bind(this)}
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
        {this.renderFeedbackSubmitButton()}
      </View>
    );
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

const AppScreen = connect(mapStateToProps, { sendGoogleAnalytics, pullFeedback, pullSolutions })(FeedbackList);

export default AppScreen;

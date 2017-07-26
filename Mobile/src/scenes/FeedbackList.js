// Import Libraries
import React, { Component } from 'react';
import { Image, View, ListView, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components, functions, and styles
import FeedbackCard from '../components/FeedbackCard';
import styles from '../styles/scenes/FeedbackListStyles';
import registerForNotifications from '../services/push_notifications';
import { Icon } from 'react-native-elements';
import translate from '../translation';


// Import tracking
import { sendGoogleAnalytics } from '../actions';

const stopwords = require('stopwords').english;
import nothing from '../../images/backgrounds/nothing.jpg';

class FeedbackList extends Component {
  constructor(props) {
    super(props);

    // Create the initial wordspace and occurance table once for future search queries
    const { cleanQues, wordspace } = this.wordspace();
    const occuranceTable = this.wordspaceOccuranceTable(cleanQues, wordspace);
    this.state = {
      filterCategory:'new',
      wordspace,
      occuranceTable,
    };

    props.sendGoogleAnalytics('FeedbackList', props.group.groupName);
  }

  componentDidMount() {
    registerForNotifications(this.props.token);
  }

  wordspace = () => {
    // Creates a wordspace for a given set array of strings
    const allQuestions = this.props.feedback.list;

    const cleanQues = this.cleanQuestions(allQuestions);
    const allWords = cleanQues.reduce((acc, question) => [...acc, ...question], []);

    const wordsWithoutDuplicates = this.removeDuplicateWords(allWords);
    const wordspace = this.removeStopwords(wordsWithoutDuplicates);
    return { cleanQues, wordspace };
  }

  wordspaceOccuranceTable = (cleanQues, wordspace) => {
    // Create an occurance table for a given wordspace
    const occurances = cleanQues.map(question =>
      wordspace.map(wordspaceWord =>
        question.filter(questionWord => wordspaceWord === questionWord).length));

    return occurances;
  }

  // Helper function that cleans multiple questions
  cleanQuestions = (questions) => {
    return questions.reduce((acc, row) => {
      return [...acc,
        row.text
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\?\"\'\n\r]/g,"")
          .replace(/[\s]{2,}/g, ' ')
          .toLowerCase()
          .split(' ')];
    }, []);
  }

  // Helper function that cleans a single string and returns an array
  cleanQuestion = (question) => {
    return question
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\?\"\'\n\r]/g,"")
      .replace(/[\s]{2,}/g, ' ')
      .toLowerCase()
      .split(' ');
  }

  // Remove duplicates
  removeDuplicateWords = (wordsWithDuplicates) => {
    return wordsWithDuplicates.filter((item, index, array) => {
      return array.indexOf(item) === index;
    });
  }

  // Remove stopwords
  removeStopwords = (words) => {
    return words.filter((item) => {
      return !stopwords.includes(item);
    });
  }

  // Calculate the similarity between the query and every other piece of feedback
  cosineSimilarity = (query) => {
    // Clean up the query and create a query specific occurance table
    const cleanQuery = this.removeStopwords(this.removeDuplicateWords(this.cleanQuestion(query)));
    const queryOccurance = this.state.wordspace.map((wordspaceWord) => {
      return cleanQuery.filter(questionWord => wordspaceWord === questionWord).length;
    });

    // Calculations
    const allTops = this.state.occuranceTable.map((occuranceArray) => {
      return occuranceArray.reduce((top, value, index) => {
        return top + queryOccurance[index] * value;
      }, 0);
    });
    const allBottomLeft = this.state.occuranceTable.map((occuranceArray) => {
      return occuranceArray.reduce((bottomLeft, value) => {
        return bottomLeft + value * value;
      }, 0);
    });

    const bottomRight = queryOccurance.reduce((bottomRight, value) => {
      return bottomRight + value * value;
    }, 0);

    const cosines = this.state.occuranceTable.map((occ, index) => {
      return allTops[index] / (Math.sqrt(allBottomLeft[index]) * Math.sqrt(bottomRight));
    });

    // Filter the results by a cosine value of greater than 0.3
    const topResults = cosines.map((value, index) => {
      if (value >= 0.3) {
        return this.props.feedback.list[index];
      }
      // Bug fix with how the map function works
    }).filter((value) => {
      if (value) {
        return true;
      }
    });

    return topResults;
  }

  curateFeedbackList = () => {
    // Return a list of feedback given the filter/search value
    if (this.props.feedback.filterMethod === 'search') {
      return this.cosineSimilarity(this.props.feedback.searchQuery);
    }
    // Switch through filter methods
    const filteredFeedbackList = this.props.feedback.list.filter((item) => {
      const { filterMethod } = this.props.feedback;
      const { date } = item;
      const feedbackDate = new Date(date).getTime();
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
      if (this.state.filterCategory == 'complete') {
        return (this.state.filterCategory == item.status)||(item.status == 'closed');
      }
      if (this.state.filterCategory == 'new') {
        return (this.state.filterCategory == item.status)||(item.status == 'queue')
      }
      return this.state.filterCategory == item.status;
    });
    if (this.state.filterCategory !== 'new') {
      return categorizedFeedbackList;
    }
    const newFeedback = categorizedFeedbackList.filter((item) => item.status == 'new')
      .sort((a, b) => (new Date(b.date) - new Date(a.date)))
    const queueFeedback = categorizedFeedbackList.filter((item) => item.status == 'queue')
      .sort((a, b) => (new Date(b.date) - new Date(a.date)))
    return [ ...newFeedback, ...queueFeedback];
  }

  renderShowCategory = () => {
    const { language } = this.props.user;
    const {
      OPEN,
      INPROCESS,
      COMPLETE,
    } = translate(language)

    if (this.props.group.includePositiveFeedbackBox)
      return (
        <View style={{ flexDirection:'row', backgroundColor:'#00A2FF', height:40}}>
          <TouchableOpacity style={{flex:1, backgroundColor:((this.state.filterCategory == 'new')?'white':null)}} onPress={() => {this.setState({ filterCategory:'new' });}}>
            <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'new')?'800':'400'), color:((this.state.filterCategory == 'new')?'#00A2FF':'white')}]}>This Weeks Customer Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, backgroundColor:((this.state.filterCategory == 'complete')?'white':null)}} onPress={() => {this.setState({ filterCategory:'complete' });}}>
            <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'complete')?'800':'400'), color:((this.state.filterCategory == 'complete')?'#00A2FF':'white')}]}>Feedback with Responses from Corporate</Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <View style={{ flexDirection:'row', backgroundColor:'#00A2FF', height:40}}>
        <TouchableOpacity style={{flex:1, backgroundColor:((this.state.filterCategory == 'new')?'white':null)}} onPress={() => {this.setState({ filterCategory:'new' });}}>
          <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'new')?'800':'400'), color:((this.state.filterCategory == 'new')?'#00A2FF':'white')}]}>{OPEN}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1, backgroundColor:((this.state.filterCategory == 'inprocess')?'white':null)}} onPress={() => {this.setState({ filterCategory:'inprocess' });}}>
          <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'inprocess')?'800':'400'), color:((this.state.filterCategory == 'inprocess')?'#00A2FF':'white')}]}>{INPROCESS}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1, backgroundColor:((this.state.filterCategory == 'complete')?'white':null)}} onPress={() => {this.setState({ filterCategory:'complete' });}}>
          <Text style={[styles.categoryText, {paddingTop:6, fontWeight:((this.state.filterCategory == 'complete')?'800':'400'), color:((this.state.filterCategory == 'complete')?'#00A2FF':'white')}]}>{COMPLETE}</Text>
        </TouchableOpacity>
      </View>
    );
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
    if (!filteredFeedbackList.length) {
      return <View style={styles.container}>
      {this.renderShowCategory()}
        <Image style={styles.background} source={nothing} resizeMode="cover" />
        {this.renderFeedbackSubmitButton()}
      </View>
    }
    return (
      <View style={styles.container}>
        {this.renderShowCategory()}
        <ListView
          style = {{zIndex: -1}}
          dataSource={ds.cloneWithRows(filteredFeedbackList)}
          removeClippedSubviews={false}
          renderRow={rowData =>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Details', {
                feedback: rowData,
                 translate: translate(this.props.user.language).PROPOSED_SOLUTIONS,
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

const AppScreen = connect(mapStateToProps, { sendGoogleAnalytics })(FeedbackList);

export default AppScreen;

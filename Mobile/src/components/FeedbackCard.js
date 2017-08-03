// Import Libraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, Image as Image2 } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import PropTypes from 'prop-types';
import TimeAgo from 'react-native-timeago';
import translate from '../translation';

import fullScreen from '../../images/icons/default.jpg';
import noOpinionY from '../../images/icons/meh_y.png';
import noOpinionG from '../../images/icons/meh_g1.png';

// Import componenets, functions, and styles
import styles from '../styles/components/FeedbackCardStyles';
import { Card, CardSection } from './common';
import { Text, TinyButton } from '../components/common';
import * as Animatable from 'react-native-animatable';
import LightBox from 'react-native-lightbox';

const SCREEN_WIDTH = Dimensions.get('window').width;

import {
  addFeedbackUpvote,
  removeFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  addToDoNotDisplayList,
  addFeedbackNoOpinion,
  removeFeedbackNoOpinion,
} from '../actions';

class Feedback extends Component {
  constructor(props){
    super(props)
    this.state = {
      toggled: false,
      imageWidth: null,
      imageHeight: null,
    }
  }
  goToDetails = () => {
    this.props.navigate('Details', { feedback: this.props.feedback });
  }

  addNoOpinion = () => {
    const { feedback, user } = this.props;
    if (!user.feedbackNoOpinions.includes(feedback.id)) {
      this.props.addFeedbackNoOpinion(feedback);
    } else {
      this.props.removeFeedbackNoOpinion(feedback);
    }
  }

  // If user hasn't upvoted this feedback, add an upvote - if they have, remove it
  upvote = () => {
    const { feedback, user } = this.props;
    if (!user.feedbackUpvotes.includes(feedback.id)) {
      this.props.addFeedbackUpvote(feedback);
    } else {
      this.props.removeFeedbackUpvote(feedback);
    }
    this.props.addToDoNotDisplayList(feedback.id);
    this.setState({toggled: true});
  }

  // If user hasn't downvoted this feedback, add an downvote - if they have, remove it
  downvote = () => {
    const { feedback, user } = this.props;
    if (!user.feedbackDownvotes.includes(feedback.id)) {
      this.props.addFeedbackDownvote(feedback);
    } else {
      this.props.removeFeedbackDownvote(feedback);
    }
    this.props.addToDoNotDisplayList(feedback.id)
  }

  renderTitle = () => {
    const { showImage, biggerCard } = this.props;
    if (biggerCard) {
      return null;
    }
    if (this.props.feedback === undefined) {
      return '';
    }
    return (
      <Text
        style={{
          fontSize: 16,
          color: 'black',
          fontWeight: '400',
        }}
        numberOfLines={(showImage?null:3)}
      >
        {this.props.feedback.text}
      </Text>
    );
  }

  renderResponse = () => {
    const { showImage, feedback } = this.props;
    const exists = feedback.officialReply && feedback.officialReply.text !== '';
    if (showImage||!exists) {
      return null;
    }
    return (
      <View style={{marginTop:10}}>
        <Text
          style={{
            fontSize: 14,
            color: '#00A2FF',
            fontWeight: '800',
          }}
        >
          {translate(this.props.user.language).OFFICIAL_RESPONSE}:
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#00A2FF',
            fontWeight: '400',
          }}
          numberOfLines={(showImage?null:2)}
        >
          {this.props.feedback.officialReply}
        </Text>
      </View>
    );
  }

  renderNoOpinionButton = () => {
    const { feedback, user, biggerCard } = this.props;
    let iconColor = '#bdbdbd';
    // If user hasn't upvoted this feedback
    if (user.feedbackNoOpinions.includes(feedback.id)) {
      iconColor = '#F8C61C';
    }
    return (
      <View>
        <TinyButton
          style={biggerCard?null:{backgroundColor: iconColor, borderColor: iconColor, shadowColor: 'white', width:30}}
          textStyle={biggerCard?null:{fontSize: 6,}}
          >
          No Opinion
        </TinyButton>
      </View>
    );
  }
  renderThumbUpButton = () => {
    const { feedback, user, biggerCard } = this.props;
    let iconColor = '#bdbdbd';
    // If user hasn't upvoted this feedback
    if (user.feedbackUpvotes.includes(feedback.id)) {
      iconColor = '#48D2A0';
    }
    return (
      <View>
        <Icon name="caret-up" type="font-awesome" size={26} color={iconColor}/>
      </View>
    );
  }
  renderThumbDownButton = () => {
    const { feedback, user, biggerCard } = this.props;
    let iconColor = '#bdbdbd';
    // If user hasn't upvoted this feedback
    if (user.feedbackDownvotes.includes(feedback.id)) {
      iconColor = '#F54B5E';
    }
    return (
      <View>
        <Icon name="caret-down" type="font-awesome" size={26} color={iconColor}/>
      </View>
    );
  }

  renderStatus = () => {
    const { status } = this.props.feedback;
    const { showImage } = this.props;
    if (!showImage) return null;
    if (status && status === 'compliment') {
      return <View style = {{flexDirection:'row'}}><Icon name="heart" type='font-awesome' size={20} color={'#F54B5E'} /><Text style={{color:'#F54B5E'}}>{showImage?'  Compliment':null}</Text></View>;
    }
    if (status && status === 'closed') {
      return <View style = {{flexDirection:'row'}}><Icon name="ban" type='font-awesome' size={20} color={'#f7a1aa'} /><Text style={{color:'#f7a1aa'}}>{showImage?'  Issue Closed':null}</Text></View>;
    }
    if (status && status === 'complete') {
      return <View style = {{flexDirection:'row'}}><Icon name="done" size={20} color={'#48D2A0'} /><Text style={{color:'#48D2A0'}}>{showImage?'  Completed':null}</Text></View>;
    }
    if (status && status === 'queue') {
      return <View style = {{flexDirection:'row'}}><Icon name="fiber-new" size={20} color={'#48D2A0'} /><Text style={{color:'#48D2A0'}}>{showImage?'  In Queue':null}</Text></View>;
    }
    if (status && status === 'inprocess') {
      return <View style = {{flexDirection:'row'}}><Icon name="sync" size={20} color={'#F8C61C'} /><Text style={{color:'#F8C61C'}}>{showImage?'  Working on it':null}</Text></View>;
    }
    return <View style = {{flexDirection:'row'}}><Icon name="fiber-new" size={20} color={'#00A2FF'} /><Text style={{color:'#00A2FF'}}>{showImage?'  New Feedback':null}</Text></View>;
  }

  renderStatusBox = () => {
    if (this.props.group.showStatus) {
      return (
        <View style={{ paddingRight: 10 }}>
          {this.renderStatus()}
        </View>
      );
    }
    return null;
  }

  renderOfficialResponseTag = () => {
    const { feedback, showResponseTag } = this.props;
    if (!showResponseTag) {
      return null;
    }
    // Has the server been updated to include a response object?
    const exists = feedback.officialReply && feedback.officialReply.text !== '';
    if (!exists) {
      return (
        <View style={{ paddingRight: 10, paddingTop: 2 }}>
          <Icon name="verified-user" size={20} color="#bdbdbd" />
        </View>
      );
    }
    return (
      <View style={{ paddingRight: 10, paddingTop: 2 }}>
        <Icon name="verified-user" size={20} color="#00A2FF" />
      </View>
    );
  }

  renderImage = () => {
    const { imageURL } = this.props.feedback;
    const { showImage } = this.props;
    const { imageStyle, imageViewStyle } = styles;

    if (!showImage || !imageURL) {
      return null;
    }

    Image2.getSize(imageURL, (iwidth, iheight) => {
      this.setState({imageWidth: iwidth, imageHeight: iheight})
    });

    return (
      <View style={imageViewStyle}>
        <LightBox onRequestClose={() => null}>
          <Image
            source={{ uri: imageURL }}
            indicator={ProgressBar}
            indicatorProps={{
              size: 80,
              borderWidth: 0,
              color: 'rgba(150, 150, 150, 1)',
              unfilledColor: 'rgba(200, 200, 200, 0.2)',
            }}
            style={{
              flex:2,
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH*0.4,
              marginBottom:10,
              resizeMode: 'contain',
            }}
          />
        </LightBox>
      </View>
    );
  }

  renderSmallImage = () => {
    const { imageURL } = this.props.feedback;
    const { showImage, biggerCard } = this.props;
    const { imageStyle, imageViewStyle } = styles;
    const { status } = this.props.feedback;
    if (showImage||biggerCard) {
      return null;
    }

    // If feedback doesn't have a photo
    if (!imageURL) {
      return null;
    }
    return (
      <View style={imageViewStyle, {paddingLeft: 20}}>
        <Image
          source={{ uri: imageURL }}
          indicator={ProgressBar}
          indicatorProps={{
            size: 60,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          style={{
            width: 70,
            height: 70,
            resizeMode: 'cover',
            paddingBottom: 5,
            borderRadius: 4,
          }}
        >
        </Image>
      </View>
    );
  }

  renderTitleImage = () => {
    const { imageURL } = this.props.feedback;
    const { biggerCard } = this.props;
    const { imageStyle, imageViewStyle } = styles;
    const { status } = this.props.feedback;
    if (!biggerCard) {
      return null;
    }

    // If feedback doesn't have a photo
    if (!imageURL) {
      return null;
    }
return (
      <View style={imageViewStyle}>
        <Image
          source={{ uri: imageURL }}
          indicator={ProgressBar}
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          style={{
            width: SCREEN_WIDTH-10,
            height: 180,
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  }

  renderSolutionsTag = () => {
    const { solutions, feedback, showResponseTag } = this.props;
    const feedbackSolutions = solutions.list.filter(solution => solution.feedbackId === feedback.id);
    if (!showResponseTag) {
      return null;
    }
    if (feedbackSolutions.length && !this.props.showImage) {
      return (
        <View style={{paddingTop:2}}>
          <Icon name="question-answer" size={20} color="#F8C61C" />
        </View>
      );
    }
    return (
      <View style={{paddingTop:2}}>
        <Icon name="question-answer" size={20} color="#bdbdbd" />
      </View>
    );
  }

  renderMyFeedbackTag = () => {
    const { showImage } = this.props;
    if (this.props.user.userId != this.props.feedback.userId) {
      if (showImage) {
        return null;
      } else {
        return (
          <View>
            <Icon name="person" size={23} color="#bdbdbd" />
          </View>
        );
      }
    } else if (!showImage) {
      return (
        <View>
          <Icon name="person" size={23} color="#F54B5E" />
        </View>
      );
    }
    return <View style = {{flexDirection:'row', marginRight:10}}><Icon name="person" size={20} color={'#F54B5E'} /><Text style={{color:'#F54B5E'}}>{"My Feedback"}</Text></View>;
  }

renderVoteCount = () => {
    const { showImage, biggerCard } = this.props;
    const {
      voteCountStyle,
      upvoteCountStyle,
      upvoteTextStyle,
      downvoteTextStyle,
      downvoteCountStyle,
      thumbStyle,
    } = styles;
    if (this.props.feedback === undefined) {
      return '';
    }
    if (biggerCard||showImage) {
      return null;
    }
    return (
      <View style={{ flexDirection: 'column', alignItems:'center', marginRight:10}}>
        {/* Upvote Button and Downvote */}
        <TouchableOpacity onPress={this.upvote} style={{ flexDirection: 'column', padding:5, paddingLeft:10, paddingRight:10}}>
          {this.renderThumbUpButton()}
        </TouchableOpacity>
          <View style={{ flexDirection: 'row', marginTop:2, marginBottom:2}}>
            <Text style={[upvoteTextStyle]}>
              {this.props.feedback.upvotes}
            </Text>
            <Text style={[upvoteTextStyle, {color:'grey', marginLeft:2, marginRight:2}]}>
              |
            </Text>
            <Text style={[downvoteTextStyle]}>
              {this.props.feedback.downvotes}
            </Text>
          </View>
        <TouchableOpacity onPress={this.downvote} style={{ flexDirection: 'column', padding:5, paddingLeft:10, paddingRight:10}}>
          {this.renderThumbDownButton()}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { showImage, feedback, biggerCard } = this.props;
    const categoryExists = feedback.category && feedback.category !== '';
    const {
      row,
      feedbackTitle,
      rowViewStyle,
      voteCountStyle,
      upvoteCountStyle,
      upvoteTextStyle,
      downvoteTextStyle,
      downvoteCountStyle,
      thumbStyle,
    } = styles;

    let updatedRow = [row, { borderColor: '#fff', borderWidth: 2 }];

    return (
      <View style={updatedRow}>
        <View style={{ flexDirection: 'row', padding:5, paddingLeft:0, height:null}}>
          <View>
            {this.renderVoteCount()}
          </View>
          <View style={{ flex: 6, paddingTop: 13, flexDirection: 'column'}}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <View style={{ flex: 1}}>
                {this.renderImage()}
                </View>
                <View style={{flex:1}}>
                {this.renderTitle()}
                </View>
                {this.renderResponse()}
              </View>
              <View>
                {this.renderSmallImage()}
              </View>
            </View>
            <View
            style={{ paddingTop: 3, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between'}}
            accessible={false}
            >
              <TimeAgo
                time={this.props.feedback.date}
                allowFontScaling={false}
                style={{ color: '#bdbdbd', fontSize: 12  }}
              />
              <Text style={{color:'#bdbdbd'}}>{categoryExists?'#':null} {feedback.category} </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end'}}>
                {this.renderMyFeedbackTag()}
                {this.renderStatusBox()}
                {this.renderSolutionsTag()}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Feedback.propTypes = {
  feedback: PropTypes.object,
  navigate: PropTypes.func,
  user: PropTypes.object,
  addFeedbackUpvote: PropTypes.func,
  removeFeedbackUpvote: PropTypes.func,
  addFeedbackDownvote: PropTypes.func,
  removeFeedbackDownvote: PropTypes.func,
  group: PropTypes.object,
  showResponseTag: PropTypes.bool,
  showImage: PropTypes.bool,
  solutions: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user, group, solutions } = state;
  return { user, group, solutions };
};

export default connect(mapStateToProps, {
  addFeedbackUpvote,
  removeFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  addToDoNotDisplayList,
  addFeedbackNoOpinion,
  removeFeedbackNoOpinion,
})(Feedback);

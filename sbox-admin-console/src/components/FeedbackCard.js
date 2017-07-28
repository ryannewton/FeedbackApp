// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Glyphicon, Image, Button } from 'react-bootstrap';
import TimeAgo from 'react-timeago'

// Import components
import CommentCard from './CommentCard';
import AssignButton from './AssignButton';
import ReplyButton from './ReplyButton';
import ChangeStatusButton from './ChangeStatusButton';
import DeleteButton from './DeleteButton';
import ClarifyButton from './ClarifyButton';
import RejectButton from './RejectButton';
import ChangeCategoryButton from './ChangeCategoryButton';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import store from '../reducers/store';
import { updateFeedback } from '../actions';


// Import actions
import { approveFeedback, approveSolution } from '../actions';

const cardSource = {
  beginDrag(props) {
    return {
      text: props.text
    };
  },
  endDrag(props, monitor, component) {
    if (monitor.getDropResult()) {
      if (monitor.getDropResult().filterMethod === 'awaitingApproval') {
        const updatedFeedback = { ...props.feedback, approved: 0 };
        store.dispatch(updateFeedback(updatedFeedback))

      } else {
        const updatedFeedback = { ...props.feedback, status: monitor.getDropResult().filterMethod };
        store.dispatch(updateFeedback(updatedFeedback))
      }
    }
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    // endDrag: monitor.endDrag()
  };
}

const propTypes = {
  text: PropTypes.string.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};


class FeedbackCard extends Component {
  state = {
    mouseOver: false,
    buttonActive: false,
    viewSolutions: false,
    modalUp: false,
  }

  onModalButtonClick = () => {
    this.setState({ modalUp: false });
  }

  render = () => {
    const { isDragging, connectDragSource } = this.props;
    const editBackground = { backgroundColor: 'grey' };
    const whiteBackground = { backgroundColor: 'white' };
    let background = (this.state.mouseOver || this.state.buttonActive) ? editBackground : whiteBackground;
    return connectDragSource(
      <div onMouseEnter={() => this.setState({ mouseOver: true })} onMouseLeave={() => this.setState({ mouseOver: false})}>
        <Panel style={background}>
          {this.renderTopButton()}
          <div style={{marginLeft:20, marginRight:20}}>
            {this.renderVotesAndTime()}
            {this.maybeRenderClarifyText()}
            {this.renderText()}            
            {this.renderCategoryAndSolutionsButton()}
            {this.maybeRenderSolutionCards()}
          </div>
        </Panel>
      </div>
    );
  }

  renderTopButton = () => {
    if (this.state.mouseOver || this.state.buttonActive || this.state.modalUp) {
      if (this.props.feedback.feedbackId) {
        return (
          <div>
            <Button
              className="btn btn-success btn-sm"
              style={{ zIndex:100, position: 'absolute'}}
              onClick={() => this.props.approveSolution(this.props.feedback)}
            >
              Approve
            </Button>
            <ClarifyButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            <RejectButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
          </div>
        );
      }
      if (this.props.feedback.approved) {
        return (
          <div>
            <div>
              <AssignButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
              <ReplyButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            </div>
            <ChangeStatusButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            <div onClick={() => this.setState({ modalUp: true})}>
              <DeleteButton
                feedback={this.props.feedback}
                updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })}
                onModalButtonClick={this.onModalButtonClick}
              />
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <Button
              className="btn btn-success btn-sm"
              style={{ zIndex:100, position: 'absolute'}}
              onClick={() => this.props.approveFeedback(this.props.feedback)}
            >
              Approve
            </Button>
            <ClarifyButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            <RejectButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
          </div>
        );
      }
    }
  }

  renderVotesAndTime = () => {
    return (
      <div className="row">
        <div className="pull-left" style={{fontSize:12, color:'#555'}}>
          <Glyphicon glyph='triangle-top' /><span style={{margin:5}}>{this.props.feedback.upvotes}</span><Glyphicon glyph='triangle-bottom' color='red'/><span style={{margin:5}}>{this.props.feedback.downvotes}</span>
        </div>
        <div className="pull-right" style={{fontSize:12, color:'#555'}}>
          <TimeAgo date={this.props.feedback.date} />
        </div>
      </div>
    );
  }

  maybeRenderClarifyText =() => {
    if (this.props.feedback.status !== 'clarify') {
      return null;
    }
    return (
      <center><t style={{color:'#F8C61C', fontWeight:'bold', fontSize:18}}>Awaiting Clarification</t></center>
    );
  }

  renderText = () => {
    if (!this.props.feedback.feedbackId) {
      return (
        <div className="row">{this.props.feedback.text}</div>
      );
    }
    const theFeedback = this.props.feedbackList.list.filter((item) => item.id === this.props.feedback.feedbackId);
    return (
      <div>
        <center style={{color:'white', backgroundColor:'#0081CB', fontWeight:'bold', fontSize:15, marginTop:5}}>Solution</center>
        <div className="row">{this.props.feedback.text}</div>
        <center style={{color:'white', backgroundColor:'#0081CB', fontWeight:'bold', fontSize:15, marginTop:10}}>In response to</center>
        <div className="row">{theFeedback[0].text}</div>
      </div>
    );
  }

  maybeRenderSolutionCards(){
    if (!this.state.viewSolutions) {
      return null;
    }
    const imageURL = this.props.feedback.imageURL;
    const image = imageURL ? <Image src={imageURL} style={{marginBottom:10}} responsive /> : null;
    const feedbackSolutions = this.props.solutions.list.filter((item) => (item.feedbackId === this.props.feedback.id) && (item.approved))
    if (!feedbackSolutions.length) {
      return (
        <span>
          {image}
          Comments:
          <Panel hasTitle={false} bodyBackGndColor={'#eee'}>
            No comments yet!
          </Panel>
        </span>
      );
    }
    const solutions = feedbackSolutions.map((item) => {
      return (
        <CommentCard solution={item} />
      )
    })
    return (
      <span>
        {image}
        Comments:
        {solutions}
      </span>
    );
  }

  renderCategoryAndSolutionsButton = () => {
    if (this.props.feedback.feedbackId) {
      return null;
    }
    if (this.state.mouseOver || this.state.buttonActive) {
      return (
        <div className="row" style={{height:30}}>
          <div><ChangeCategoryButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} /></div>
          <div><Button style={{ position: 'absolute', right: 30 }} onClick={() => this.setState({ viewSolutions: !this.state.viewSolutions })}>...</Button></div>
        </div>
      );
    }

    const categoryText = this.props.feedback.category ? '#' + this.props.feedback.category : '';
    return (
      <div className="row" style={{height:30}}>
        <div className="pull-left">{categoryText}</div>
        <div className="pull-right" style={{marginTop:10, marginRight:9}}><Glyphicon glyph='option-horizontal' /></div>
      </div>
    );
  }
}

FeedbackCard.propTypes = propTypes;

function mapStateToProps(state) {
  const feedbackList = state.feedback
  const { solutions } = state;
  return { solutions, feedbackList }
}

export default connect(mapStateToProps, { approveFeedback, approveSolution })(DragSource(ItemTypes.BOX, cardSource, collect)(FeedbackCard));

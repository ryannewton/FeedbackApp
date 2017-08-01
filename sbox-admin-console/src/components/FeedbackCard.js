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

      } if (!props.feedback.approved) {
        const updatedFeedback = { ...props.feedback, status: monitor.getDropResult().filterMethod, approved: 1 };
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
    const { connectDragSource } = this.props;
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
              className="btn btn-success btn-xs"
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
            {(this.props.group.includePositiveFeedbackBox) ? null : <ChangeStatusButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} /> }
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
              className="btn btn-success btn-xs"
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
    if (!this.props.feedback.approved) {
      return null;
    }
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
        <div className="row" style={{color:'grey'}}>{theFeedback[0].text}</div>
        <span>
          New comment:
          <Panel hasTitle={false} style={{backgroundColor:'#eee'}}>
            {this.props.feedback.text}
          </Panel>
        </span>
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
          <Panel hasTitle={false} style={{backgroundColor:'#eee'}}>
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
    if ((this.state.mouseOver || this.state.buttonActive) && this.props.feedback.approved) {
      return (
        <div className="row" style={{height:20}}>
          <div><ChangeCategoryButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} /></div>
          <div><Button className="btn btn-xs" style={{ position: 'absolute', right: 30 }} onClick={() => this.setState({ viewSolutions: !this.state.viewSolutions })}><Glyphicon glyph='option-horizontal' /></Button></div>
        </div>
      );
    }
    const categoryText = this.props.feedback.category ? '#' + this.props.feedback.category : '';
    if (!this.props.feedback.approved) {
      return (
        <div className="row">
          <div className="pull-left">{categoryText}</div>
        </div>
      );
    }
    return (
      <div className="row" style={{height:20}}>
        <div className="pull-left">{categoryText}</div>
        <div className="pull-right" style={{marginRight:0}}><Glyphicon glyph='option-horizontal' /></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const feedbackList = state.feedback
  const { solutions, group } = state;
  return { solutions, feedbackList, group }
}

export default connect(mapStateToProps, { approveFeedback, approveSolution })(DragSource(ItemTypes.BOX, cardSource, collect)(FeedbackCard));

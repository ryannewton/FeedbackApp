// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Glyphicon, Image, Button, Label, Modal, FormControl } from 'react-bootstrap';
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

// Import actions
import { approveFeedback, approveSolution, replyFeedback, updateFeedback } from '../actions';

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
      } else if (monitor.getDropResult().filterMethod === 'complete' && props.feedback.officialReply === '') {
        component.setState({ officialResponseModal: true })
      } else if (!props.feedback.approved) {
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
    viewImage: false,
    modalUp: false,
    showSentNotification: false,
    sentText: '',
    officialResponseModal: false,
    response: '',
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
        {this.maybeRenderOfficialResponseModal()}
        <Panel style={background}>
          {this.renderTopButton()}
          <div style={{marginLeft:20, marginRight:20}}>
            {this.sentNotification()}
            {this.renderVotesAndTime()}
            {this.maybeRenderClarifyText()}
            {this.renderText()}
            {this.renderResponse()}
            {this.renderCategoryAndSolutionsButton()}
            {this.maybeRenderImage()}
            {this.maybeRenderSolutionCards()}
          </div>
        </Panel>
      </div>
    );
  }
  sentNotification() {
    if (!this.state.showSentNotification) return null;
    return (
      <center>
        <Label bsStyle="success">
          {this.state.sentText}
        </Label>
      </center>
    );
  }

  updateOfficialResponse() {
    this.props.replyFeedback(this.props.feedback, this.state.response, 'officialReply');
    const updatedFeedback = { ...this.props.feedback, status: 'complete', officialReply: this.state.response };
    this.props.updateFeedback(updatedFeedback)
  }

  maybeRenderOfficialResponseModal() {
    if (this.state.officialResponseModal) {
      let smClose = () => this.setState({ officialResponseModal: false });
      return (
        <Modal className="static-modal" show={this.state.officialResponseModal} bsSize="small">
          <Modal.Body>
            <p>To mark a piece of feedback as complete, you must submit an official response.</p>
            <FormControl
              componentClass="textarea"
              style={{ height: 150 }}
              value={this.state.response}
              onChange={(event) => this.setState({response: event.target.value})}
              placeholder={'Enter text here...'}
            />
            <br />
            <Button
              className="btn btn-cancel"
                style={{marginRight:10}}
                onClick={() => {
                  smClose();
                }}
              >
                Cancel
            </Button>
            <Button
              className="btn btn-primary"
                style={{marginRight:10}}
                onClick={() => {
                  smClose();
                  this.updateOfficialResponse();
                }}
              >
                Send
              </Button>
          </Modal.Body>
        </Modal>
      );
    }
    return null;
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
            <ClarifyButton
              feedback={this.props.feedback}
              updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} 
            />
            <RejectButton
              feedback={this.props.feedback}
              updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })}
            />
          </div>
        );
      }
      if (this.props.feedback.approved) {
        return (
          <div>
            <div>
              <AssignButton
                feedback={this.props.feedback}
                updateButtonActive={(activeState) => {
                  this.setState({ buttonActive: activeState});
                }}
                showSuccess={(activeState, sentText='') => {
                  this.setState({ buttonActive: activeState, showSentNotification: true, sentText});
                  setTimeout(() => this.setState({ showSentNotification: false }), 20000);
                }}
              />
              <ReplyButton
                feedback={this.props.feedback}
                updateButtonActive={(activeState) => {
                  this.setState({ buttonActive: activeState});
                }}
                showSuccess={(activeState, sentText='') => {
                  this.setState({ buttonActive: activeState, showSentNotification: true, sentText});
                  setTimeout(() => this.setState({ showSentNotification: false }), 20000);
                }}
              />
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

  renderResponse = () => {
    if (!this.props.feedback.officialReply) {
      return null;
    }
    return (
      <div style={{marginTop:10, fontSize: 14, color: '#00A2FF', fontWeight: '400',}}>
        <b>Official Response: </b>
        {this.props.feedback.officialReply}
      </div>
    );
  }

  maybeRenderSolutionIcon(){
    const feedbackSolutions = this.props.solutions.list.filter((item) => (item.feedbackId === this.props.feedback.id) && (item.approved))
    if (!feedbackSolutions.length) {
      return null;
    }
    return (
      <div className="pull-right" style={{color:'grey'}}><Glyphicon style={{margin:3}} glyph='comment' /></div>
    );
  }

  maybeRenderImageIcon(){
    const imageURL = this.props.feedback.imageURL;
    if (!imageURL) {
      return null;
    }
    return (
      <div className="pull-right" style={{color:'grey'}}><Glyphicon style={{margin:3}} glyph='picture' /></div>
    );
  }

  maybeRenderSolutionButton(){
    const feedbackSolutions = this.props.solutions.list.filter((item) => (item.feedbackId === this.props.feedback.id) && (item.approved))
    if (!feedbackSolutions.length) {
      return null;
    }
    return (
      <div><Button className="btn btn-xs" style={{ position: 'absolute', right: 30 }} onClick={() => this.setState({ viewSolutions: !this.state.viewSolutions })}><Glyphicon glyph='comment' /></Button></div>
    );
  }

  maybeRenderImageButton(){
    const imageURL = this.props.feedback.imageURL;
    const feedbackSolutions = this.props.solutions.list.filter((item) => (item.feedbackId === this.props.feedback.id) && (item.approved))
    if (!imageURL) {
      return null;
    }
    if (!feedbackSolutions.length) {
      return (
        <div><Button className="btn btn-xs" style={{ position: 'absolute', right: 30 }} onClick={() => this.setState({ viewImage: !this.state.viewImage })}><Glyphicon glyph='picture' /></Button></div>
      );
    }
    return (
      <div><Button className="btn btn-xs" style={{ position: 'absolute', right: 54 }} onClick={() => this.setState({ viewImage: !this.state.viewImage })}><Glyphicon glyph='picture' /></Button></div>
    );
  }

  maybeRenderSolutionCards(){
    if (!this.state.viewSolutions) {
      return null;
    }
    const feedbackSolutions = this.props.solutions.list.filter((item) => (item.feedbackId === this.props.feedback.id) && (item.approved))
    if (!feedbackSolutions.length) {
      return (
        <span>
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
        Comments:
        {solutions}
      </span>
    );
  }

maybeRenderImage(){
    if (!this.state.viewImage && this.props.feedback.approved) {
      return null;
    }
    const imageURL = this.props.feedback.imageURL;
    const image = imageURL ? <Image src={imageURL} style={{marginBottom:10}} responsive /> : null;
    return (
      <span>
        {image}
      </span>
    );
  }

  renderCategoryAndSolutionsButton = () => {
    if (this.props.feedback.feedbackId) {
      return null;
    }
    if ((this.state.mouseOver || this.state.buttonActive) && this.props.feedback.approved) {
      return (
        <div className="row" style={{height:23}}>
          <div><ChangeCategoryButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} /></div>
          {this.maybeRenderImageButton()}
          {this.maybeRenderSolutionButton()}
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
      <div className="row" style={{height:23}}>
        <div className="pull-left">{categoryText}</div>
        {this.maybeRenderSolutionIcon()}
        {this.maybeRenderImageIcon()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const feedbackList = state.feedback
  const { solutions, group } = state;
  return { solutions, feedbackList, group }
}

export default connect(mapStateToProps, { approveFeedback, approveSolution, replyFeedback, updateFeedback })(DragSource(ItemTypes.BOX, cardSource, collect)(FeedbackCard));

// Import Libraries
import React, { Component } from 'react';
import { Panel, Glyphicon, Image, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import TimeAgo from 'react-timeago'

// Import components
import AssignButton from './AssignButton';
import ReplyButton from './ReplyButton';
import ChangeStatusButton from './ChangeStatusButton';
import ClarifyButton from './ClarifyButton';
import RejectButton from './RejectButton';

class FeedbackCard extends Component {

  state = {
    mouseOver: false,
    buttonActive: false,
  }

  render = () => {
    const editBackground = { backgroundColor: 'grey' };
    const whiteBackground = { backgroundColor: 'white' };
    let background = (this.state.mouseOver || this.state.buttonActive) ? editBackground : whiteBackground;
    return (
      <div onMouseEnter={() => this.setState({ mouseOver: true })} onMouseLeave={() => this.setState({ mouseOver: false})}>
        <Panel style={background}>
          {this.renderImage()}
          {this.renderVotesAndTime()}
          {this.renderText()}
          {this.renderCategoryAndSolutionsButton()}
        </Panel>
      </div>
    );
  }

  renderImage = () => {
    const imageURL = this.props.feedback.imageURL;

    const replyPopover = (
      <Popover onMouseEnter={() => this.setState({ mouseOver: true })} id={this.props.feedback.id + "-reply-popover"} title="Respond to Feedback">
        Respond Feedback Component
      </Popover>
    );

    let editButtons;
    if (this.state.mouseOver || this.state.buttonActive) {
      if (this.props.feedback.approved)
        editButtons = (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>          
            <div>
              <AssignButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />          
              <ReplyButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            </div>
            <ChangeStatusButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} /> 
          </div>
        );
      else
        editButtons = (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button>Approve</Button>
            <ClarifyButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            <RejectButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
          </div>
        );
    }

    const image = imageURL ? <Image src={imageURL} height={100} rounded /> : null;
    
    return (
      <div>
        {editButtons}
        {image}
      </div>
    );
  }

  renderVotesAndTime = () => {
    return (
      <div className="row">
        <div className="pull-left">
          <Glyphicon glyph='triangle-top' /><span>{this.props.feedback.upvotes}</span><Glyphicon glyph='triangle-bottom' /><span>{this.props.feedback.downvotes}</span>
        </div>
        <div className="pull-right">
          <TimeAgo date={this.props.feedback.date} />
        </div>
      </div>
    );
  }

  renderText = () => {
    return (
      <div className="row">{this.props.feedback.text}</div>
    );
  }

  renderCategoryAndSolutionsButton = () => {
    if (this.state.mouseOver || this.state.buttonActive) {
      return (
        <div className="row">
          <div className="pull-left"><Button>Change Category</Button></div>
          <div className="pull-right"><Button>...</Button></div>
        </div>
      );
    }

    const categoryText = this.props.feedback.category ? '#' + this.props.feedback.category : '';
    return (
      <div className="row">
        <div className="pull-left">{categoryText}</div>
        <div className="pull-right"><Glyphicon glyph='option-horizontal' /></div>
      </div>
    );
  }
}

export default FeedbackCard;

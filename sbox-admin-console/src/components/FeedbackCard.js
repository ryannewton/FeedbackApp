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
import ClarifyButton from './ClarifyButton';
import RejectButton from './RejectButton';

// Import actions
import { approveFeedback } from '../actions';

class FeedbackCard extends Component {

  state = {
    mouseOver: false,
    buttonActive: false,
    viewSolutions: false,
  }

  render = () => {
    const editBackground = { backgroundColor: 'grey' };
    const whiteBackground = { backgroundColor: 'white' };
    let background = (this.state.mouseOver || this.state.buttonActive) ? editBackground : whiteBackground;
    return (
      <div onMouseEnter={() => this.setState({ mouseOver: true })} onMouseLeave={() => this.setState({ mouseOver: false})}>
        <Panel style={background}>
          {this.renderImage()}
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

  renderImage = () => {
    const imageURL = this.props.feedback.imageURL;

    let editButtons;
    if (this.state.mouseOver || this.state.buttonActive) {
      if (this.props.feedback.approved) {
        editButtons = (
          <div>          
            <div>
              <AssignButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
              <ReplyButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
            </div>
            <ChangeStatusButton feedback={this.props.feedback} updateButtonActive={(activeState) => this.setState({ buttonActive: activeState })} />
          </div>
        );
      } else {
        editButtons = (
          <div>
            <Button
              className="btn btn-success"
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

    const image = imageURL ? <Image src={imageURL} style={{marginBottom:10}} responsive rounded /> : null;
    
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
          <Glyphicon glyph='triangle-top' /><span style={{margin:5}}>{this.props.feedback.upvotes}</span><Glyphicon glyph='triangle-bottom' /><span style={{margin:5}}>{this.props.feedback.downvotes}</span>
        </div>
        <div className="pull-right">
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
    return (
      <div className="row">{this.props.feedback.text}</div>
    );
  }

  maybeRenderSolutionCards(){
    if (!this.state.viewSolutions) {
      return null;
    }
    const feedbackSolutions = this.props.solutions.list.filter((item) => item.feedbackId === this.props.feedback.id)
    if (!feedbackSolutions.length) {
      return (
        <span>
          Solutions:
          <Panel hasTitle={false} bodyBackGndColor={'#eee'}>
            No comments yet!
          </Panel>
        </span>
      );
    }
    const solutions = feedbackSolutions.map((item) => {
      return (
        <SolutionCard solution={item} />
      )
    })
    return (
      <span>
        Comments:
        {solutions}
      </span>
    );
  }
  renderCategoryAndSolutionsButton = () => {
    if (this.state.mouseOver || this.state.buttonActive) {
      return (
        <div className="row" style={{height:35}}>
          <div className="pull-left"><Button className="btn btn-info" >Change Category</Button></div>
          <div className="pull-right"><Button onClick={() => this.setState({ viewSolutions: !this.state.viewSolutions })}>...</Button></div>
        </div>
      );
    }

    const categoryText = this.props.feedback.category ? '#' + this.props.feedback.category : '';
    return (
      <div className="row" style={{height:35}}>
        <div className="pull-left">{categoryText}</div>
        <div className="pull-right" style={{marginTop:10, marginRight:9}}><Glyphicon glyph='option-horizontal' /></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { solutions } = state;
  return { solutions }
}

export default connect(mapStateToProps, { approveFeedback })(FeedbackCard);

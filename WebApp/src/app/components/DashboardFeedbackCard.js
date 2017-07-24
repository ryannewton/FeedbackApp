// Import Libraries
import React, { Component, select } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Card, Panel } from './common';
import DashboardSolutionsCard from './DashboardSolutionCard';
import { Button } from 'react-bootstrap';


// Import Actions
import {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedback,
  submitOfficialReply,
  pullFeedbackVotes,
  addFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  removeFeedbackUpvote,
  submitSolutionToServer
} from '../redux/actions';

class ApproveFeedbackCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.feedback.status,
      approved: this.props.feedback.approved,
      officialReply: this.props.feedback.officialReply,
      category: null,
      replyEnabled: false,
      editing: false,
      viewSolutions: false,
      commentText: '',
      commenting: false,
    };
     this.handleUpdate = this.handleUpdate.bind(this);
     this.handleStatusChange = this.handleStatusChange.bind(this);
     this.handleApprovedStatusChange = this.handleApprovedStatusChange.bind(this);
     this.inputText = this.inputText.bind(this);
     this.renderSolutionsButton = this.renderSolutionsButton.bind(this)
  }

  renderSolutionsButton() {
    const { viewSolutions } = this.state
    return (
      <div style={{paddingTop:10, paddingBottom:10}}>
        <button
          className="btn btn-default"
          onClick={() => this.setState({ viewSolutions: !viewSolutions, commenting: false})}>
          {viewSolutions?'Hide Comments':'View Comments'}
        </button>
      </div>
    )
  }

  locallyCountUpvote() {
    if (!this.props.user.refreshed) {
      if (this.props.user.feedbackUpvotes.includes(this.props.feedback.id)) {
        return 1 + this.props.feedback.upvotes;
        }
      return this.props.feedback.upvotes;
    }
    return this.props.feedback.upvotes;
  }

  locallyCountDownvote() {
    if (!this.props.user.refreshed) {
      if (this.props.user.feedbackDownvotes.includes(this.props.feedback.id)) {
        return 1 + this.props.feedback.downvotes;
      }
      return this.props.feedback.downvotes;
    }
    return this.props.feedback.downvotes;
  }

  renderFeedbackText = () => {
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 5, marginBottom: 10 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 30 }}>
          <Button
            onClick={() => this.handleUpvote()}
          >
            <p style={{ color:((this.props.user.feedbackUpvotes.includes(this.props.feedback.id)) ? '#48D2A0': 'grey')}}>
              ▲ {this.locallyCountUpvote()}
            </p>
          </Button>
          <Button
            onClick={() => this.handleDownvote()}
          >
            <p style={{color:((this.props.user.feedbackDownvotes.includes(this.props.feedback.id)) ? '#F54B5E': 'grey')}}>
              ▼ {this.locallyCountDownvote()}
            </p>
          </Button>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 20 }}>
          {this.props.feedback.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}} >
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  commentOnFeedback() {
    if (this.state.commenting) {
      return (
        <div className="col-md-12">
          <div className="col-md-9">
            <textarea
              className="form-control"
              id="exampleTextarea"
              rows="4"
              onChange={(event) => this.setState({ commentText: event.target.value })}
              value={this.state.commentText}
            />
          </div>
          <Button
            className="btn btn-primary"
            onClick={() => {
              this.props.submitSolutionToServer(this.state.commentText, this.props.feedback.id, false);
              this.setState({ commentText: '', commenting: false});
            }}
            bsStyle="primary"
          >Submit Comment
          </Button>
        </div>
      )
    }
    return null;
  }

  handleUpvote() {
    if (this.props.user.feedbackUpvotes.includes(this.props.feedback.id)) {
      this.props.removeFeedbackUpvote(this.props.feedback);
    } else {
      this.props.addFeedbackUpvote(this.props.feedback);
    }
  }
  handleDownvote() {
    if (this.props.user.feedbackDownvotes.includes(this.props.feedback.id)) {
      this.props.removeFeedbackDownvote(this.props.feedback);
    } else {
      this.props.addFeedbackDownvote(this.props.feedback);
    }
  }

  renderReply = () => {
    const exists = this.props.feedback.officialReply && this.props.feedback.officialReply.text !== '';
    if (!exists) {
      return (
        <div className="col-xs-12">
          <b>No Official Reply yet.</b>
        </div>
      );
    }
    return (
      <div className="col-xs-12">
        <b>Official Reply:</b>
        <br />
        {this.props.feedback.officialReply}
      </div>
    );
  }

  inputText(event) {
    this.setState({ officialReply: event.target.value})
  }

  handleUpdate() {
    const { officialReply, approved, status, category } = this.state;
    const updatedFeedback = { ...this.props.feedback, approved, status, officialReply, category };
    this.props.updateFeedback({ feedback: updatedFeedback })
    this.props.submitOfficialReply({ feedback: updatedFeedback, officialReply });
    this.setState({ editing: false})
  }


  handleStatusChange(event) {
    this.setState({ status: event.target.value })
  }

  handleApprovedStatusChange(event) {
    this.setState({ approved: event.target.value })
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value })
  }
  maybeRenderApproved() {
    if (this.props.group.feedbackRequiresApproval) {
      if (this.state.editing) {
        return (
          <div className="col-xs-3">
            <select className="form-control" value={this.state.approved} onChange={this.handleApprovedStatusChange}>
              <option value={1} >Approved</option>
              <option value={0} >Not Approved</option>
            </select>
          </div>
        )
      }
      return (
        <div className="col-xs-3">
          {approved ? 'Approved': 'Not Approved'}
        </div>
      )
    }
    return null;
  }

  renderSelections = () => {
    if (this.state.editing) {
      return (
        <div className="col-xs-12" style={{padding:20, paddingTop:0}}>
          <div className="col-xs-4">
            <select className="form-control" value={this.state.status} onChange={this.handleStatusChange}>
              <option value='new'>★ Open</option>
              <option value='inprocess'>⟳ Project in process</option>
              <option value='complete'>✔ Project Finished</option>
              <option value='closed'>✘ Project Closed</option>
              <option value='compliment'>❤︎ Compliment</option>
              <option value='poll'>ℙ Poll</option>
              <option value="rejected" >Rejected</option>
            </select>
          </div>
          <div className="col-xs-3">
            <select className="form-control" value={this.state.category} onChange={this.handleApprovedStatusChange}>
              <option value='category_a'>Category A</option>
              <option value='category_b'>Category B</option>
              <option value='category_c'>Category C</option>
              <option value='category_d'>Category D</option>
            </select>
          </div>
          {this.maybeRenderApproved()}
        </div>
      );
    }
    const { status, category, approved } = this.props.feedback;
    return (
      <div className="col-xs-12" style={{padding:20, paddingTop:0}}>

        <div className="col-xs-3">
          Status: {status}
        </div>
        <div className="col-xs-4">
          {category ? category: <i>No category assigned</i>}
        </div>
          {this.maybeRenderApproved()}
      </div>
    )
  }

  renderCommentButton() {
    const { commenting } = this.state
    return (
      <div style={{paddingTop:10, paddingBottom:10}}>
        <button
          className="btn btn-default"
          onClick={() => this.setState({ commenting: !commenting, viewSolutions: false })}>
          {commenting?'Hide':'Submit a comment'}
        </button>
      </div>
    )
  }
  maybeRenderSolutions() {
    if (!this.state.viewSolutions) {
      return null;
    }
    const feedbackSolutions = this.props.solutions.list.filter((item) => item.feedbackId == this.props.feedback.id)
    if (!feedbackSolutions.length) {
      return (
        <div className='col-xs-10 col-xs-offset-1 clearfix'>
        <Panel hasTitle={false} bodyBackGndColor={'#eee'}>
          No comments yet!
          </Panel>
        </div>
      );
    }
    const solutions = feedbackSolutions.map((item) => {
      return (
        <DashboardSolutionsCard solution={item} editing={this.state.editing} />
      )
    })
    return (
      <div>
        {solutions}
      </div>
    );
  }
  render() {
    return (
      <div className='clearfix'>
        <Panel hasTitle={false}>
          {this.renderFeedbackText()}
          {this.renderSelections()}
          {this.renderReply()}
          <div className='pull-left'>
           {this.renderSolutionsButton()}
          </div>
          <div className='pull-right'>
            {this.renderCommentButton()}
          </div>
        </Panel>
        {this.maybeRenderSolutions()}
        {this.commentOnFeedback()}
      </div>
    );
  }
}

const buttonStyles = {
  marginLeft: 20,
  marginRight: 20,
  width: 100,
  height: 30,
  color: 'white',
  border: 'none',
  borderRadius: 2,
  fontSize: 10,
}

function mapStateToProps(state) {
  const { solutions, group, user } = state;
  return { solutions, group, user };
}
export default connect(mapStateToProps, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedback,
  submitOfficialReply,
  pullFeedbackVotes,
  addFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  removeFeedbackUpvote,
  submitSolutionToServer
})(ApproveFeedbackCard);

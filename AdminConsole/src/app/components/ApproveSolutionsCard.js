// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/lib/md/';
import { Panel } from './common';
import { Button } from 'react-bootstrap';
import TextInputForm from './TextInputForm';

// Import Actions
import {
  approveSolution,
  clarifySolution,
  rejectSolution,
  updateSolutionStatus
} from '../redux/actions';

class ApproveSolutionsCard extends Component {
  state = {
    showRejectInput: false,
    rejectMessage: '',
    showClarifyInput: false,
    clarifyMessage: '',
  };

  renderSolutionText = () => {
    const { solution } = this.props;
    const timestamp = new Date(solution.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <t style={{color:'#48D2A0'}}>▲ {this.props.solution.upvotes} </t><t style={{color:'#F54B5E'}}> ▼ {this.props.solution.downvotes}</t>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 14, marginLeft:80 }}>
          {this.props.solution.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  renderFeedbackText = () => {
    const { feedback } = this.props;
    const timestamp = new Date(feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <t style={{color:'#48D2A0'}}>▲ {this.props.feedback.upvotes} </t><t style={{color:'#F54B5E'}}> ▼ {this.props.feedback.downvotes}</t>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 14, marginLeft:80 }}>
          {this.props.feedback.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  renderButtons() {
    if (this.state.showRejectInput || this.state.showClarifyInput) {
      return null;
    }
    const { solution, approveSolution, clarifySolution, rejectSolution } = this.props;
    return (
      <div style={{ marginTop: 20, marginBottom: 5 }}>
        <button
          type='button'
          onClick={() => approveSolution(solution)}
          style={{ ...buttonStyles, backgroundColor: '#6ECFA2' }}
        >
          APPROVE
        </button>
        <button
          type='button'
          onClick={() => this.setState({ showClarifyInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          CLARIFY
        </button>
        <button
          type='button'
          onClick={() => this.setState({ showRejectInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#E5575F' }}
        >
          REJECT
        </button>
      </div>
    );
  }

  maybeRenderRejectInput() {
    if (!this.state.showRejectInput) {
      return null;
    }

    return (
      <TextInputForm
        buttonColor="#E5575F"
        buttonText="Submit Rejection"
                submitFunction={ ({ feedback, message }) => {
            this.props.rejectSolution({ solution: feedback, message });
            // this.props.updateSolutionStatus({ feedback, newStatus: 'rejected' });
          }}
        onClose={() => this.setState({ showRejectInput: false })}
        instructionText="Please provide a reason for rejecting this solution."
        placeholderText="Enter your reason here. Note that this will be sent to the member who submitted this solution."
        feedback={this.props.solution}
      />
    );
  }

  maybeRenderClarifyInput() {
    if (!this.state.showClarifyInput) {
      return null;
    }

    return (
      <TextInputForm
        buttonColor="#F2C63B"
        buttonText="Request Clarification"
        submitFunction={ ({ feedback, message }) => {
          this.props.clarifySolution({ solution: feedback, message });
          // this.props.updateSolutionStatus({ feedback, newStatus: 'clarify' });
        }}
        onClose={() => this.setState({ showClarifyInput: false })}
        instructionText="Please describe what is unclear."
        placeholderText="Enter your description here. Note that this will be sent to the member who submitted this solution."
        feedback={this.props.solution}
      />
    );
  }

  render() {
    return (
      <Panel hasTitle={false}>
        {this.renderFeedbackText()}
        {this.renderSolutionText()}
        {this.renderButtons()}
        {this.maybeRenderRejectInput()}
        {this.maybeRenderClarifyInput()}
      </Panel>
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

export default connect(null, {
  approveSolution,
  clarifySolution,
  rejectSolution,
  updateSolutionStatus
})(ApproveSolutionsCard);

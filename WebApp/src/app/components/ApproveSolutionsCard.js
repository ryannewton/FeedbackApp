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
    clarifyNothingSubmitted: false,
    rejectNothingSubmitted: false,
  };

  renderSolutionText = () => {
    const { solution } = this.props;
    const timestamp = new Date(solution.date);
    return (
      <div className='col-xs-10 col-xs-offset-1 clearfix'>
      <Panel hasTitle={false} bodyBackGndColor={'#eee'}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <t style={{color:'#48D2A0'}}>▲ {this.props.solution.upvotes} </t><t style={{color:'#F54B5E'}}> ▼ {this.props.solution.downvotes}</t>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 14, marginLeft:80 }}>
          {this.props.solution.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </Panel>
      </div>
    );
  }

  renderFeedbackText = () => {
    const { feedback } = this.props;
    const timestamp = new Date(feedback.date);
    return (
      <div className="col-xs-12" style={{ marginTop: 10, marginBottom: 20 }}>
        <p>In Response to: </p>
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
      <div className="col-xs-offset-1" style={{ marginTop: 20, marginBottom: 5 }}>
        <button
          type="button"
          className="btn btn-success"
          style={{ ...buttonStyles, backgroundColor:'#6ECFA2' }}
          onClick={() => approveSolution(solution)}
        >
          Approve
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => this.setState({ showClarifyInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          Clarify
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.setState({ showRejectInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#E5575F' }}
        >
          Reject
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
                  if (message == '') {
                    this.setState({ rejectNothingSubmitted: true})
                  } else {
                    this.props.rejectSolution({ solution: feedback, message });
                  }
            // this.props.updateSolutionStatus({ feedback, newStatus: 'rejected' });
          }}
        onClose={() => this.setState({ showRejectInput: false, rejectNothingSubmitted: false })}
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
          if (message == '') {
            this.setState({ clarifyNothingSubmitted: true })
          } else {
              this.props.clarifySolution({ solution: feedback, message });
          }
          // this.props.updateSolutionStatus({ feedback, newStatus: 'clarify' });
        }}
        onClose={() => this.setState({ showClarifyInput: false, clarifyNothingSubmitted: false })}
        instructionText="Please describe what is unclear."
        placeholderText="Enter your description here. Note that this will be sent to the member who submitted this solution."
        feedback={this.props.solution}
      />
    );
  }

  maybeRenderErrorMessage() {
    if (this.state.clarifyNothingSubmitted) {
      return (
        <center>
          <div style={{color: 'red'}}>
            Please add a message to help the user understand what to clarify.
          </div>
        </center>
      )
    } else if (this.state.rejectNothingSubmitted) {
      return (
        <center>
          <div style={{color: 'red'}}>
            Please add a message to help the user understand why this feedback is being rejected.
          </div>
        </center>
      )
    }
    return null;
  }

  render() {
    return (
      <div>
        <Panel hasTitle={false}>
          {this.renderSolutionText()}
          {this.renderButtons()}
          <div className="col-sm-offset-1">
          {this.maybeRenderRejectInput()}
          {this.maybeRenderClarifyInput()}
          </div>
          {this.renderFeedbackText()}
        </Panel>
        {this.maybeRenderErrorMessage()}
      </div>
    );
  }
}

const buttonStyles = {
  marginLeft: 20,
  marginRight: 20,
  width: 100,
}

export default connect(null, {
  approveSolution,
  clarifySolution,
  rejectSolution,
  updateSolutionStatus
})(ApproveSolutionsCard);

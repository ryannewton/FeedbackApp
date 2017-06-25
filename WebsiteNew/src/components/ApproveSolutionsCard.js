// Import Libraries
import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/lib/md/';
import { Card } from './common';

class ApproveSolutionsCard extends Component {
  approveSolution = () => {
    console.log('Approving solution');
    console.log('solution: ', this.props.solution.text);
  }

  clarifySolution = () => {
    console.log('Clarifying solution');
    console.log('solution: ', this.props.solution.text);

  }

  rejectSolution = () => {
    console.log('Rejecting solution');
    console.log('solution: ', this.props.solution.text);

  }

  renderSolutionText() {
    console.log('this.props.solution: ', this.props.solution);
    const timestamp = new Date(this.props.solution.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div style={{ fontWeight: 'bold', fontSize: 14 }}>
          {this.props.solution.text}
        </div>
        <div style={{ fontSize: 10, float: 'right' }}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  renderFeedbackText() {
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20, fontSize: 14 }}>
        In Response To:
        <div>
          <div className="col-md-1" style={{ margin: 0, padding: 0, textAlign: 'center' }}>
            <div style={{ color: 'green', margin: 0, padding: 0 }}>
              <MdArrowUpward />
              {this.props.feedback.upvotes}
            </div>
            <div style={{ color: 'red', margin: 0, padding: 0 }}>
              <MdArrowDownward />
              {this.props.feedback.downvotes}
            </div>
          </div>
          <div>
            {this.props.feedback.text}
          </div>
          <div style={{ fontSize: 10, float: 'right' }}>
            Submitted <TimeAgo date={timestamp} />
          </div>
        </div>
      </div>
    );
  }

  renderButtons() {
    return (
      <div style={{ marginTop: 20, marginBottom: 5 }}>
        <button
          type='button'
          onClick={this.approveSolution}
          style={{ ...buttonStyles, backgroundColor: '#6ECFA2' }}
        >
          APPROVE
        </button>
        <button
          type='button'
          onClick={this.clarifySolution}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          CLARIFY
        </button>
        <button
          type='button'
          onClick={this.rejectSolution}
          style={{ ...buttonStyles, backgroundColor: '#E5575F' }}
        >
          REJECT
        </button>
      </div>
    );
  }

  render() {
    return (
      <Card>
        {this.renderSolutionText()}
        {this.renderButtons()}
        {this.renderFeedbackText()}
      </Card>
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

export default ApproveSolutionsCard;

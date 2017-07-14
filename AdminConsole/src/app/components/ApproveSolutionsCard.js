// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/lib/md/';
import { Card } from './common';

// Import Actions
import { approveSolution, clarifySolution, rejectSolution } from '../redux/actions';

class ApproveSolutionsCard extends Component {
  renderSolutionText() {
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
    const { feedback } = this.props;
    const timestamp = new Date(feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20, fontSize: 14 }}>
        In Response To:
        <div>
          <div className="col-md-1" style={{ margin: 0, padding: 0, textAlign: 'center' }}>
            <div style={{ color: 'green', margin: 0, padding: 0 }}>
              <MdArrowUpward />
              {feedback.upvotes}
            </div>
            <div style={{ color: 'red', margin: 0, padding: 0 }}>
              <MdArrowDownward />
              {feedback.downvotes}
            </div>
          </div>
          <div>
            {feedback.text}
          </div>
          <div style={{ fontSize: 10, float: 'right' }}>
            Submitted <TimeAgo date={timestamp} />
          </div>
        </div>
      </div>
    );
  }

  renderButtons() {
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
          onClick={() => clarifySolution(solution)}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          CLARIFY
        </button>
        <button
          type='button'
          onClick={() => rejectSolution(solution)}
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

export default connect(null, {
  approveSolution,
  clarifySolution,
  rejectSolution,
})(ApproveSolutionsCard);

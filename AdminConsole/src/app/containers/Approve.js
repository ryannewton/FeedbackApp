import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import RequireAuth from '../components/RequireAuth';

// Import Components
import ApproveFeedbackCard from '../components/ApproveFeedbackCard';
import ApproveSolutionsCard from '../components/ApproveSolutionsCard';
import ErrorMessage from '../components/ErrorMessage';

class ApproveFeedback extends Component {
  listFeedback = () => {
    if (this.props.feedback.error) {
      return <ErrorMessage />
    }

    if (this.props.feedback.list.length === 0) {
      return this.renderEmptyList();
    }

    return (
      <div>
        {this.props.feedback.list
          .filter(feedback => !feedback.approved)
          .map(feedback => {
            return (
              <div key={feedback.id}>
                <ApproveFeedbackCard
                  feedback={feedback}
                />
              </div>
            )
          })
        }
      </div>
    );
  }

  listSolutions = () => {
    if (this.props.solutions.list.length === 0) {
      return this.renderEmptyList();
    }

    return (
      <div>
        {this.props.solutions.list
          .filter(solution => !solution.approved)
          .map(solution => {
            let feedback = this.props.feedback.list.find(feedback => {
              return feedback.id === solution.feedbackId;
            });
            return (
              <div key={solution.id}>
                <ApproveSolutionsCard
                  key={solution.id}
                  solution={solution}
                  feedback={feedback}
                />
              </div>
            )
          })
        }
      </div>
    );
  }

  renderEmptyList() {
    return (
      <div>Congratulations, you've hit zero inbox!</div>
    );
  }

 render() {
  return (
    <div>
      <div>
        <h5>Feedback Approval Needed: (currently shows approved feedback)</h5>
        {this.listFeedback()}
      </div>
      <div>
        <h5>Solution Approval Needed: (currently shows approved solutions)</h5>
        {this.listSolutions()}
      </div>
    </div>
  );
  }
}

function mapStateToProps(state) {
  const { feedback, solutions } = state;
  return { feedback, solutions };
}

export default withRouter(connect(mapStateToProps)(RequireAuth(ApproveFeedback)));

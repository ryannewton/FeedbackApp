import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import RequireAuth from '../components/RequireAuth';
import { Panel } from '../components/common';

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
          .filter(feedback => feedback.status !== 'clarify' && feedback.status !== 'rejected')
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
          .filter(solution => solution.status !== 'clarify' && solution.status !== 'rejected')
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
      <div style={{paddingRight:20, paddingLeft:20}}>
        <Panel title="Feedback Approval Needed:">
        {this.listFeedback()}
        </Panel>
      </div>
      <div style={{paddingRight:20, paddingLeft:20}}>
        <Panel title="Solution Approval Needed:">
        {this.listSolutions()}
        </Panel>
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

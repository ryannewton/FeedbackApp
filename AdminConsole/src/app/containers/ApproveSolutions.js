import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pullSolutions, pullFeedback } from '../redux/actions';
import RequireAuth from '../components/RequireAuth';

// Import Components
import ApproveSolutionsCard from '../components/ApproveSolutionsCard';

class ApproveSolutions extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if(token) {
      this.props.pullFeedback();
      this.props.pullSolutions();
    }
  }

  listSolutions = () => {
    if (this.props.solutions.loading || this.props.feedback.loading) {
      return this.renderLoadingScreen();
    }

    if (this.props.solutions.list.length === 0) {
      return this.renderEmptyList();
    }

    return (
      <div>
        {this.props.solutions.list
          .filter(solution => solution.approved)
          .map(solution => {
            let feedback = this.props.feedback.list.find(feedback => {
              return feedback.id === solution.feedbackId;
            });
            return (
              <div className='col-md-10 col-md-offset-1'>
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

  renderLoadingScreen() {
    return (
      <div>Beep boop. Retrieving your solutions...</div>
    );
  }

   render() {
    return (
      <div>
        <h5>Solution Approval Needed: (currently shows approved solutions)</h5>
        {this.listSolutions()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { solutions, feedback } = state;
  return { solutions, feedback };
}

export default connect(mapStateToProps, { pullSolutions, pullFeedback })(ApproveSolutions);

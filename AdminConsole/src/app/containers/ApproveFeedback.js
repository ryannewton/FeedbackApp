import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pullFeedback } from '../redux/actions';
import RequireAuth from '../components/RequireAuth';

// Import Components
import ApproveFeedbackCard from '../components/ApproveFeedbackCard';
import ErrorMessage from '../components/ErrorMessage';

class ApproveFeedback extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if(token) {
      this.props.pullFeedback();
    }
  }

  listFeedback = () => {
    if (this.props.feedback.error) {
      return <ErrorMessage />
    }

    if (this.props.feedback.loading) {
      return this.renderLoadingScreen();
    }

    if (this.props.feedback.list.length === 0) {
      return this.renderEmptyList();
    }

    return (
      <div>
        {this.props.feedback.list
          .filter(feedback => feedback.approved)
          .map(feedback => {
            return (
              <div className='col-md-10 col-md-offset-1'>
                <ApproveFeedbackCard
                  key={feedback.id}
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
      <div>Beep boop. Retrieving your feedback...</div>
    );
  }

   render() {
    return (
      <div>
        <h5>Feedback Approval Needed: (currently shows approved feedback)</h5>
        {this.listFeedback()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { feedback } = state;
  return { feedback };
}

export default connect(mapStateToProps, { pullFeedback })(ApproveFeedback);

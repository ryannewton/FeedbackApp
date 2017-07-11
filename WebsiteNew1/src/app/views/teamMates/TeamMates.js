import React, {
  PropTypes,
  Component
}                         from 'react';
import {
  AnimatedView,
  Panel,
  TeamMates,
  TeamMember,
  TeamMateAddButton
}                         from '../../components';
import shallowCompare     from 'react-addons-shallow-compare';
import Highlight          from 'react-highlight';
import ApproveSolutionsCard from '../../components/ApproveSolutionsCard';
import { pullFeedback, pullSolutions } from '../../actions';
import { connect } from 'react-redux';


class TeamMatesView extends Component {
  componentWillMount() {
    const { actions: { enterTeamMatesView } } = this.props;
    enterTeamMatesView();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const { actions: { leaveTeamMatesView } } = this.props;
    leaveTeamMatesView();
    clearTimeout(this.enterAnimationTimer);
  }
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
      <div>Congratulations, youve hit zero inbox!</div>
    );
  }

  renderLoadingScreen() {
    return (
      <div>Beep boop. Retrieving your solutions...</div>
    );
  }

  render() {

    return(
      <AnimatedView>
        <div>
          <h5>Solution Approval Needed: (currently shows approved solutions)</h5>
          {this.listSolutions()}
        </div>
      </AnimatedView>
    );
  }
}

TeamMatesView.propTypes= {
  actions: PropTypes.shape({
    enterTeamMatesView: PropTypes.func.isRequired,
    leaveTeamMatesView: PropTypes.func.isRequired
  })
};

function mapStateToProps(state) {
  const { solutions, feedback } = state;
  return { solutions, feedback };
}

export default connect(mapStateToProps, { pullSolutions, pullFeedback })(TeamMatesView);

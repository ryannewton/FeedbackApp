import React, {
  PropTypes,
  Component
}                         from 'react';
import {
  AnimatedView,
  Panel,
  TodoList,
  TodoListItem,
  TodoListCommands,
  TodoListAddTask,
  TodoListSeeAllTask
}                         from '../../components';
import Highlight          from 'react-highlight';
import shallowCompare     from 'react-addons-shallow-compare';

import ApproveFeedbackCard from '../../components/ApproveFeedbackCard';
import ErrorMessage from '../../components/ErrorMessage';
import { pullFeedback } from '../../actions';
import { connect } from 'react-redux';


class TodoListView extends Component {
  componentWillMount() {
    const { actions: { enterTodoListView } } = this.props;
    enterTodoListView();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const { actions: { leaveTodoListView } } = this.props;
    leaveTodoListView();
    clearTimeout(this.enterAnimationTimer);
  }
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
      <div>Congratulations, youve hit zero inbox!</div>
    );
  }

  renderLoadingScreen() {
    return (
      <div>Beep boop. Retrieving your feedback...</div>
    );
  }

  render() {

    return(
      <AnimatedView>
        <div>
          <h5>Feedback Approval Needed: (currently shows approved feedback)</h5>
          {this.listFeedback()}
        </div>
      </AnimatedView>
    );
  }
}

TodoListView.propTypes= {
  actions: PropTypes.shape({
    enterTodoListView: PropTypes.func.isRequired,
    leaveTodoListView: PropTypes.func.isRequired
  })
};

function mapStateToProps(state) {
  const { feedback } = state;
  return { feedback };
}

export default connect(mapStateToProps, { pullFeedback })(TodoListView);

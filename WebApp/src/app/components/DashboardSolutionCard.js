// Import Libraries
import React, { Component, select } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Card, Panel } from './common';
import {
  Button,
} from 'react-bootstrap';

// Import Actions
import {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedback,
  addSolutionUpvote,
  addSolutionDownvote,
  removeSolutionUpvote,
  removeSolutionDownvote,
} from '../redux/actions';

class DashboardSolutionsCard extends Component {
  constructor(props) {
    super(props);
    // const feedbackSolutions = this.props.solutions.filter((item) => item.feedbackId == this.props.feedback.id)
    this.state = {
      approved: this.props.solution.approved,
    };
     this.handleApprovedStatusChange = this.handleApprovedStatusChange.bind(this);
  }
  locallyCountUpvote() {
    if (this.props.user.solutionUpvotes.includes(this.props.solution.id)) {
      return 1 + this.props.solution.upvotes;
    }
    return this.props.solution.upvotes;
  }

  locallyCountDownvote() {
    if (this.props.user.solutionDownvotes.includes(this.props.solution.id)) {
      return 1 + this.props.solution.downvotes;
    }
    return this.props.solution.downvotes;
  }
  renderFeedbackText = () => {
    const timestamp = new Date(this.props.solution.date);
    return (
      <div style={{ marginTop: 5, marginBottom: 10 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <Button
            onClick={() => this.handleUpvote()}
            bsStyle={(this.props.user.solutionUpvotes.includes(this.props.solution.id)) ? 'warning': 'info'}
          >
            <p style={{color:'#48D2A0'}}>
              ▲ {this.locallyCountUpvote()}
            </p>
          </Button>
          <Button
            onClick={() => this.handleDownvote()}
            bsStyle={(this.props.user.solutionDownvotes.includes(this.props.solution.id)) ? 'warning': 'info'}
          >
            <p style={{color:'#F54B5E'}}>
              ▼ {this.locallyCountDownvote()}
            </p>
          </Button>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 14 }}>
          {this.props.solution.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  handleUpvote() {
    if (this.props.user.solutionUpvotes.includes(this.props.solution.id)) {
      this.props.removeSolutionUpvote(this.props.solution);
    } else {
      this.props.addSolutionUpvote(this.props.solution);
    }
  }
  handleDownvote() {
    if (this.props.user.solutionDownvotes.includes(this.props.solution.id)) {
      this.props.removeSolutionDownvote(this.props.solution);
    } else {
      this.props.addSolutionDownvote(this.props.solution);
    }
  }

  handleApprovedStatusChange(event) {
    this.setState({ approved: event.target.value })
  }

  renderSelections = () => {
    if (this.props.editing) {
      return (
        <div className="col-xs-12" style={{padding:20, paddingTop:0}}>
          <div className="col-xs-3">
            <select
              className="form-control"
              value={this.state.approved}
              onChange={this.handleApprovedStatusChange}
            >
              <option value={1} >Approved</option>
              <option value={0} >Not Approved</option>
            </select>
          </div>
        </div>
      );
    }
    const { approved } = this.props.solution;
    return (
      <div className="col-xs-12" style={{padding:20, paddingTop:0}}>
        <div className="col-xs-3">
          {approved ? 'Approved': 'Not Approved'}
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className='col-xs-10 col-xs-offset-1 clearfix'>
        <Panel hasTitle={false} bodyBackGndColor={'#eee'}>
          {this.renderFeedbackText()}
          {this.renderSelections()}
        </Panel>
      </div>
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

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedback,
  addSolutionUpvote,
  addSolutionDownvote,
  removeSolutionUpvote,
  removeSolutionDownvote,
})(DashboardSolutionsCard);

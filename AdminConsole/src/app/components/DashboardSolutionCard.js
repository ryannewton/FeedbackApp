// Import Libraries
import React, { Component, select } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Card, Panel } from './common';

// Import Actions
import { approveFeedback, clarifyFeedback, rejectFeedback, updateFeedback } from '../redux/actions';

class DashboardSolutionsCard extends Component {
  constructor(props) {
    super(props);
    // const feedbackSolutions = this.props.solutions.filter((item) => item.feedbackId == this.props.feedback.id)
    this.state = {
      approved: this.props.solution.approved,
    };
     this.handleUpdate = this.handleUpdate.bind(this);
     this.handleApprovedStatusChange = this.handleApprovedStatusChange.bind(this);
  }

  renderFeedbackText = () => {
    const timestamp = new Date(this.props.solution.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <p style={{color:'#48D2A0'}}>▲ {this.props.solution.upvotes}</p><p style={{color:'#F54B5E'}}>▼ {this.props.solution.downvotes}</p>
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

  handleUpdate() {
    // const { officialReply, approved, status } = this.state;
    // const updatedFeedback = { ...this.props.feedback, approved, status, officialReply };
    // this.props.updateFeedback({ feedback: updatedFeedback })
    console.log('update pressed')
  }

  renderActionButtons = () => {
    return (
      <div style={{paddingTop:20, paddingBottom:20}}>
        <button onClick={() => this.handleUpdate()} className="btn btn-primary">
          Update
        </button>
      </div>
    );
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
      <div className='clearfix'>
        <Panel hasTitle={false}>
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


export default connect(null, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedback
})(DashboardSolutionsCard);

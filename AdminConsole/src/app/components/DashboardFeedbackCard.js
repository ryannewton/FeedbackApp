// Import Libraries
import React, { Component, select } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Card, Panel } from './common';

// Import Actions
import { approveFeedback, clarifyFeedback, rejectFeedback } from '../redux/actions';

class ApproveFeedbackCard extends Component {
  state = {
    replyEnabled:false,
  }
  //Text, Image, Status, Votes, Solutions, Response, Category, Group, Approved, Date, Translated From
  render() {
    return (
      <div className='clearfix'>
        <Panel hasTitle={false}>
          {this.renderFeedbackText()}
          {this.renderSelections()}
          {this.renderReply()}
          <div className='pull-right'>
            {this.renderActionButtons()}
          </div>
        </Panel>
      </div>
    );
  }

  renderFeedbackText = () => {
    console.log(this.props.feedback);
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <p style={{color:'#48D2A0'}}>▲ {this.props.feedback.upvotes}</p><p style={{color:'#F54B5E'}}>▼ {this.props.feedback.downvotes}</p>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 14 }}>
          {this.props.feedback.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  renderReply = () => {
    console.log(this.props.feedback);
    const exists = this.props.feedback.officialReply && this.props.feedback.officialReply.text !== '';
    if (!exists && !this.state.replyEnabled) {
      return null;
    }
    return (
      <div className="col-xs-12">
        <b>Official Reply: </b>
        <input className="form-control" type="text" placeholder={this.props.feedback.officialReply} disabled={this.state.replyEnabled?false:true}/>
      </div>
    );
  }

  renderActionButtons = () => {
    console.log(this.props.feedback);
    return (
      <div style={{paddingTop:20, paddingBottom:20}}>
        <button onClick={() => this.setState({ replyEnabled: !this.state.replyEnabled})} className="btn btn-default">{this.state.replyEnabled?'Dismiss':'Reply'}</button>
        <button className="btn btn-default">View Solutions</button>
        <button className="btn btn-primary">Update</button>
      </div>
    );
  }

  renderSelections = () => {
    return (
      <div className="col-xs-12" style={{padding:20, paddingTop:0}}>
        <div className="col-xs-4">
          <select className="form-control">
            <option>★ New Feedback</option>
            <option>⟳ Project in process</option>
            <option>✔ Project Finished</option>
            <option>✘ Project Closed</option>
            <option>❤︎ Compliment</option>
            <option>ℙ Poll</option>
          </select>
        </div>
        <div className="col-xs-3">
          <select className="form-control">
            <option>Catagory A</option>
            <option>Catagory B</option>
            <option>Catagory C</option>
            <option>Catagory D</option>
          </select>
        </div>
        <div className="col-xs-3">
          <select className="form-control">
            <option>Approved</option>
            <option>Not Approved</option>
            <option>Rejected</option>
          </select>
        </div>
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
  rejectFeedback
})(ApproveFeedbackCard);

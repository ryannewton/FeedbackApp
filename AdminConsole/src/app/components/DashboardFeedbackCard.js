// Import Libraries
import React, { Component, select } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Card, Panel } from './common';
import DashboardSolutionsCard from './DashboardSolutionCard';

// Import Actions
import { approveFeedback, clarifyFeedback, rejectFeedback, updateFeedback } from '../redux/actions';

class ApproveFeedbackCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.feedback.status,
      approved: this.props.feedback.approved,
      officialReply: this.props.feedback.officialReply,
      category: null,
      replyEnabled: false,
      editing: false,
      viewSolutions: false,
    };
     this.handleUpdate = this.handleUpdate.bind(this);
     this.handleStatusChange = this.handleStatusChange.bind(this);
     this.handleApprovedStatusChange = this.handleApprovedStatusChange.bind(this);
     this.inputText = this.inputText.bind(this);
     this.renderSolutionsButton = this.renderSolutionsButton.bind(this)
  }

  renderSolutionsButton() {
    const { viewSolutions } = this.state
    return (
      <div style={{paddingTop:10, paddingBottom:10}}>
        <button className="btn btn-default" onClick={() => this.setState({ viewSolutions: !viewSolutions})}>{viewSolutions?'Hide Solutions':'View Solutions'}</button>
      </div>
    )
  }

  renderFeedbackText = () => {
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 5, marginBottom: 10 }}>
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
    const exists = this.props.feedback.officialReply && this.props.feedback.officialReply.text !== '';
    if (!this.state.editing) {
      if (!exists) {
        return (
          <div className="col-xs-12">
            <b>No Official Reply yet.</b>
          </div>
        );
      }
      return (
        <div className="col-xs-12">
          <b>Official Reply:</b>
          <br />
          {this.props.feedback.officialReply}
        </div>
      );
    }
    return (
      <div className="col-xs-12">
        <b>Official Reply: </b>
        <input className="form-control" type="text" placeholder={this.props.feedback.officialReply} value={this.state.officialReply} onChange={this.inputText}/>
      </div>
    );
  }

  inputText(event) {
    this.setState({ officialReply: event.target.value})
  }

  handleUpdate() {
    const { officialReply, approved, status, category } = this.state;
    const updatedFeedback = { ...this.props.feedback, approved, status, officialReply, category };
    this.props.updateFeedback({ feedback: updatedFeedback })
    this.setState({ editing: false})
  }

  renderActionButtons = () => {
    if (!this.state.editing) {
      return (
        <div style={{paddingTop:10, paddingBottom:10}}>
          <button className="btn btn-default" onClick={() => this.setState({ editing: true})}>Edit</button>
        </div>
      );
    }
    return (
      <div style={{paddingTop:10, paddingBottom:10}}>
        <button className="btn btn-default" onClick={() => this.setState({ editing: false})}>Cancel</button>
        <button onClick={() => this.handleUpdate()} className="btn btn-primary">Update</button>
      </div>
    );
  }

  handleStatusChange(event) {
    this.setState({ status: event.target.value })
  }

  handleApprovedStatusChange(event) {
    this.setState({ approved: event.target.value })
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value })
  }
  maybeRenderApproved() {
    if (this.props.group.feedbackRequiresApproval) {
      if (this.state.editing) {
        return (
          <div className="col-xs-3">
            <select className="form-control" value={this.state.approved} onChange={this.handleApprovedStatusChange}>
              <option value={1} >Approved</option>
              <option value={0} >Not Approved</option>
            </select>
          </div>
        )
      }
      return (
        <div className="col-xs-3">
          {approved ? 'Approved': 'Not Approved'}
        </div>
      )
    }
    return null;
  }

  renderSelections = () => {
    if (this.state.editing) {
      return (
        <div className="col-xs-12" style={{padding:20, paddingTop:0}}>
          <div className="col-xs-4">
            <select className="form-control" value={this.state.status} onChange={this.handleStatusChange}>
              <option value='new'>★ Open</option>
              <option value='inprocess'>⟳ Project in process</option>
              <option value='complete'>✔ Project Finished</option>
              <option value='closed'>✘ Project Closed</option>
              <option value='compliment'>❤︎ Compliment</option>
              <option value='poll'>ℙ Poll</option>
              <option value="rejected" >Rejected</option>
            </select>
          </div>
          <div className="col-xs-3">
            <select className="form-control" value={this.state.category} onChange={this.handleApprovedStatusChange}>
              <option value='category_a'>Category A</option>
              <option value='category_b'>Category B</option>
              <option value='category_c'>Category C</option>
              <option value='category_d'>Category D</option>
            </select>
          </div>
          {this.maybeRenderApproved()}
        </div>
      );
    }
    const { status, category, approved } = this.props.feedback;
    return (
      <div className="col-xs-12" style={{padding:20, paddingTop:0}}>

        <div className="col-xs-3">
          Status: {status}
        </div>
        <div className="col-xs-4">
          {category ? category: <i>No category assigned</i>}
        </div>
<<<<<<< HEAD
=======
        <div className="col-xs-3">
          {approved ? 'Approved': 'Not Approved'}
        </div>
>>>>>>> 7356f6b2605b22ce9d4cbc470da9807fecd56ebd
          {this.maybeRenderApproved()}
      </div>
    )
  }
  maybeRenderSolutions() {
    if (!this.state.viewSolutions) {
      return null;
    }
    const feedbackSolutions = this.props.solutions.list.filter((item) => item.feedbackId == this.props.feedback.id)
    if (!feedbackSolutions.length) {
      return (
        <div className='col-xs-10 col-xs-offset-1 clearfix'>
        <Panel hasTitle={false} bodyBackGndColor={'#eee'}>
          No solutions yet!
          </Panel>
        </div>
      );
    }
    const solutions = feedbackSolutions.map((item) => {
      return (
        <DashboardSolutionsCard solution={item} editing={this.state.editing} />
      )
    })
    return (
      <div>
        {solutions}
      </div>
    );
  }
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
          <div className='pull-left'>
           {this.renderSolutionsButton()}
          </div>
        </Panel>
        {this.maybeRenderSolutions()}
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
  const { solutions, group } = state;
  return { solutions, group };
}
export default connect(mapStateToProps, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedback
})(ApproveFeedbackCard);

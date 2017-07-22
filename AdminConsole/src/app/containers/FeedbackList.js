import React, { Component } from 'react';
import { StatsCard } from '../components';
import { Panel } from '../components/common';
import {
  MenuItem,
  DropdownButton,
  PageHeader, ListGroup, ListGroupItem,
  Button,
  Well,
  Collapse,
} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import { browserHistory } from 'react-router';
import RequireAuth from '../components/RequireAuth';
import DashboardFeedbackCard from '../components/DashboardFeedbackCard';

class FeedbackList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Filtering
      selectedGroup: { id: 0, name: 'all', parent: -1 },
      selectedStatus: 'all',
      selectedCategory: 'all',
      selectedTime: 'all',
      searchTerm: '',

      //Sorting
      sortBy: 'votes',
    };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  filterSolutions = (solution) => {
    if (this.state.selectedTime !== 'all') {
      const solutionDate = new Date(solution.date);
      const daysAgo = (Date.now() - solutionDate.getTime())/1000/60/60/24;
      if (this.state.selectedTime === 'lastWeek' && daysAgo > 7)
        return false;
      if (this.state.selectedTime === 'lastMonth' && daysAgo > 30)
        return false;
    }
    return true;
  }

  createAllowedGroups = (currentGroupNames, currentGroups) => {
    let childrenOfCurrentGroups = [];
    currentGroups.forEach(parent => {
      childrenOfCurrentGroups = [...childrenOfCurrentGroups, ...this.props.groupStructure.filter(group => group.parent === parent.id)];
    });

    if (childrenOfCurrentGroups.length) {
      return this.createAllowedGroups([...currentGroupNames, ...childrenOfCurrentGroups.map((group) => group.name)], childrenOfCurrentGroups);
    } else
      return currentGroupNames;
  }

  filterFeedback = (feedback) => {
    //First Filter by Date
    if (this.state.selectedTime !== 'all') {
      const feedbackDate = new Date(feedback.date);
      const daysAgo = (Date.now() - feedbackDate.getTime())/1000/60/60/24;
      if (this.state.selectedTime === 'lastWeek' && daysAgo > 7)
        return false;
      if (this.state.selectedTime === 'lastMonth' && daysAgo > 30)
        return false;
    }
    //Then Filter by Category (all, facilities, hr, other)
    if (this.state.selectedCategory !== 'all' && this.state.selectedCategory !== feedback.category) {     
      return false; 
    }
    //Then Filter by Status (all, new, inprocess, complete, closed)
    if (this.state.selectedStatus !== 'all' && this.state.selectedStatus !== feedback.status) {
      return false; 
    }
    //Then Filter by Group
    if (this.state.selectedGroup.name !== 'all' && this.state.selectedGroup.name !== feedback.group) {
      const listOfAllowedGroupNames = createAllowedGroups([this.state.selectedGroup.name], [this.state.selectedGroup]);
      if (!listOfAllowedGroupNames.includes(this.state.selectedGroup.name)) return false; 
    }
    //Then Filter by Search
    if (this.state.searchTerm !== '' && !feedback.text.includes(this.state.searchTerm)) {
      return false;
    }
    return true;
  }

  sortFeedback = (a, b) => {
    if (this.state.sortBy === "MostVotes")
      return b.upvotes - a.upvotes;
    else if (this.state.sortBy === "Oldest") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  }

  renderFeedbackList = () => {
    return (
      <div className='row' style={{paddingLeft:15}}>
        <Panel title="Feedback List">
          {this.props.feedback.list
          .filter(this.filterFeedback)
          .sort(this.sortFeedback)
          .map(feedback =>
            <div key={feedback.id}>
              <DashboardFeedbackCard feedback={feedback} />
            </div>
          )}
        </Panel>
      </div>
    );
  }

  renderTimeControls = () => {
    return (
      <div style={{marginBottom:20}}>
      <p>Time: </p>
        <button className={this.state.selectedTime === "all"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedTime: 'all'})}>All</button>
        <button className={this.state.selectedTime === "lastWeek"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedTime: 'lastWeek'})}>Last Week</button>
        <button className={this.state.selectedTime === "lastMonth"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedTime: 'lastMonth'})}>Last Month</button>
      </div>
    );
  }

  renderCategoryControls = () => {
    return (
      <div style={{marginBottom:20}}>
      <p>Catagory: </p>
        <button className={this.state.selectedCategory === "all"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedCategory: 'all'})}>All</button>
        <button className={this.state.selectedCategory === "facilities"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedCategory: 'facilities'})}>Facilities</button>
        <button className={this.state.selectedCategory === "hr"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedCategory: 'hr'})}>HR</button>
        <button className={this.state.selectedCategory === "other"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({selectedCategory: 'other'})}>Other</button>
      </div>
    );
  }

  handleStatusChange(event) {
    this.setState({ selectedStatus: event.target.value })
  }

  renderStatusControls = () => {
    return (
      <div style={{marginBottom:20}}>
        <p>Status: </p>
        <select className="form-control" value={this.state.selectedStatus} onChange={this.handleStatusChange}>
          <option value='all'>All Feedback</option>
          <option value='new'>★ New Feedback</option>
          <option value='inprocess'>⟳ Project in process</option>
          <option value='complete'>✔ Project Finished</option>
          <option value='closed'>✘ Project Closed</option>
        </select>
      </div>
    );
  }

  createStylingArray = (currentGroups, lastGroup) => {
    const newGroup = this.props.group.groupTree.filter(group => group.id === lastGroup.parent);
    if (newGroup.length) {
      return this.createStylingArray([...currentGroups, ...newGroup], newGroup[0]);
    } else
      return currentGroups;
  }

  renderGroupControls = () => {
    // Step #1 - Create the one dimensional styling array
    const stylingArray = this.createStylingArray([this.state.selectedGroup], this.state.selectedGroup);

    // Step #2 - Create the two dimensional output array
    let outputArray = [];
    stylingArray.forEach((selectedNode, index) => {
      outputArray.push(this.props.group.groupTree.filter(group => group.parent === selectedNode.parent));
    });
    outputArray = outputArray.reverse();

    const bottomRow = this.props.group.groupTree.filter(group => group.parent === this.state.selectedGroup.id);
    if (bottomRow.length) outputArray.push(bottomRow);

    const groupsToRender = outputArray.map(row =>
      <div className="row">
        {
          row.map(group =>
            <div className="col-md-3">
              <button
                className={this.state.selectedGroup === group?"btn btn-primary":"btn btn-default"}
                onClick={() => {
                  if (this.state.selectedGroup.id === group.id)
                    this.setState({ selectedGroup: { id: 0, name: 'all', parent: -1 } });
                  else
                    this.setState({ selectedGroup: group });
                }}
              >
                {group.name}
              </button>
            </div>
          )
        }
      </div>
    );

    // Step #3 - Render the output array
    return (
      <div>
      <p>Group: </p>
        {groupsToRender}
      </div>
    );
  }

  renderSearch = () => {
    return (
      <Panel title='Search to Filter'>
        <input className="form-control" value={this.state.searchTerm} onChange={(event) => this.setState({searchTerm: event.target.value})} />
      </Panel>
    );
  }

  renderSort = () => {
    return (
      <Panel title='Sort by...'>
        <button className={this.state.sortBy === "MostVotes"?"btn btn-primary":"btn btn-default"} onClick={() => this.setState({sortBy: 'MostVotes'})}>Most Votes</button>
        <button className={(this.state.sortBy === "MostVotes"||this.state.sortBy === "Oldest")?"btn btn-default":"btn btn-primary"}  onClick={() => this.setState({sortBy: 'MostRecent'})}>Most Recent</button>
        <button className={this.state.sortBy === "Oldest"?"btn btn-primary":"btn btn-default"}  onClick={() => this.setState({sortBy: 'Oldest'})}>Oldest</button>
      </Panel>
    );
  }

  render() {
    return(
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-8'>
            {/* Left Side - Data: Key Stats and Feedback Cards */}
            {this.renderFeedbackList()}
          </div>
          <div className='col-md-4'>
            {/* Right Side - Controls: Time, Category, Group */}
            {this.renderSearch()}
            {this.renderSort()}
            <Panel title='Filter by...'>
              {this.renderStatusControls()}
              {this.renderTimeControls()}
              {this.renderCategoryControls()}
              {this.renderGroupControls()}
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { feedback, solutions, group } = state;
  return { feedback, solutions, group };
}

export default connect(mapStateToProps, {})(RequireAuth(FeedbackList));

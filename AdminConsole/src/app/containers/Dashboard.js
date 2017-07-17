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

const dataHelper = [
  {ID: 1, NAME: 'North', PARENT: 0},
  {ID: 2, NAME: 'South', PARENT: 0},
  {ID: 3, NAME: 'East', PARENT: 0},
  {ID: 4, NAME: 'West', PARENT: 0},
  {ID: 5, NAME: 'NorthWest', PARENT: 1},
  {ID: 6, NAME: 'NorthEast', PARENT: 1},
  {ID: 7, NAME: 'Test1', PARENT: 1},
  {ID: 8, NAME: 'Test2', PARENT: 1},
  {ID: 9, NAME: 'Westchester', PARENT: 5},
  {ID: 10, NAME: 'Manhatten', PARENT: 5},
  {ID: 11, NAME: 'Brooklyn', PARENT: 5},
  {ID: 12, NAME: 'Queens', PARENT: 5},
]

// Teach search bar how to calculate suggestions for any given input value.
const getRegions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : dataHelper.filter(lang =>
    lang.NAME.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = region => region.NAME;

// Use your imagination to render suggestions.
const renderSuggestion = region => (
  <div>
    <a>
      {region.NAME}
    </a>
  </div>
);

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Filtering
      selectedGroup: 'all',
      selectedCategory: 'all',
      selectedTime: 'all',
      searchTerm: '',

      //Sorting
      sortBy: 'votes',

      //For Groups Component
      open: false,
      open1: false,
      open2: false,
      open3: false,
      open_third_level: false,
      open_third_level1: false,
      open_third_level2: false,
      open_third_level3: false,
      opened: 0,
      openedQueue: [],
      value: '',
      regions: [],
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      regions: getRegions(value)
    });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      regions: []
    });
  }

  renderTreeButtons = (ID) => {
    const filteredData = dataHelper.filter((item) => item.PARENT == ID)
    const renderedButtons = filteredData.map((item) => {
      // const customColor = ((this.state.openedQueue.includes(item.ID) ? 'yellow' : 'blue')
      let y = 'yellow'
      if (this.state.openedQueue.includes(item.ID)) {
        y = "yellow"
      } else {
        y = "blue"
      }
      const customColor = y
      return (
        <div className="col-lg-3" key={item.ID}>
          <Button bsSize="large" block style={{backgroundColor: customColor}} onClick={ () => {
            this.setState({ opened: item.ID});
            if (this.state.openedQueue === [] || item.PARENT == 0) {
              this.setState({ openedQueue: [item.ID]})
            } else if (this.state.openedQueue.length == 1) {
              this.setState({ openedQueue: [...this.state.openedQueue, item.ID]})
            } else if (this.state.openedQueue.length == 2) {
              if (item.PARENT == this.state.openedQueue[0]) {
                this.setState({ openedQueue: [item.PARENT, item.ID]})
              } else {
                this.setState({ openedQueue: [...this.state.openedQueue, item.ID]})
              }
            } else if (this.state.openedQueue.length == 3) {
              if (item.PARENT == this.state.openedQueue[0]) {
                this.setState({ openedQueue: [item.PARENT, item.ID]})
              } else if (item.PARENT == this.state.openedQueue[1]) {
                this.setState({ openedQueue: [this.state.openedQueue[0], item.PARENT, item.ID]})
              }
            }
          }}>
            {item.NAME}
          </Button>
        </div>
      );
    });
    return renderedButtons;
  }

  renderTilesHelper4 = () => {
    if (this.state.opened == 0) {
      return null;
    }
    const selectedFeedback = dataHelper.filter((item) => item.ID == this.state.opened)
    if (selectedFeedback[0].PARENT == 0) {
      return (
        <div className="row" style={{paddingTop: 10}}>
          {this.renderTreeButtons(selectedFeedback[0].ID)}
        </div>
      );
    }
    const selectedFeedbackParent = dataHelper.filter((item) => item.ID == selectedFeedback[0].PARENT)
    if (selectedFeedbackParent[0].PARENT == 0) {
      return (
        <div>
          <div className="row" style={{paddingTop: 10}}>
            {this.renderTreeButtons(selectedFeedbackParent[0].ID)}
          </div>
          <div className="row" style={{paddingTop: 10}}>
            {this.renderTreeButtons(selectedFeedback[0].ID)}
          </div>
        </div>
      );
    }
    const selectedFeedbackParentParent = dataHelper.filter((item) => item.ID == selectedFeedbackParent[0].PARENT)
    return (
      <div>
        <div className="row" style={{paddingTop: 10}}>
          {this.renderTreeButtons(selectedFeedbackParentParent[0].ID)}
        </div>
        <div className="row" style={{paddingTop: 10}}>
          {this.renderTreeButtons(selectedFeedbackParent[0].ID)}
        </div>
        <div className="row" style={{paddingTop: 10}}>
          {this.renderTreeButtons(selectedFeedback[0].ID)}
        </div>
      </div>
    );
  }

  renderKeyStats = () => {
    const filteredFeedback = this.props.feedback.list.filter(this.filterFeedback).sort(this.sortFeedback);
    const filteredSolutions =
      this.props.solutions.list
      .filter((solution) => filteredFeedback.some((feedback) => feedback.id === solution.feedbackId))
      .filter(this.filterSolutions);
    const percentOfTopFive = [0,0,0,0,0].reduce((count, item, index) => {
      if (filteredFeedback.length <= index) return count;
      else if(filteredFeedback[index].officialReply) return (count + 1);
      else return count;
    },0)/5*100;

    return (
      <div
        className="row"
        style={{marginBottom: '5px', paddingLeft:15}}>
        <div className="col-md-4">
          <StatsCard
            statValue={filteredFeedback.length || 0}
            statLabel={'New Feedback Submitted!'}
            icon={<i className="fa fa-comments-o"></i>}
            backColor={'red'}
          />
        </div>
        <div className="col-md-4">
          <StatsCard
            statValue={filteredSolutions.length}
            statLabel={'New solutions Proposed!'}
            icon={<i className="fa fa-tasks"></i>}
            backColor={'violet'}
          />
        </div>
        <div className="col-md-4">
          <StatsCard
            statValue={percentOfTopFive}
            statLabel={'% of Top 5 With Responses'}
            icon={<i className="fa fa-check"></i>}
            backColor={'blue'}
          />
        </div>
      </div>
    );
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
    //Then Filter by Group
    if (this.state.selectedGroup !== 'all' && this.state.selectedGroup !== feedback.group) {
      return false; 
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
    else {
      return new Date(b.date) - new Date(a.date);
    }
  }

  renderFeedbackList = () => {
    return (
      <div className='row' style={{paddingLeft:15}}>
        <Panel title="Feedback List">
          {console.log(this.props.feedback.list[0])}
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
      <Panel title="Filter by Time">
        <button className="btn btn-default" onClick={() => this.setState({selectedTime: 'all'})}>All</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedTime: 'lastWeek'})}>Last Week</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedTime: 'lastMonth'})}>Last Month</button>
      </Panel>
    );
  }

  renderCategoryControls = () => {
    return (
      <Panel title="Filter by Feedback Category">
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'all'})}>All</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'facilities'})}>Facilities</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'hr'})}>HR</button>
        <button className="btn btn-default" onClick={() => this.setState({selectedCategory: 'other'})}>Other</button>
      </Panel>
    );
  }

  renderGroupControls = () => {
    const { value, regions } = this.state;
    const inputProps = {
      placeholder: 'Type a region',
      value,
      onChange: this.onChange,
    };

    return (
      <Panel hasTitle={false}>
        <div className="col-lg-8">
          <div className="input-group custom-search-form">
            <Autosuggest
              suggestions={regions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              className="form-control"
              theme={{input: {width: 750, height: 35}}}
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">
                <i className="fa fa-search" />
              </button>
            </span>
          </div>
          <div style={{ paddingTop: 10}}>
            <div className="row">
              {this.renderTreeButtons(0)}
            </div>
            {this.renderTilesHelper4(this.state.opened)}
          </div>
        </div>
        <div className="col-lg-4 pull-right">
          <div
            title="Top Feedback"
          >            
          </div>
        </div>
      </Panel>
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
        <button className="btn btn-default" onClick={() => this.setState({sortBy: 'MostVotes'})}>Most Votes</button>
        <button className="btn btn-default" onClick={() => this.setState({sortBy: 'MostRecent'})}>Most Recent</button>
      </Panel>
    );
  }

  render() {
    return(
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-8'>
            {/* Left Side - Data: Key Stats and Feedback Cards */}
            {this.renderKeyStats()}
            {this.renderFeedbackList()}
          </div>
          <div className='col-md-4'>
            {/* Right Side - Controls: Time, Category, Group */}
            {this.renderSearch()}
            {this.renderSort()}
            {this.renderTimeControls()}
            {this.renderCategoryControls()}
            {this.renderGroupControls()}
          </div>
        </div>     
      </div>
    );
  }  
}

function mapStateToProps(state) {
  const { feedback, solutions } = state;
  return { feedback, solutions };
}

export default connect(mapStateToProps, {})(RequireAuth(Dashboard));

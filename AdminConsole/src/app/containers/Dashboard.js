import React, { Component } from 'react';
import { StatsCard } from '../components';
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
  constructor(...args) {
    super(...args);

    this.state = {
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
    return (<div
      className="row"
      style={{marginBottom: '5px'}}>
      <div className="col-md-3">
        <StatsCard
          statValue={'12'}
          statLabel={'New Feedback!'}
          icon={<i className="fa fa-comments-o"></i>}
          backColor={'red'}
        />
      </div>
      <div className="col-md-3">
        <StatsCard
          statValue={'20'}
          statLabel={'New solutions!'}
          icon={<i className="fa fa-tasks"></i>}
          backColor={'violet'}
        />
      </div>
      <div className="col-md-3">
        <StatsCard
          statValue={'64'}
          statLabel={'Finished feedback'}
          icon={<i className="fa fa-check"></i>}
          backColor={'blue'}
        />
      </div>
      <div className="col-md-3">
        <StatsCard
          statValue={'6'}
          statLabel={'Feedback in progress'}
          icon={<i className="fa fa-spinner"></i>}
          backColor={'green'}
        />
      </div>
    </div>);
  }

  renderFeedbackList = () => {
    return (
      <div>
        <p>Feedbackcards go here</p>
      </div>
    );
  }

  renderTimeControls = () => {
    return (
      <div>Time Controls</div>
    );
  }

  renderTypeControls = () => {
    return (
      <div>Type Controls</div>
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
      <div className="row">
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
      </div>
    );
  }

  render() {
    return(
      <div>
        {/* Left Side - Data: Key Stats and Feedback Cards */}
        {this.renderKeyStats()}
        <hr style={{border: "1px solid blue"}}/>
        {this.renderFeedbackList()}

        {/* Right Side - Controls: Time, Type, Group */}
        {this.renderTimeControls()}
        {this.renderTypeControls()}
        {this.renderGroupControls()}        
      </div>
    );
  }  
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(RequireAuth(Dashboard));

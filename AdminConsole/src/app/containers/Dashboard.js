import React, { PropTypes, PureComponent } from 'react';
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

class Dashboard extends PureComponent {
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
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      regions: getRegions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      regions: []
    });
  };
  renderTreeButtons(ID, collapsable = false) {
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
        <div className="col-lg-3">
          <Button bsSize="large" block bsStyle="" style={{backgroundColor: customColor}} onClick={ () => {
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
    }
  )
  return renderedButtons;
  }

  renderTilesHelper4() {
    const dataHelper = [
      {ID: 1, NAME: 'North', PARENT: '0'},
      {ID: 2, NAME: 'South', PARENT: '0'},
      {ID: 3, NAME: 'East', PARENT: '0'},
      {ID: 4, NAME: 'West', PARENT: '0'},
      {ID: 5, NAME: 'NorthWest', PARENT: '1'},
      {ID: 6, NAME: 'NorthEast', PARENT: '1'},
      {ID: 7, NAME: 'Test1', PARENT: '1'},
      {ID: 8, NAME: 'Test2', PARENT: '1'},
      {ID: 9, NAME: 'Westchester', PARENT: '5'},
      {ID: 10, NAME: 'Manhatten', PARENT: '5'},
      {ID: 11, NAME: 'Brooklyn', PARENT: '5'},
      {ID: 12, NAME: 'Queens', PARENT: '5'},
    ]
    console.log(this.state.openedQueue)
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

  renderHome() {
    // const { loading, authenticated } = this.props;
    // const token = localStorage.getItem('token');
    // if (loading) {
    //   return (
    //     <div>
    //       loading
    //     </div>
    //   )
    // }
    // if (!token) {
    //   return (
    //     <div>
    //       Please login!
    //       <Link to={'/Dashboard/workProgress'}>
    //         <button
    //           type='button'
    //           className='btn btn-primary'
    //           onClick={this.handleSubmit}
    //         >
    //         Login again!
    //       </button>
    //       </Link>
    //     </div>
    //   )
    // }
    if (true) { //was authenticated
      const { value, regions } = this.state;
      const inputProps = {
        placeholder: 'Type a region',
        value,
        onChange: this.onChange,
      };

      return(
        <div>
          <div
            className="row"
            style={{marginBottom: '5px'}}>
            <div className="col-md-3">
              <StatsCard
                statValue={'12'}
                statLabel={<a>New Feedback!</a>}
                icon={<i className="fa fa-comments-o"></i>}
                backColor={'red'}
              />
            </div>
            <div className="col-md-3">
              <StatsCard
                statValue={'20'}
                statLabel={<a>New solutions!</a>}
                icon={<i className="fa fa-tasks"></i>}
                backColor={'violet'}
              />
            </div>
            <div className="col-md-3">
              <StatsCard
                statValue={'64'}
                statLabel={<a>Finished feedback</a>}
                icon={<i className="fa fa-check"></i>}
                backColor={'blue'}
              />
            </div>
            <div className="col-md-3">
              <StatsCard
                statValue={'6'}
                statLabel={<a>Feedback in progress</a>}
                icon={<i className="fa fa-spinner"></i>}
                backColor={'green'}
              />
            </div>
          </div>

          <hr style={{border: "1px solid blue"}}/>

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
                hasTitle={true}
              >
                <div>
                  <p>Feedbackcards go here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // return (
    //   <div>
    //     Authentication failed! Please try again.
    //     <Link to={'/Dashboard/workProgress'}>
    //       <button
    //         type='button'
    //         className='btn btn-primary'
    //         onClick={this.handleSubmit}
    //       >
    //       Login again!
    //     </button>
    //     </Link>
    //   </div>
    // );
  }
  render() {
    return(
      //<div>Test</div>
      this.renderHome()
    )
  }
}

function mapStateToProps(state) {
  console.log(state.auth);
  const { email, emailSentSuccess, loading, authenticated } = state.auth;
  return { email, emailSentSuccess, loading, authenticated };
}

export default connect(mapStateToProps, {})(RequireAuth(Dashboard));

        //
        // <div className="row">
        //   <div className="col-md-8">
        //     <EarningGraph
        //       labels={earningGraphLabels}
        //       datasets={earningGraphDatasets}
        //     />
        //   </div>
        //   <div className="col-lg-4">
        //    <Notifications />
        //   </div>
        // </div>
        //
        // <div className="row">
        //   <div className="col-md-8">
        //     <WorkProgress />
        //   </div>
        //   <div className="col-md-4">
        //     <TwitterFeed />
        //   </div>
        // </div>
        //
        // <div className="row">
        //   <div className="col-md-5">
        //     <TeamMatesDemo
        //       isFetching={teamMatesIsFetching}
        //       members={teamMates}
        //     />
        //   </div>
        //   <div className="col-md-7">
        //     <TodoListDemo />
        //   </div>
        // </div>
import React, { Component } from 'react';
import { ButtonGroup, DropdownButton, MenuItem, InputGroup, Panel, Button, Glyphicon, Image } from 'react-bootstrap';
import logo from '../img/wb_logo.png';
import avatar from '../img/avatar.jpg';
import './App.css';
import FeedbackCard from '../components/FeedbackCard';
import { pullFeedback, pullSolutions, pullGroupTreeInfo, pullGroupInfo, authorizeUserFail } from '../actions';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <img src={logo} className="App-logo pull-left"/>
          <div className="pull-right">
            <img src={avatar} className="App-logo"/>
            Log Out
          </div>
        </div>        
        <div className="row" style={{ marginBottom: 0.6, borderBottom: '1px solid #aaa', padding: '0.5 0 0.17 0', color: '#000' }}>
          <div className="col-md-8">
            <ButtonGroup>
              <DropdownButton id='main-filter-time' title='Time'>
                <MenuItem>Today</MenuItem>
                <MenuItem>Last 7 Days</MenuItem>
                <MenuItem>Last 30 Days</MenuItem>
                <MenuItem divider />
                <MenuItem>Clear Filter</MenuItem>
              </DropdownButton>
              <DropdownButton id='main-filter-category' title='Category'>
                <MenuItem>Store Operations</MenuItem>
                <MenuItem>Merchandising</MenuItem>
                <MenuItem>Planning & Allocation</MenuItem>
                <MenuItem>Marketing</MenuItem>
                <MenuItem divider />
                <MenuItem>Clear Filter</MenuItem>
              </DropdownButton>
              <DropdownButton id='main-fitler-group' title='Group'>
                <MenuItem>District A</MenuItem>
                <MenuItem>District B</MenuItem>
                <MenuItem>District C</MenuItem>
                <MenuItem divider />
                <MenuItem>Clear Filter</MenuItem>
              </DropdownButton>
            </ButtonGroup>
          </div>
          <div className="col-md-4 pull-right">
            <InputGroup>
              <InputGroup.Addon>@</InputGroup.Addon>
              <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" />
            </InputGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <Button>Awaiting Approval (3) <Glyphicon glyph='sort' /></Button>
            <FeedbackCard />
            <FeedbackCard />
            <FeedbackCard />
          </div>
          <div className="col-md-3">
            <Button>Open (5) <Glyphicon glyph='sort' /></Button>
            <FeedbackCard />
          </div>
          <div className="col-md-3">
            <Button>In Process (6) <Glyphicon glyph='sort' /></Button>
            <FeedbackCard />
          </div>
          <div className="col-md-3">
            <Button>Completed (62) <Glyphicon glyph='sort' /></Button>
            <FeedbackCard />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { state };
};

export default connect(mapStateToProps, { pullFeedback })(App);

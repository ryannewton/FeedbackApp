import React, { Component } from 'react';
import logo from './img/wb_logo.png';
import avatar from './img/avatar.jpg';
import './App.css';
import { ButtonGroup, DropdownButton, MenuItem, InputGroup } from 'react-bootstrap';

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
        <div className="row">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
                  <li><a href="#">Link</a></li>
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><a href="#">Action</a></li>
                      <li><a href="#">Another action</a></li>
                      <li><a href="#">Something else here</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#">Separated link</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#">One more separated link</a></li>
                    </ul>
                  </li>
                </ul>
                <form className="navbar-form navbar-right">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Search" />
                  </div>
                </form>
              </div>
            </div>
          </nav>
        </div>
        <div className="row">
          <div>
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
          <div className="pull-right">
            <InputGroup>
              <InputGroup.Addon>@</InputGroup.Addon>
              <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" />
            </InputGroup>
          </div>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

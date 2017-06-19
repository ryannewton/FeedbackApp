// Import Libraries
import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Nav extends Component {

  constructor(props) {
    super(props);

    this.state = {
      urlView: 'active',
      categoryView: '',
      settingsView: '',
    };

    this.changeView = this.changeView.bind(this);
  }

  changeView(event) {
    if (event.target.text === 'New Projects' || event.target.text === 'Collaborative Feedback Portal') {
      this.setState({ urlView: 'active', categoryView: '', settingsView: '' });
    } else if (event.target.text === 'Projects Being Worked On') {
      this.setState({ urlView: '', categoryView: 'active', settingsView: '' });
    } else if (event.target.text === 'Completed Projects') {
      this.setState({ urlView: '', categoryView: '', settingsView: 'active' });
    }
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <Link
              to="/"
              onClick={this.changeView}
              className="navbar-brand"
            >
              Collaborative Feedback Portal
            </Link>
          </div>
          <ul className="nav navbar-nav">
            <li
              className={this.state.urlView}
              onClick={this.changeView}
              id={'URLNav'}
            >
              <Link to="/">New Projects</Link>
            </li>
            <li
              className={this.state.categoryView}
              onClick={this.changeView}
              id={'CategoryNav'}
            >
              <Link to="/projects/inprocess">Projects Being Worked On</Link>
            </li>
            <li
              className={this.state.settingsView}
              onClick={this.changeView}
              id={'SettingsNav'}
            >
              <Link to="/projects/complete">Completed Projects</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

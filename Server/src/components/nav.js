	//Import Libraries
import React, { Component } from 'react';
import { Link, LinkContainer } from "react-router";

export default class Nav extends Component {

	constructor(props) {
		super(props);

		this.state = {
			urlView: "active",
			categoryView: "",
			settingsView: "",
		}
	}

	changeView(event) {
		if (event.target.text === "Rank Ideas" || event.target.text === "Stanford Feedback Portal") {
			this.setState({ urlView: "active", categoryView: "", settingsView: "" });
		}	else if (event.target.text === "See Feedback") {
			this.setState({ urlView: "", categoryView: "active", settingsView: "" });
		} else if (event.target.text === "Settings") {
			this.setState({ urlView: "", categoryView: "", settingsView: "active" });
		}
	}

	render() {
		return (
			<nav className="navbar navbar-default">
			  <div className="container">
			    <div className="navbar-header">
			    	<Link to="/" onClick={this.changeView.bind(this)} className="navbar-brand">Stanford Feedback Portal</Link>
			    </div>
			    <ul className="nav navbar-nav">
			    	<li className={this.state.urlView} onClick={this.changeView.bind(this)} id={"URLNav"}><Link to="/">New Projects</Link></li>
			    	{/*<li className={this.state.categoryView} onClick={this.changeView.bind(this)} id={"CategoryNav"}><Link to="/feedback">Projects Being Worked On</Link></li>*/}
			    	{/*<li className={this.state.settingsView} onClick={this.changeView.bind(this)} id={"SettingsNav"}><Link to="/settings">Completed Projects</Link></li>*/}
			    </ul>
			  </div>
			</nav>
		);
	}
}

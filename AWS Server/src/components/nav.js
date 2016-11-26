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
		if (event.target.text === "URL View" || event.target.text === "Productivity App") {
			this.setState({ urlView: "active", categoryView: "", settingsView: "" });
		}	else if (event.target.text === "Category View") {
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
			    	<Link to="/" onClick={this.changeView.bind(this)} className="navbar-brand">Productivity App</Link>
			    </div>
			    <ul className="nav navbar-nav">
			    	<li className={this.state.urlView} onClick={this.changeView.bind(this)} id={"URLNav"}><Link to="/">URL View</Link></li>
			    	<li className={this.state.categoryView} onClick={this.changeView.bind(this)} id={"CategoryNav"}><Link to="/category">Category View</Link></li>
			    	<li className={this.state.settingsView} onClick={this.changeView.bind(this)} id={"SettingsNav"}><Link to="/settings">Settings</Link></li>
			    </ul>
			  </div>
			</nav>
		);
	}
}

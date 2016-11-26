//import libraries
import React, { Component } from 'react';
import Chart from 'chart.js';
import parseUrl from './parseUrl_helper';
import Website_Table from './website_table.js';
import {Doughnut} from 'react-chartjs-2';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

//import components

//import actions
import { getWebsites } from '../actions/index.js';
import { bindActionCreators } from 'redux';

class UrlCategoryView extends Component {

	constructor(props) {
		super(props);

		function getUrlParameter(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.search);
	    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
		};

		this.state = {
			websites: [],
			view: "url",
			categories: [],
			activeNav: {urlView: "active", categoryView: "", settingsView: ""},
			userid: getUrlParameter('userid'),
			totalNumDays: 0,
			categoriesChanged: [],
			intervalIndex: setInterval(this.updateDatabase.bind(this), 3000)
		}	

		this.pullData();
	}

	updateCategory(url, category) {
		
		clearInterval(this.state.intervalIndex); 

		let index = this.state.websites.findIndex(function(element, index, array) {
			return element.url === url;
		})

		let websites = this.state.websites;
		let oldCategory = websites[index].category;
		websites[index].category = category;
		let categories = this.consolidateCategories(websites);

		index = this.state.categoriesChanged.findIndex(function(element, index, array) {
			return element.url === url;
		})

		let categoriesChanged = this.state.categoriesChanged;

		if (index === -1) {
			categoriesChanged.push({ url, category, oldCategory });
		}
		else {
			categoriesChanged[index].category = category;
		}

		this.setState({ websites, categories, categoriesChanged, intervalIndex: setInterval(this.updateDatabase.bind(this), 3000) });
	}

	updateDatabase(url, category) {		

		let categoriesChanged = this.state.categoriesChanged;		
		this.setState({ categoriesChanged: [] });

		while (categoriesChanged.length > 0) {			
			let change = categoriesChanged.pop();

			var xhttp = new XMLHttpRequest();
			console.log("GET", "/updateCategory?url=" + encodeURIComponent(change.url) + "&newCategory=" + encodeURIComponent(change.category) + "&userid=" + encodeURIComponent(this.state.userid) + "&oldCategory=" + encodeURIComponent(change.oldCategory));
		  xhttp.open("GET", "/updateCategory?url=" + encodeURIComponent(change.url) + "&newCategory=" + encodeURIComponent(change.category) + "&userid=" + encodeURIComponent(this.state.userid) + "&oldCategory=" + encodeURIComponent(change.oldCategory));
		  xhttp.send();			
		}
	}

	//Pulls the users data from the AWS Server and loads the websites array in state
	pullData() {
		let rawData = [];
	  let consolidateTimeSegments = this.consolidateTimeSegments.bind(this);
	  let consolidateCategories = this.consolidateCategories.bind(this);
	  let setState = this.setState.bind(this);

	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
				rawData = JSON.parse(xhttp.responseText);
	  		let websites = consolidateTimeSegments(rawData);
				let categories = consolidateCategories(websites);
				setState({websites, categories});				
	    }
	  };
	  xhttp.open("GET", "/data?userid=" + this.state.userid, true);
	  xhttp.send();
	}	

	consolidateCategories(websites) {

		return	websites.reduce(function(prev, curr, index, array) {
			let existingCategoryIndex = prev.findIndex((item) => {return item.category === curr.category});

			if(existingCategoryIndex === -1) {
				prev.push({url: curr.category, timeElapsed: curr.timeElapsed, category: curr.category});
			} else {
				prev[existingCategoryIndex].timeElapsed += curr.timeElapsed;
			}

			return prev;

		}, []);
	}

	consolidateTimeSegments(timeSegments) {

		if (timeSegments.length > 0) {
			var timeDiff = Math.abs(Date.now() - Number(timeSegments[0].datetime));			
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 			
			this.setState({ totalNumDays: diffDays })
		}
		
		return timeSegments.reduce(function(prev, curr, index, array) {
		
			if (curr.url !== "IDLE") {
				let timeElapsed = 0;
				if (index !== array.length-1) {
					timeElapsed = array[index+1].datetime - curr.datetime;
				}

				let existingURLIndex = prev.findIndex((item) => {return item.url === curr.url});

				if(existingURLIndex === -1) {
					prev.push({url: curr.url, timeElapsed, category: curr.category});
				} else {
					prev[existingURLIndex].timeElapsed += timeElapsed;
				}
			}
			
			return prev;
		}, []);
	}

	generateChartData() {		

		let presentation = [];

		if (this.state.view === "url") {
			presentation = this.state.websites.slice(0).sort((a,b) => {return b.timeElapsed - a.timeElapsed;}).slice(0,8);
		} else if (this.state.view === "category") {
			presentation = this.state.categories.slice(0).sort((a,b) => {return b.timeElapsed - a.timeElapsed;}).slice(0,8);
		}
				
		if (presentation.length)
		{			
			return {
				labels: presentation.map((item) => {return item.url}),
				datasets: [{
					label: 'Avg # of Minutes per Day',
					data: presentation.map((item) => {return item.timeElapsed}),
					backgroundColor: [
						'rgba(114, 147, 203, 1)',
						'rgba(225, 151, 76, 1)',
						'rgba(132, 186, 91, 1)',
						'rgba(211, 94, 96, 1)',
						'rgba(128, 133, 133, 1)',
						'rgba(144, 103, 167, 1)',							
						'rgba(171, 104, 87, 1)',
						'rgba(204, 194, 16, 1)'
					]
				}]
			}
		}
	}		

	changeView(event) {
		if (event.target.text === "URL View") {
			this.setState({view: "url", activeNav: {urlView: "active", categoryView: "", settingsView: ""}});
		} else if (event.target.text === "Category View") {
			this.setState({view: "category", activeNav: {urlView: "", categoryView: "active", settingsView: ""}});
		} else if (event.target.text === "Settings") {
			this.setState({view: "settings", activeNav: {urlView: "", categoryView: "", settingsView: "active"}});
		}
	}

	render() {
		var chart;
		if (this.state.websites.length) {
			chart = <Doughnut id="myChart" data={this.generateChartData()} height={400}/>;
		} else {
			chart = "Loading...";
		}

		return (
			<div>
				<nav className="navbar navbar-default">
				  <div className="container">
				    <div className="navbar-header">
				    	<a href="#" className="navbar-brand">Productivity App</a>
				    </div>
				    <ul className="nav navbar-nav">
				    	<li className={this.state.activeNav.urlView}><a href="#" onClick={this.changeView.bind(this)}>URL View</a></li>
				    	<li className={this.state.activeNav.categoryView}><a href="#" onClick={this.changeView.bind(this)}>Category View</a></li>
				    	<li className={this.state.activeNav.settingsView} id={"SettingsNav"}><a href="#" onClick={this.changeView.bind(this)}>Settings</a></li>
				    </ul>
				  </div>
				</nav>
				<Router history={hashHistory}>
	        <Route path='/' component={Container}>
	          <IndexRoute component={Home} />
	          <Route path='/address' component={Address} />
	          <Route path='*' component={NotFound} />
	        </Route>
     	 </Router>
				<div className="container-fluid">
					<div className="row">						
						<div className="col-sm-6 col-md-6 col-lg-6">
							{chart}
						</div>
						<div>
							<Website_Table id="displayedTable" updateCategory={this.updateCategory.bind(this)} totalNumDays={this.state.totalNumDays} userid={this.state.userid} websites={this.state.websites.slice(0).sort((a,b) => {return b.timeElapsed - a.timeElapsed;})} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		websites: state.websites
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ websites: getWebsites }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlCategoryView);
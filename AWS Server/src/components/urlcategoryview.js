//import libraries
import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';

//import components
import Website_Table from './website_table.js';

export default class UrlCategoryView extends Component {

	constructor(props) {
		super(props);		
	}

	returnNotExluded(website) {
		return !(website.exclude === "true");
	}

	generatePersonalChartData() {		

		let presentation = [];

		if (this.props.location.pathname === "/") {
			presentation = this.props.main.websites.slice(0).filter(this.returnNotExluded).sort((a,b) => {return b.timeElapsed - a.timeElapsed;}).slice(0,8);
		} else if (this.props.location.pathname === "/category") {
			presentation = this.props.main.categories.slice(0).sort((a,b) => {return b.timeElapsed - a.timeElapsed;}).slice(0,8);
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

	generatePublicChartData() {		

		let presentation = [];

		if (this.props.location.pathname === "/") {
			presentation = this.props.main.publicWebsites.slice(0).filter(this.returnNotExluded).sort((a,b) => {return b.timeElapsed - a.timeElapsed;}).slice(0,8);
		} else if (this.props.location.pathname === "/category") {
			presentation = this.props.main.publicCategories.slice(0).sort((a,b) => {return b.timeElapsed - a.timeElapsed;}).slice(0,8);
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

	render() {
		var personalChart;
		if (this.props.main.websites.length) {
			personalChart = <Doughnut 
				id="myChart" 
				data={this.generatePersonalChartData()} 
				height={200}
				options={{
					legend: {
						position: 'bottom'
					}}
				}/>;
		} else {
			personalChart = "Loading...";
		}

		var publicChart;
		if (this.props.main.publicWebsites.length) {
			publicChart = <Doughnut 
				id="myChart" 
				data={this.generatePublicChartData()} 
				height={200} 
				options={{
					legend: {
						position: 'bottom'
					}}
				}/>;
		} else {
			publicChart = "Loading...";
		}

		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-6">
							<div className="panel panel-default">
							  <div className="panel-heading">
							    <h3 className="panel-title">Where you spend time on the internet</h3>
							  </div>
							  <div className="panel-body">
							    {personalChart}
							  </div>
							</div>	
						</div>
						<div className="col-md-6">
							<div className="panel panel-default">
							  <div className="panel-heading">
							    <h3 className="panel-title">Where the average person spends time on the internet</h3>
							  </div>
							  <div className="panel-body">
							    {publicChart}
							  </div>
							</div>									
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="panel panel-default">
							  <div className="panel-heading">
							    <h3 className="panel-title">Detailed Information...</h3>
							  </div>
							  <div className="panel-body">
					    		<Website_Table id="displayedTable" updateCategory={this.props.updateCategory} totalNumDays={this.props.main.totalNumDays} totalTime={this.props.main.totalTime} userid={this.props.main.userid} type={"Private"} urlIndex={this.props.main.privateUrlIndex} websites={this.props.main.websites.filter(this.returnNotExluded)} />
								  <ul className="pager">
								    <li className="previous"><a href="#" id={"Private Previous"} onClick={this.props.changeUrlIndex}>&larr; Previous 10</a></li>
								    <li className="next"><a href="#" id={"Private Next"} onClick={this.props.changeUrlIndex}>Next 10 &rarr;</a></li>
								  </ul>
							  </div>
							</div>														
						</div>
						<div className="col-md-6">
							<div className="panel panel-default">
							  <div className="panel-heading">
							    <h3 className="panel-title">Detailed Information...</h3>
							  </div>
							  <div className="panel-body">
					    		<Website_Table id="displayedTable" updateCategory={this.props.updateCategory} totalNumDays={this.props.main.totalNumDays} totalTime={this.props.main.totalPublicTime} userid={this.props.main.userid} type={"Public"} urlIndex={this.props.main.publicUrlIndex} websites={this.props.main.publicWebsites.filter(this.returnNotExluded)} />
								  <ul className="pager">
								    <li className="previous"><a href="#" id={"Public Previous"} onClick={this.props.changeUrlIndex}>&larr; Previous 10</a></li>
								    <li className="next"><a href="#" id={"Public Next"} onClick={this.props.changeUrlIndex}>Next 10 &rarr;</a></li>
								  </ul>
							  </div>
							</div>														
						</div>
					</div>
				</div>
			</div>
		);
	}
}

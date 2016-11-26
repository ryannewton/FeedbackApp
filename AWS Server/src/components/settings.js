//import libraries
import React, { Component } from 'react';

//import components
import Website_Table from './website_table.js';

export default class Settings extends Component {

	constructor(props) {
		super(props);
	}	

	returnNotExluded(website) {
		return !(website.exclude === "true");
	}

	returnExluded(website) {
		return website.exclude === "true";
	}

	render() {

		return (			
			<div className="row">

				<div className="col-md-6">
					<div className="panel panel-default">
					  <div className="panel-heading">
					    <h3 className="panel-title">Exclude any items you don't want to be displayed...</h3>
					  </div>
					  <div className="panel-body">
							<Website_Table id="displayedTable" totalNumDays={this.props.main.totalNumDays} totalTime={this.props.main.totalTime} userid={this.props.main.userid} websites={this.props.main.websites.filter(this.returnNotExluded)} urlIndex={this.props.main.settingsUrlIndex} excludeURL={this.props.excludeURL} removeURL={this.props.removeURL} type={"Exclude"} />
							<ul className="pager">
						    <li className="previous"><a href="#" id={"Settings Previous"} onClick={this.props.changeUrlIndex}>&larr; Previous 10</a></li>
						    <li className="next"><a href="#" id={"Settings Next"} onClick={this.props.changeUrlIndex}>Next 10 &rarr;</a></li>
						  </ul>
					  </div>
				  </div>
				</div>

				<div className="col-md-6">
					<div className="panel panel-default">
					  <div className="panel-heading">
					    <h3 className="panel-title">These are your excluded Items: Remove any items you want completeley deleted</h3>
					  </div>
					  <div className="panel-body">
							<Website_Table id="displayedTable" updateCategory={this.props.updateCategory} totalNumDays={this.props.main.totalNumDays} totalTime={this.props.main.totalTime} userid={this.props.main.userid} websites={this.props.main.websites.filter(this.returnExluded)} urlIndex={this.props.main.settingsUrlIndex} excludeURL={this.props.excludeURL} removeURL={this.props.removeURL} type={"Remove"} />
							<ul className="pager">
						    <li className="previous"><a href="#" id={"Settings Previous"} onClick={this.props.changeUrlIndex}>&larr; Previous 10</a></li>
						    <li className="next"><a href="#" id={"Settings Next"} onClick={this.props.changeUrlIndex}>Next 10 &rarr;</a></li>
						  </ul>
					  </div>
				  </div>
				</div>

			</div>
		);
	}
}

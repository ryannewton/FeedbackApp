//import libraries
import React, { Component } from 'react';

export default class Admin extends Component {

	constructor(props) {
		super(props);
	}	

	render() {

		return (			
			<div className="row">

					<div className="col-lg-6">

						<h3>Administrative Tasks</h3>
						<button type="button" className="btn btn-default" onClick={this.props.updateDefaultCategories}>Update Default Category for Each URL</button>				

					</div>

					<div className="col-lg-6">

						<h3>Custom Monitoring</h3>


					</div>

			</div>
		);
	}
}

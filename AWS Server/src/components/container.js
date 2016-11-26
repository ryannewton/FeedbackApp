//Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import Components
import Nav from './nav.js';

class Container extends Component {

	constructor(props) {
		super(props);
		this.pullData();		
		setInterval(this.props.updateDatabase, 5000);
	}

	//Pulls the users data from the AWS Server and loads the websites array in state
	pullData() {
	  let privateRawData = [];
	  let publicRawData = [];
	  let props = this.props;

	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	    	var publicXhttp = new XMLHttpRequest();

	    	publicXhttp.onreadystatechange = function() {
	    		if (publicXhttp.readyState == 4 && publicXhttp.status == 200) {
	    			privateRawData = JSON.parse(xhttp.responseText);
			      publicRawData = JSON.parse(publicXhttp.responseText);

			      props.pullDataFromServer(privateRawData, publicRawData);   
	    		}
	    	}
	    	publicXhttp.open("GET", "/pullPublicData");
	    	publicXhttp.send();	    	
	    }
	  };
	  xhttp.open("GET", "/pullPrivateData?userid=" + this.props.main.userid);
	  xhttp.send();
	}

	render() {
		return (
			<div className="container-fluid">
				<Nav activeNav={this.props.main.activeNav} changeView={this.props.changeView} />
				{React.cloneElement(this.props.children, this.props)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);  
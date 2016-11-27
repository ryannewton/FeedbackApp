//Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

class Container extends Component {

	constructor(props) {
		super(props);
		this.pullData();		
	}

	//Pulls the users data from the AWS Server and loads the websites array in state
	pullData() {
	  let feedback = [];
	  let props = this.props;

	  var xhttp = new XMLHttpRequest();
	  xhttp.open("POST", "/pullFeedback", true);
	  xhttp.setRequestHeader('Content-Type', 'application/json');	  
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
  			feedback = JSON.parse(xhttp.responseText);
  			console.log(feedback);
	      props.pullDataFromServer(feedback);   
	    }
	  };

	  let params = {
	  	start_date: this.props.main.start_date,
	  	end_date: this.props.main.end_date
	  }
	  xhttp.send(JSON.stringify(params));
	}

	render() {
		return (
			<div>
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
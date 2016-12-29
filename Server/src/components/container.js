//Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookie from 'react-cookie';

//Import Actions
import Actions from '../actions/actions.js';

//Import Components
import Nav from './nav.js';

class Container extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Nav />
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

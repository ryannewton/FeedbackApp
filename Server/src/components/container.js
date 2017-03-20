//Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import * as actions from '../actions';

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
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);  

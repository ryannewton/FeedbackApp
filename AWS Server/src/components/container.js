//Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

class Container extends Component {

	constructor(props) {
		super(props);
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
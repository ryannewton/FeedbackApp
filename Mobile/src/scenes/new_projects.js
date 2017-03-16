'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Icon, DeckSwiper, Card, CardItem, Left, Right, Body, Thumbnail, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RequireAuth from '../components/require_auth';

//Import actions
import * as actions from '../actions';

class New_Projects extends Component {
	constructor(props) {
		super(props);

		this.state = {
			index: 0,
			projects: this.props.projects.filter((project) =>
				!this.props.user.doNotDisplayList
				.includes(project.id))
				.sort(this.sortByID)
				.sort(this.sortByVotes)
		};

		this.swipeRight = this.swipeRight.bind(this);
		this.swipeLeft = this.swipeLeft.bind(this);
	}

	sortByID(a, b) {
		return b.id - a.id;
	}

	sortByVotes(a, b) {
		return b.votes - a.votes;
	}

	swipeRight() {
		const { user } = this.props;
		const project = this.state.projects[this.state.index];

		// If user hasn't upvoted this project, add an upvote
		if (!user.upvotes.includes(project.id)) {
			this.props.addUpvote(project);
		}

		this.props.addToDoNotDisplayList(project.id);
		this.setState({ index: this.state.index + 1 });
	}

	swipeLeft() {
		const project = this.state.projects[this.state.index];
		this.props.addToDoNotDisplayList(project.id);
		this.setState({ index: this.state.index + 1 });
	}

	renderCard(project) {
		return (
			<View>
				<Card style={{ elevation: 3, marginHorizontal: 8, height: 300 }}>
					<CardItem>
						<Left>
							<Text>{project.title}</Text>
						</Left>
					</CardItem>
					<CardItem cardBody style={{ paddingHorizontal: 8 }}>
						<Text>{project.description}</Text>
					</CardItem>
					<CardItem>
						<Icon name="heart" style={{ color: '#ED4A6A' }} />
						<Text>{project.votes}</Text>
					</CardItem>
				</Card>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text>Swipe Left To Skip</Text>
					<Text>Swipe Right To Upvote</Text>
				</View>
			</View>
		);
	}

	render() {
		return (
			<Container>
				<View>
					<DeckSwiper
						dataSource={this.state.projects}
						onSwipeRight={this.swipeRight}
						onSwipeLeft={this.swipeLeft}
						renderItem={project => this.renderCard(project)}
					/>
				</View>
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth(New_Projects));

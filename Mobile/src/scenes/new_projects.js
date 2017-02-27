'use strict'

//Import Libraries
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Container, Icon, DeckSwiper, Card, CardItem, Left, Right, Body, Thumbnail, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import actions
import * as actions from '../actions';

class New_Projects extends Component {

    render() {
        return (
            <Container>
                <View>
                    <DeckSwiper                        
                        dataSource={this.props.projects}
                        renderItem={project => {return (
                        	<View>                        		
                                <Card style={{ elevation: 3, marginHorizontal: 5, paddingHorizontal: 5, height: 300 }}>
                                    <CardItem>
                                        <Left>
                                            <Text>{project.title}</Text>
                                        </Left>
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Text>{project.description}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Icon name="heart" style={{ color: '#ED4A6A' }} />
                                        <Text>{project.votes}</Text>
                                    </CardItem>
                                </Card>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                	<Text>Swipe Left To Skip</Text>
                                	<Text>Swipe Right To Upvote</Text>
                                </View>
                            </View>
                          )}
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(New_Projects);

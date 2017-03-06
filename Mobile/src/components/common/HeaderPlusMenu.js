'use strict';

import React from 'react';
import { Text, View, Platform } from 'react-native';

import Menu, {
	MenuContext,
	MenuOptions,
	MenuOption,
	MenuTrigger
} from 'react-native-menu';

import Icon from 'react-native-vector-icons/Entypo';

class HeaderPlusMenu extends React.Component {

	constructor(props: Object, context: any) {
		super(props, context);
		
	}	
	render() {

		const styles = {
			container: {
				height: 40,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: '#F7FCFF',
				elevation: 3,
				position: 'relative',
				...Platform.select({
					ios: {
						paddingTop: 15
					}
				})
			},
			textStyle: {
				fontSize: 20,
			},
			menuStyle: {
				marginHorizontal: 5
			}	
		};

		return (
			<View style={styles.container}>
				<Text style={[styles.textStyle, styles.menuStyle]}>{this.props.children}</Text>
				<Menu style={styles.menuStyle} onSelect={() => this.props.navigate({ type: 'selectTab', tabKey: 'Settings' })}>
					<MenuTrigger>
						<Icon name="dots-three-vertical" size={20} color="#000000"/>
					</MenuTrigger>
					<MenuOptions>
						<MenuOption value="normal">
							<Text>View Settings</Text>
						</MenuOption>
					</MenuOptions>
				</Menu>
			</View>
		);
	}
}

export { HeaderPlusMenu };

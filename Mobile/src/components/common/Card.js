'use strict';

import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
	return (
		<View style={styles.containerStyle}>
			{props.children}
		</View>
	);
};

const styles = {
	containerStyle: {
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		elevation: 1,
		marginLeft: 4,
		marginRight: 4,
		marginTop: 4
	}
};

export { Card };

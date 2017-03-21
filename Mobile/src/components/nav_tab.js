// Import libaries
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

// Import components, functions, and styles
import styles from '../styles/styles_main';

class NavTab extends Component {

  constructor(props, context) {
    super(props, context);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigate({ type: 'selectTab', tabKey: this.props.route.key });
  }

  render() {
    const style = [styles.tabText];
    if (this.props.selected) {
      style.push(styles.tabSelected);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={this.onPress}>
        <Text style={style}>
          {this.props.route.displayName}
        </Text>
      </TouchableOpacity>
    );
  }
}

NavTab.propTypes = {
  route: React.PropTypes.object,
  selected: React.PropTypes.bool,
  navigate: React.PropTypes.func,
};

export default NavTab;

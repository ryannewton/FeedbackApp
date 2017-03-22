// Import libaries
import React, { Component } from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';

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
    const style = [styles.tab];
    let source;
    switch (this.props.route.key) {
      case 'Feedback': {
        source = this.props.selected ? require('../../images/icons/feedback2-selected.png') : require('../../images/icons/feedback2-notselected.png');
        break;
      } case 'NewProjects': {
        source = this.props.selected ? require('../../images/icons/newprojects2-selected.png') : require('../../images/icons/newprojects2-notselected.png');
        break;
      } case 'AllProjects': {
        source = this.props.selected ? require('../../images/icons/allprojects3-selected.png') : require('../../images/icons/allprojects3-notselected.png');
        break;
      }
      default:
        console.log('error in switch in nav_tab');
    }
    
    if (this.props.selected) {
      style.push(styles.tabSelected);      
    }

    return (
      <TouchableOpacity style={style} onPress={this.onPress}>
        <Image source={source} style={{ width: 35, height: 35 }} />
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

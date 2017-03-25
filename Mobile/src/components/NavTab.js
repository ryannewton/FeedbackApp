// Import libaries
import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import FeedbackSelected from '../../images/icons/feedback2-selected_100px.png';
import FeedbackNotSelected from '../../images/icons/feedback2-notselected_100px.png';
import NewProjectsSelected from '../../images/icons/newprojects2-selected_100px.png';
import NewProjectsNotSelected from '../../images/icons/newprojects2-notselected_100px.png';
import AllProjectsSelected from '../../images/icons/allprojects4-selected_100px.png';
import AllProjectsNotSelected from '../../images/icons/allprojects4-notselected_100px.png';

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
        source = this.props.selected ? FeedbackSelected : FeedbackNotSelected;
        break;
      } case 'NewProjects': {
        source = this.props.selected ? NewProjectsSelected : NewProjectsNotSelected;
        break;
      } case 'AllProjects': {
        source = this.props.selected ? AllProjectsSelected : AllProjectsNotSelected;
        break;
      }
      default:
        console.error('Error in switch in NavTab');
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

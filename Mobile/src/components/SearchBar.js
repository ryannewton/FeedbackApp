// Import libraries
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import Menu, { MenuOptions, MenuOption, MenuTrigger, MenuContext } from 'react-native-menu';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Import components, styles, and actions
import { changeFilterMethod, setSearchQuery, searchInProgress } from '../actions';
import Search from './SearchInput';
import styles from '../styles/components/SearchBarStyles';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPressed: props.feedback.searchInProgress,
      filterMethod: props.feedback.filterMethod,
      placeholderText: props.feedback.searchQuery,
    };
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  renderFilterMethodTitle = (method) => {
    switch (method) {
      case 'this_week':
        return "This Week's Feedback";
      case 'my_feedback':
        return 'My Feedback';
      case 'today':
        return "Today's Feedback"
      case 'all':
        return 'All Feedback'
      default:
        return method;
    }
  }

  renderTitleHelper = () => {
    // Temporary fix to weird bug with reducer
    if (!this.props.feedback.filterMethod) {
      return 'All Feedback';
    }
    return this.renderFilterMethodTitle(this.props.feedback.filterMethod);
  }

  renderSearchBar = () => {
    const {
      spacingStyle,
      layoutStyle,
      titleViewStyle,
      titleStyle,
      iconLayout,
    } = styles;

    // Has the user pressed the search button?
    // If so, need to render an entirely different header
    if (!this.state.searchPressed) {
      return (
        <View>
          <View style={spacingStyle} />
          <View style={layoutStyle}>
            <View style={{ flex: 1 }} />
            <View style={titleViewStyle}>
              <Text style={titleStyle}>
                {this.renderTitleHelper()}
              </Text>
            </View>
            <View style={iconLayout}>
              {this.renderPicker()}
              <TouchableOpacity onPress={() => this.setState({ searchPressed: true })} >
                <Icon name="search" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={{ height: 20, backgroundColor: '#00A2FF' }} />
        <Search
          onCancel={() => {
            this.setState({ searchPressed: false });
            this.setState({ filterMethod: 'all' });
            this.props.changeFilterMethod('all');
            this.props.searchInProgress(false)
          }}
          onSearch={(query) => {
            this.props.setSearchQuery(query);
            this.props.changeFilterMethod('search');
            this.props.searchInProgress(true);
            this.setState({ filterMethod: 'search' });
          }}
        />
      </View>
    );
  }


  hasDisabledStyle = (value) => {
    // Should we indicate that this is the method you are currently seeing?
    if (this.state.filterMethod === value) {
      return { backgroundColor: '#ccc' };
    }
    return {};
  }


  if (Platform.OS == 'android') {
      return null;
    }
    const renderTouchable = () => <TouchableOpacity />;
    const {
      menuOptions,
      divider,
      pickerStyle,
    } = styles;
    return (
      <View style={pickerStyle}>
        <MenuContext>
          <Menu
            onSelect={(filterMethod) => {
              this.setState({ filterMethod });
              this.props.changeFilterMethod(filterMethod);
            }}
          >
            <MenuTrigger renderTouchable={renderTouchable}>
              <Icon name="filter" type="font-awesome" size={25} color="white" />
            </MenuTrigger>
            <MenuOptions style={menuOptions}>
              <MenuOption
                value="all"
                renderTouchable={renderTouchable}
                style={this.hasDisabledStyle('all')}
              >
                <Text>All</Text>
              </MenuOption>
              <View style={divider} />
              <MenuOption
                value="this_week"
                renderTouchable={renderTouchable}
                style={this.hasDisabledStyle('this_week')}
              >
                <Text>This week</Text>
              </MenuOption>
              <MenuOption
                value="today"
                renderTouchable={renderTouchable}
                style={this.hasDisabledStyle('today')}
              >
                <Text>Today</Text>
              </MenuOption>
              <MenuOption
                value="my_feedback"
                renderTouchable={renderTouchable}
                style={this.hasDisabledStyle('my_feedback')}
              >
                <Text>My Feedback</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </MenuContext>
      </View>
    );
  }
  
  render() {
    return (
      <View style={{ height: 60, backgroundColor: '#00A2FF' }}>
        {this.renderSearchBar()}
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  const { feedback } = state;
  return { feedback };
};

export default connect(mapStateToProps, { changeFilterMethod, setSearchQuery, searchInProgress })(SearchBar);

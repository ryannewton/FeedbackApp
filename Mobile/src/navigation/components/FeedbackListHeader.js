// Import libraries
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, LayoutAnimation, Platform, StyleSheet } from 'react-native';
import Modal from 'react-native-modalbox';
import Menu, { MenuOptions, MenuOption, MenuTrigger, MenuContext } from 'react-native-menu';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import translate from '../../translation'

// Import components, styles, and actions
import { Button } from '../../components/common';
import { changeFilterMethod, setSearchQuery, searchInProgress } from '../../actions';
import SearchInput from './SearchInput';
import SendInviteTextButton from './SendInviteTextButton';
import styles from '../../styles/components/SearchBarStyles';

class FeedbackSubmitHeader extends Component {
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

  renderHeader = () => {
    // If user has pressed search button, render search text input
    if (this.state.searchPressed) {
      return this.renderHeaderWithSearchBar();
    }
    return this.renderHeaderWithIcons();
  }

  renderHeaderWithIcons = () => {
    const { spacingStyle, layoutStyle, titleViewStyle, titleStyle, iconLayout } = styles;
    return (
      <View>
        <View style={spacingStyle} />
        <View style={[layoutStyle, {justifyContent:'space-between'}]}>
          <View style={titleViewStyle}>
            <Text style={titleStyle}>
              {this.renderTitleHelper()}
            </Text>
          </View>
          <View style={iconLayout}>
            <View style = {{paddingRight: 17}}>
              <SendInviteTextButton navigation={this.props.navigation} />
            </View>
              {this.renderPicker()}
            <TouchableOpacity onPress={() => this.setState({ searchPressed: true })} >
              <Icon name="search" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderHeaderWithSearchBar = () => {
    return (
      <View>
        <View style={{ height: 20, backgroundColor: '#00A2FF' }} />
        <SearchInput
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

  renderFilterMethodTitle = (method) => {
    const { language } = this.props
    const { THIS_WEEK,
            TODAY,
            MY_FEEDBACK,
            ALL_FEEDBACK
    } = translate(language);

    switch (method) {
      case 'this_week':
        return THIS_WEEK;
      case 'my_feedback':
        return MY_FEEDBACK;
      case 'today':
        return TODAY;
      case 'all':
        return ALL_FEEDBACK;
      default:
        return method;
    }
  }

  renderTitleHelper = () => {
    const { language } = this.props
    const { ALL_FEEDBACK,
    } = translate(language);

    // Temporary fix to weird bug with reducer
    if (!this.props.feedback.filterMethod) {
      return ALL_FEEDBACK;
    }
    return this.renderFilterMethodTitle(this.props.feedback.filterMethod);
  }

  hasDisabledStyle = (value) => {
    // Should we indicate that this is the method you are currently seeing?
    if (this.state.filterMethod === value) {
      return { backgroundColor: '#ccc' };
    }
    return {};
  }

  renderPicker = () => {
    // Exclude on Android, library doesn't work

    const renderTouchable = () => <TouchableOpacity />;
    const { menuOptions, divider, pickerStyle } = styles;
    return (
      <View style={pickerStyle}>
        <TouchableOpacity onPress={() => this.refs.modal2.open()}>
          <Icon name="filter" type="font-awesome" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
    // return (
    //   <View style={pickerStyle}>
    //     <MenuContext>
    //       <Menu
    //         onSelect={(filterMethod) => {
    //           this.setState({ filterMethod });
    //           this.props.changeFilterMethod(filterMethod);
    //         }}
    //       >
    //         <MenuTrigger renderTouchable={renderTouchable}>
    //           <Icon name="filter" type="font-awesome" size={25} color="white" />
    //         </MenuTrigger>
    //         <MenuOptions style={menuOptions}>
    //           <MenuOption
    //             value="all"
    //             renderTouchable={renderTouchable}
    //             style={this.hasDisabledStyle('all')}
    //           >
    //             <Text>{ALL_FEEDBACK}</Text>
    //           </MenuOption>
    //           <View style={divider} />
    //           <MenuOption
    //             value="this_week"
    //             renderTouchable={renderTouchable}
    //             style={this.hasDisabledStyle('this_week')}
    //           >
    //             <Text>{THIS_WEEK}</Text>
    //           </MenuOption>
    //           <MenuOption
    //             value="today"
    //             renderTouchable={renderTouchable}
    //             style={this.hasDisabledStyle('today')}
    //           >
    //             <Text>{TODAY}</Text>
    //           </MenuOption>
    //           <MenuOption
    //             value="my_feedback"
    //             renderTouchable={renderTouchable}
    //             style={this.hasDisabledStyle('my_feedback')}
    //           >
    //             <Text>{MY_FEEDBACK}</Text>
    //           </MenuOption>
    //         </MenuOptions>
    //       </Menu>
    //     </MenuContext>
    //   </View>
    // );
  }
  changeFilterMethod = (filterMethod) => {
    this.refs.modal2.close();
    this.setState({ filterMethod });
    this.props.changeFilterMethod(filterMethod);
  }
  render() {
    const { language } = this.props
    const { MOST_POPULAR,
            ALL_FEEDBACK,
            THIS_WEEK,
            TODAY,
            MY_FEEDBACK,
    } = translate(language);
    return (
      <View style={{ height: 60, backgroundColor: '#00A2FF' }}>
        {this.renderHeader()}
        <View style={{paddingTop: 10}}>
          <Modal style={[styles2.modal, styles2.modal2]} backdrop={false}  position={"top"} ref={"modal2"}>
              <Button onPress={() => this.changeFilterMethod('all')} style={{marginBottom:10}}> All Feedback </Button>
              <Button onPress={() => this.changeFilterMethod('this_week')} style={{marginBottom:10}}> This Week </Button>
              <Button onPress={() => this.changeFilterMethod('today')} style={{marginBottom:10}}> Today </Button>
              <Button onPress={() => this.changeFilterMethod('my_feedback')} style={{marginBottom:10}}> My Feedback </Button>
              <Button onPress={() => this.refs.modal2.close()} style={{marginBottom:10}}> Cancel </Button>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles2 = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  }

});

const mapStateToProps = (state) => {
  const { feedback } = state;
  const { language } = state.user
  return { feedback, language };
};

export default connect(mapStateToProps, { changeFilterMethod, setSearchQuery, searchInProgress })(FeedbackSubmitHeader);

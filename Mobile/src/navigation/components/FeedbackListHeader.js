// Import libraries
import React, { Component } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, StyleSheet } from 'react-native';
import { Text } from '../../components/common';
import Modal from 'react-native-modalbox';
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
            <View style = {{paddingRight: 25, bottom: 2}}>
              <SendInviteTextButton navigation={this.props.navigation} />
            </View>
              {this.renderPicker()}
            <View style={{ bottom: 4}}>
              <TouchableOpacity onPress={() => this.setState({ searchPressed: true })} >
                <Icon name="search" size={30} color="white" />
              </TouchableOpacity>
            </View>
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
    if (!this.props.group.categories.length) {
      return null;
    }
    const renderTouchable = () => <TouchableOpacity />;
    const { menuOptions, divider, pickerStyle } = styles;
    return (
      <View style={[pickerStyle, {bottom: 7}]}>
        <TouchableOpacity onPress={() => this.refs.modal2.open()}>
          <Icon name="filter" type="font-awesome" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
  changeFilterMethod = (filterMethod) => {
    this.refs.modal2.close();
    this.setState({ filterMethod });
    this.props.changeFilterMethod(filterMethod);
  }
  renderFilterButtons() {
    if (!this.props.group.categories.length) {
      return (
        <View>
          <Button key={'all'} style={styles2.button} textStyle={{color:'black', fontWeight:'400'}} onPress={() => this.changeFilterMethod('all')}> All Feedback </Button>
          <Button key={'this_week'} style={styles2.button} textStyle={{color:'black', fontWeight:'400'}} onPress={() => this.changeFilterMethod('this_week')}> This Week </Button>
          <Button key={'today'} style={styles2.button} textStyle={{color:'black', fontWeight:'400'}} onPress={() => this.changeFilterMethod('today')}> Today </Button>
          <Button  key={'my_feedback'} style={styles2.button} textStyle={{color:'black', fontWeight:'400'}} onPress={() => this.changeFilterMethod('my_feedback')}> My Feedback </Button>
        </View>
      );
    }
    return (
      this.props.group.categories.map((item) => <Button key={item} style={styles2.button} textStyle={{color:'black', fontWeight:'400'}} onPress={() => this.changeFilterMethod(item)}>{item}</Button>)
    );
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
      <View style={{ height: 60, backgroundColor: '#00A2FF'}}>
        {this.renderHeader()}
          <Modal style={[styles2.modal, styles2.modal2]} backdrop={false}  position={'top'} entry={'top'} ref={"modal2"} coverScreen={true}>
            {this.renderFilterButtons()}
            <Button onPress={() => {this.refs.modal2.close(); this.props.changeFilterMethod('all'); }} style={{marginBottom:10}}> Clear filter </Button>
          </Modal>
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
    paddingTop:30,
    height: 350,
    backgroundColor: 'rgba(70,70,70,0.8)'
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

  button: {
    marginBottom:10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth:0,
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
  const { feedback, group } = state;
  const { language } = state.user
  return { feedback, language, group };
};

export default connect(mapStateToProps, { changeFilterMethod, setSearchQuery, searchInProgress })(FeedbackSubmitHeader);

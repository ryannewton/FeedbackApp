// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
import {
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import translate from '../translation';
import ModalPicker from 'react-native-modal-picker'

// Import actions
import {
  submitFeedbackToServer,
  updateFeedbackToServer,
  updateFeedbackText,
  updateImageURL,
  updateCategory,
  updateFeedbackType,
  updateErrorMessage,
  uploadImage,
  sendGoogleAnalytics,
  removeImage,
} from '../actions';

// Import components, functions, and styles
import { Button, Spinner, Text } from '../components/common';
import styles from '../styles/scenes/FeedbackSubmitStyles';

class FeedbackSubmit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      imageWidth: null,
      imageHeight: null,
    }

    props.sendGoogleAnalytics('FeedbackSubmit', props.group.groupName)
  }

  componentWillUpdate(nextProps, nextState) {
    // Only update image dimensions if image changes
    if (nextProps.feedback.imageURL !== this.props.feedback.imageURL && nextProps.feedback.imageURL) {
      Image.getSize(nextProps.feedback.imageURL, (iwidth, iheight) => {
        this.setState(() => ({ imageWidth: iwidth, imageHeight: iheight }));
      });
    }
  }

  addImageHelper = async (pickerChoice) => {
    const pickerResult = (pickerChoice == 'takePhoto') ? await ImagePicker.launchCameraAsync() :
      await ImagePicker.launchImageLibraryAsync({ allowsEditing: false });

    // If user selects an image
    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.uri);
    }
  }

  addImage = async () => {
    Alert.alert(
      'Upload photo.',
      '',
      [
        { text: 'Take photo...', onPress: () => this.addImageHelper('takePhoto') },
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Choose from library...', onPress: () => this.addImageHelper('choosePhoto') },
      ],
      { cancelable: false }
    )
  }

  maybeRenderImage = () => {
    const { width, height } = Dimensions.get('window')
    const { imageURL } = this.props.feedback;

    // If there is no image, don't render anything
    if (!imageURL) {
      return null;
    }
    return (
        <Image
          source={{ uri: imageURL }}
          style={[{
            flex: 1,
            width: this.state.imageWidth,
            height: this.state.imageHeight,
            resizeMode: 'contain',
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.5,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            marginTop: 10,
            alignSelf: 'center',
          }]}
          resizeMode={'contain'}
        />
    );
  }

  maybeRenderUploadingOverlay = () => {
    const { loadingImage } = this.props.feedback;

    if (loadingImage) {
      return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator
            color="#fff"
            animating
            size="large"
          />
          <Text style={{ color: 'white' }}>Uploading photo...</Text>
        </View>
      );
    }
  }

  renderImageButton = () => {
    const { language } = this.props.user;

    return (
      <View style={{ flexDirection: 'row', backgroundColor:'white' }}>
          <TouchableOpacity
            onPress={() => this.addImage()}
            style={[styles.button, { backgroundColor: 'white', borderWidth: 0, flexDirection: 'row', alignItems: 'center', padding: 14 }]}
          >
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'left' }}>
              Add Photo
            </Text>
            <Icon name="add-a-photo" size={25} color={'grey'} />
          </TouchableOpacity>
      </View>
    );
  }

  renderSubmitButton = () => {
    const { language } = this.props.user;

    if (this.props.feedback.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    if (this.props.navigation.state.params.feedback) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={this.updateFeedback}
            style={[styles.button, { flexDirection: 'row', alignItems: 'center', marginLeft: 8, marginTop: 10, marginRight: 8 }]}
          >
            <Text style={{ color: 'white', flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'center'}}>
              {translate(language).UPDATE_FEEDBACK}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={this.submitFeedback}
            style={[styles.button, { flexDirection: 'row', alignItems: 'center', marginLeft: 8, marginTop: 10, marginRight: 8 }]}
          >
            <Text style={{ color: 'white', flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
              {translate(language).SUBMIT_FEEDBACK}
            </Text>
          </TouchableOpacity>
      </View>
    );
  }

  maybeRenderDeleteButton() {
    if (this.props.feedback.imageURL) {
      return (
        <View>
          <TouchableOpacity onPress={ () => {
            this.props.removeImage();
          }}>
            <Icon name="remove-circle" size={40} color={'red'}/>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  handleCategoryChange(category) {
    this.props.updateCategory(category.label)
  }

  handleValueChange() {
    return this.props.feedback.category || 'Click to choose > ';
  }

  maybeRenderCategoryModal() {
    // If the group doesn't have categories
    const { categories } = this.props.group;
    if (!categories.length) {
      return null;
    }
    let index = 0;
    const categoriesForPicker = categories.map((item) => {
      return (
        { key: index++, label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
      );
    });

    categoriesForPicker.unshift({ key: index++, label: 'Choose a category', section: true })
    return (
      <View style={{ flexDirection: 'row'}}>
        <ModalPicker
          data={categoriesForPicker}
          style={{ flex:1 }}
          optionTextStyle={{ fontSize:18 }}
          optionStyle={{ padding: 10 }}
          sectionStyle={{ padding: 20 }}
          sectionTextStyle={{ fontSize:18, fontWeight:'600' }}
          cancelTextStyle={{ fontSize:18, fontWeight:'600' }}
          initValue="Select something yummy!"
          onChange={(category) => this.handleCategoryChange(category) }
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginTop: 5, marginBottom: 1 }}>
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'left', paddingLeft: 13 }}>
              Add Category
            </Text>
              <TextInput
                style={{
                  borderColor: '#00A2FF',
                  flex: 2,
                  height: 42,
                  borderTopWidth: 1,
                  borderRadius: 4,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingHorizontal: 10,
                  fontWeight:'400',
                  textAlign:'right',
                  backgroundColor: 'white',
                  fontSize: 16,
                }}
                editable={false}
                value={this.handleValueChange()}
              />
          </View>
        </ModalPicker>
      </View>
    );
  }

  renderTextInput() {
    const { language } = this.props.user;
    return (
      <View style={{ flexDirection: 'row'}}>
        <TextInput
          multiline={Boolean(true)}
          onChangeText={text => this.props.updateFeedbackText(text)}
          style={[styles.feedbackInput, { flex: 1 }]}
          placeholder={translate(language).ENTER_FEEDBACK}
          placeholderTextColor="#d0d0d0"
          value={this.props.feedback.text}
          maxLength={500}
        />
      </View>
    );
  }

  maybeRenderErrorMessage() {
    return (
      <Text style={styles.errorTextStyle}>
        {this.props.feedback.errorMessage}
      </Text>
    );
  }

  renderSettingsButton() {
    return (
      <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
          <Text style={{ fontWeight: '500', backgroundColor: 'transparent', fontSize: 14, color: 'black' }}>
            {translate(this.props.user.language).SETTINGS}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { width, height } = Dimensions.get('window')
    const { language } = this.props.user;

    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {this.maybeRenderErrorMessage()}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor:'#f0f0f0' }}>
            {this.renderTextInput()}
            {this.maybeRenderCategoryModal()}
            {this.renderImageButton()}
            {this.maybeRenderDeleteButton()}
            {this.maybeRenderImage()}
          </View>
          {this.renderSettingsButton()}
          {this.maybeRenderUploadingOverlay()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

FeedbackSubmit.propTypes = {
  user: PropTypes.object,
  group: PropTypes.object,
  feedback: PropTypes.object,
  navigation: PropTypes.object,
  submitFeedbackToServer: PropTypes.func,
  updateFeedbackToServer: PropTypes.func,
  updateFeedbackText: PropTypes.func,
  updateImageURL: PropTypes.func,
  updateCategory: PropTypes.func,
  updateFeedbackType: PropTypes.func,
  updateErrorMessage: PropTypes.func,
  uploadImage: PropTypes.func,
  sendGoogleAnalytics: PropTypes.func,
  removeImage: PropTypes.func,
};

function mapStateToProps(state) {
  const { user, group, feedback } = state;
  return { user, group, feedback };
}

export default connect(mapStateToProps, {
  submitFeedbackToServer,
  updateFeedbackToServer,
  updateFeedbackText,
  updateImageURL,
  updateCategory,
  updateFeedbackType,
  updateErrorMessage,
  uploadImage,
  sendGoogleAnalytics,
  removeImage,
})(FeedbackSubmit);

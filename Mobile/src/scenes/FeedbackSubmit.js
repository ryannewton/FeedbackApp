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
  Text,
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
  uploadImage,
  sendGoogleAnalytics,
  removeImage
} from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';
import styles from '../styles/scenes/FeedbackSubmitStyles';

class FeedbackSubmit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: '',
      feedback: '',
      positiveFeedback: '',
      negativeFeedback: '',
      imageWidth: null,
      imageHeight: null,
      category: '',
    };

    props.sendGoogleAnalytics('FeedbackSubmit', props.group.groupName)
  }

  submitFeedback = () => {
    if (this.state.feedback || this.state.positiveFeedback || this.state.negativeFeedback) {
      // First we search the feedback for restricted words
      if (this.props.group.bannedWords.test(this.state.feedback.toLowerCase()) ||
          this.props.group.bannedWords.test(this.state.positiveFeedback.toLowerCase()) ||
          this.props.group.bannedWords.test(this.state.negativeFeedback.toLowerCase())) {
        // If restricted words then we show an error to the user
        this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
      } else {
        // If no restricted words then we continue
        if (this.state.feedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.feedback, 'single feedback', this.props.feedback.imageURL || '', this.state.category);
          this.setState({ feedback: '' });
        } if (this.state.positiveFeedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.positiveFeedback, 'positive feedback', this.props.feedback.positiveImageURL || '', this.state.category);
          this.setState({ positiveFeedback: '' });
        } if (this.state.negativeFeedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.negativeFeedback, 'negative feedback', this.props.feedback.negativeImageURL || '', this.state.category);
          this.setState({ negativeFeedback: '' });
        }

        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('Submitted', translate(this.props.user.language).FEEDBACK_RECIEVED);
      }
    } else {
      this.setState({ errorMessage: 'Feedback box cannot be blank. Sorry!' });
    }
  }


  addImageHelper = async (type, pickerChoice) => {
    const pickerResult = (pickerChoice == 'takePhoto') ? await ImagePicker.launchCameraAsync() :
      await ImagePicker.launchImageLibraryAsync({ allowsEditing: false });

    // If user selects an image
    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.uri, type);
    }
  }

  addImage = async (type) => {
    Alert.alert(
      'Upload photo.',
      '',
      [
        {text: 'Take photo...', onPress: () => this.addImageHelper(type, 'takePhoto')},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Choose from library...', onPress: () => this.addImageHelper(type, 'choosePhoto')},
      ],
      { cancelable: false }
    )
  }

  maybeRenderImage = (type) => {
    const { width, height } = Dimensions.get('window')
    let imageURL;
    let sizeConstraint;
    if (!type) {
      imageURL = this.props.feedback.imageURL;
      sizeConstraint = this.state.sizeConstraint;
    }
    else if (type === 'positive') {
      imageURL = this.props.feedback.positiveImageURL;
      sizeConstraint = this.state.positiveSizeConstraint;
    }
    else if (type === 'negative') {
      imageURL = this.props.feedback.negativeImageURL;
      sizeConstraint = this.state.negativeSizeConstraint;
    }

    // If there is no image, don't render anything
    if (!imageURL) {
      return null;
    }

    Image.getSize(imageURL, (iwidth, iheight) => {
      this.setState({imageWidth: iwidth, imageHeight: iheight})
    });
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

  renderImageButton = (type) => {
    const { language } = this.props.user;

    if (this.props.feedback.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    return (
      <View style={{ flexDirection: 'row', backgroundColor:'white' }}>
          <TouchableOpacity
            onPress={() => this.addImage(type)}
            style={[styles.button, {backgroundColor:'white', borderWidth:0, flexDirection:'row', alignItems:'center', padding:14 }]}
          >
            <Text style={{ flex:1, fontSize: 16, fontWeight: '500', textAlign:'left'}}>
              Add Photo
            </Text>
            <Icon name="add-a-photo" size={25} color={'grey'} />
          </TouchableOpacity>
      </View>
    );
  }

  renderSubmitButton = (type) => {
    const { language } = this.props.user;

    if (this.props.feedback.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    return (
      <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.submitFeedback}
            style={[styles.button, {flexDirection:'row', alignItems:'center', marginLeft:8, marginTop:10, marginRight:8}]}
          >
            <Text style={{ color:'white', flex:1, fontSize: 16, fontWeight: '500', textAlign:'center'}}>
              {translate(language).SUBMIT_FEEDBACK}
            </Text>
          </TouchableOpacity>
      </View>

    );
  }

  maybeRenderDeleteButton() {
    if (!this.props.feedback.imageURL) {
      return null;
    }
    return (
      <View>
        <TouchableOpacity onPress={ () => this.props.removeImage() }>
          <Icon name="remove-circle" size={40} color={'red'}/>
        </TouchableOpacity>
      </View>
    )
  }

  maybeRenderCategoryModal() {
    // If the group doesn't have categories
    if (!this.props.group.categories.length) {
      return null;
    }
    const { categories } = this.props.group;
    let index = 0;
    const categoriesForPicker = categories.map((item) => {
      return (
        { key: index++, label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
      );
    });

    categoriesForPicker.unshift({ key: index++, label: 'Choose a category', section: true})
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
          onChange={(category) => this.setState({ category: category.label }) }
        >
          <View style={{ flexDirection: 'row', alignItems:'center', backgroundColor:'white', marginTop: 5, marginBottom:1 }}>
            <Text style={{ flex:1, fontSize: 16, fontWeight: '500', textAlign:'center' }}>
            Add Category
            </Text>
              <TextInput
                style={{
                  borderColor: '#00A2FF',
                  flex:2,
                  height:42,
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
                value={this.state.category || 'Click to choose > '}
              />
          </View>
        </ModalPicker>
      </View>
    );
  }

  render() {
    const { width, height } = Dimensions.get('window')
    const { language } = this.props.user;
    const singleFeedbackBox = (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor:'#f0f0f0' }}>
        <View style={{ flexDirection: 'row'}}>
          <TextInput
            multiline={Boolean(true)}
            onChangeText={feedback => this.setState({ feedback })}
            style={[styles.feedbackInput, { flex: 1 }]}
            placeholder={translate(language).ENTER_FEEDBACK}
            placeholderTextColor="#d0d0d0"
            value={this.state.feedback}
            maxLength={500}
          />
        </View>
        {this.maybeRenderCategoryModal()}
        {this.renderImageButton()}
        {this.renderSubmitButton()}
        {this.maybeRenderDeleteButton()}
        {this.maybeRenderImage()}
      </View>
    );
    const positiveBackgroundColor = (this.state.negativeFeedback === '') ? null : 'grey';
    const negativeBackgroundColor = (this.state.positiveFeedback === '') ? null : 'grey';
    const positivePlacholderText = (this.state.negativeFeedback === '') ? translate(language).POSITIVE_FILL_TEXT : 'Clear negative feedback to submit positive feedback';
    const negativePlacholderText = (this.state.positiveFeedback === '') ? translate(language).NEGATIVE_FILL_TEXT : 'Clear positive feedback to submit negative feedback';

    const positiveFeedbackBox = (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row'}}>
            <TextInput
              multiline={Boolean(true)}
              onChangeText={positiveFeedback => this.setState({ positiveFeedback })}
              style={[styles.feedbackInput, styles.positiveFeedbackInput, { flex: 1, backgroundColor: positiveBackgroundColor }]}
              placeholder={positivePlacholderText}
              placeholderTextColor="#d0d0d0"
              editable={(this.state.negativeFeedback === '')}
              value={this.state.positiveFeedback}
              maxLength={500}
            />
          </View>
          {/* Submit button / loading spinner */}
          {this.maybeRenderCategoryModal()}
          {this.renderImageButton('positive')}
          {this.renderSubmitButton('positive')}
          {this.maybeRenderImage('positive')}
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{ flexDirection: 'row'}}>
            <TextInput
              multiline={Boolean(true)}
              onChangeText={negativeFeedback => this.setState({ negativeFeedback })}
              onContentSizeChange={(event) => {
                this.setState({ height: event.nativeEvent.contentSize.height });
              }}
              style={[styles.feedbackInput, styles.negativeFeedbackInput, { flex: 1, backgroundColor: negativeBackgroundColor }]}
              placeholder={negativePlacholderText}
              editable={(this.state.positiveFeedback === '')}
              placeholderTextColor="#d0d0d0"
              value={this.state.negativeFeedback}
              maxLength={500}
            />
          </View>
          {/* Submit button / loading spinner */}
          {this.maybeRenderCategoryModal()}
          {this.renderImageButton('negative')}
          {this.renderSubmitButton('negative')}
          {this.maybeRenderImage('negative')}
        </View>
      </View>
    );

    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={styles.errorTextStyle}>
            {this.state.errorMessage}
          </Text>
          {this.props.group.includePositiveFeedbackBox ? positiveFeedbackBox : singleFeedbackBox}
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
  submitFeedbackToServer: PropTypes.func,
  navigation: PropTypes.object,
};

function mapStateToProps(state) {
  const { user, group, feedback } = state;
  return { user, group, feedback };
}

export default connect(mapStateToProps, {
  submitFeedbackToServer,
  uploadImage,
  sendGoogleAnalytics,
  removeImage,
})(FeedbackSubmit);

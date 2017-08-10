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
  uploadImage,
  sendGoogleAnalytics,
  removeImage
} from '../actions';

// Import components, functions, and styles
import { Button, Spinner, Text } from '../components/common';
import styles from '../styles/scenes/FeedbackSubmitStyles';

class FeedbackSubmit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: '',
      feedback: this.props.navigation.state.params.feedback ? this.props.navigation.state.params.feedback.text : '',
      positiveFeedback: '',
      negativeFeedback: '',
      hasImage: false,
      imageWidth: null,
      imageHeight: null,
      category: this.props.navigation.state.params.feedback ? this.props.navigation.state.params.feedback.category : '',
      category1: '',
      category2: '',
      newFeedback: { ...this.props.navigation.state.params.feedback },
    };

    props.sendGoogleAnalytics('FeedbackSubmit', props.group.groupName)
  }

  componentWillUpdate(nextProps, nextState) {
    // Only update image dimensions if image changes
    if (nextProps.feedback.imageURL !== this.props.feedback.imageURL && nextProps.feedback.imageURL) {
      Image.getSize(nextProps.feedback.imageURL, (iwidth, iheight) => {
        this.setState(() => ({ imageWidth: iwidth, imageHeight: iheight }));
      });
    }
    if (nextProps.feedback.positiveImageURL !== this.props.feedback.positiveImageURL && nextProps.feedback.positiveImageURL) {
      Image.getSize(nextProps.feedback.positiveImageURL, (iwidth, iheight) => {
        this.setState(() => ({ imageWidth: iwidth, imageHeight: iheight }));
      });
    }
    if (nextProps.feedback.negativeImageURL !== this.props.feedback.negativeImageURL && nextProps.feedback.negativeImageURL) {
      Image.getSize(nextProps.feedback.negativeImageURL, (iwidth, iheight) => {
        this.setState(() => ({ imageWidth: iwidth, imageHeight: iheight }));
      });
    }
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
          this.props.submitFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.positiveFeedback, 'positive feedback', this.props.feedback.positiveImageURL || '', this.state.category1);
          this.setState({ positiveFeedback: '' });
        } if (this.state.negativeFeedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.negativeFeedback, 'negative feedback', this.props.feedback.negativeImageURL || '', this.state.category2);
          this.setState({ negativeFeedback: '' });
        }

        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('Submitted', translate(this.props.user.language).FEEDBACK_RECIEVED);
      }
    } else {
      this.setState({ errorMessage: 'Feedback box cannot be blank. Sorry!' });
    }
  }

  updateFeedback = () => {
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
          this.props.updateFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.feedback, 'single feedback', this.props.feedback.imageURL || '', this.state.category, this.props.navigation.state.params.feedback);
          this.setState({ feedback: '' });
        } if (this.state.positiveFeedback) {
          this.props.updateFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.positiveFeedback, 'positive feedback', this.props.feedback.positiveImageURL || '', this.state.category, this.props.navigation.state.params.feedback);
          this.setState({ positiveFeedback: '' });
        } if (this.state.negativeFeedback) {
          this.props.updateFeedbackToServer(this.props.group.feedbackRequiresApproval, this.state.negativeFeedback, 'negative feedback', this.props.feedback.negativeImageURL || '', this.state.category, this.props.navigation.state.params.feedback);
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
      this.state.hasImage = true;
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
    if (this.props.navigation.state.params.feedback && this.props.navigation.state.params.feedback.imageURL !== '' && !this.state.hasImage) {
      if (!type) {
        this.props.feedback.imageURL = this.props.navigation.state.params.feedback.imageURL;
      }
      else if (type === 'positive') {
        this.props.feedback.positiveImageURL = this.props.navigation.state.params.feedback.imageURL;
      }
      else if (type === 'negative') {
        this.props.feedback.negativeImageURL = this.props.navigation.state.params.feedback.imageURL;
      }
      // Image.getSize(this.props.navigation.state.params.feedback.imageURL, (iwidth, iheight) => {
      //   this.setState(() => ({ imageWidth: iwidth, imageHeight: iheight }));
      // });
      return (
        <Image
          source={{ uri: this.props.navigation.state.params.feedback.imageURL }}
          style={[{
            flex: 1,
            width: this.state.imageWidth,
            height: this.state.imageWidth,
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
    if (!type) {
      imageURL = this.props.feedback.imageURL;
    }
    else if (type === 'positive') {
      imageURL = this.props.feedback.positiveImageURL;
    }
    else if (type === 'negative') {
      imageURL = this.props.feedback.negativeImageURL;
    }

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

    if (this.props.navigation.state.params.feedback) {
      return (
        <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={this.updateFeedback}
              style={[styles.button, {flexDirection:'row', alignItems:'center', marginLeft:8, marginTop:10, marginRight:8}]}
            >
              <Text style={{ color:'white', flex:1, fontSize: 16, fontWeight: '500', textAlign:'center'}}>
                {translate(language).UPDATE_FEEDBACK}
              </Text>
            </TouchableOpacity>
        </View>
      );
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

  maybeRenderDeleteButton(type) {
    if (this.props.feedback.imageURL ||
        this.props.feedback.positiveImageURL && type === 'positive' ||
        this.props.feedback.negativeImageURL && type === 'negative' ||
        (this.props.navigation.state.params.feedback && this.props.navigation.state.params.feedback.imageURL !== '' && !this.state.hasImage)) {
      return (
        <View>
          <TouchableOpacity onPress={ () => {
            this.props.removeImage();
            this.state.hasImage = true;
          }}>
            <Icon name="remove-circle" size={40} color={'red'}/>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  handleCategoryChange(category, type) {
    if (!type) {
      this.setState({ category: category.label })
    } else if (type === 'positive') {
      this.setState({ category1: category.label })
    } else {
      this.setState({ category2: category.label })
    }
  }

  handleValueChange(type) {
    if (!type) {
      return this.state.category || 'Click to choose > ';
    } else if (type === 'positive') {
      return this.state.category1 || 'Click to choose > ';
    } else {
      return this.state.category2 || 'Click to choose > ';
    }
  }

  maybeRenderCategoryModal(type) {
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
          onChange={(category) => this.handleCategoryChange(category, type) }
        >
          <View style={{ flexDirection: 'row', alignItems:'center', backgroundColor:'white', marginTop: 5, marginBottom:1 }}>
            <Text style={{ flex:1, fontSize: 16, fontWeight: '500', textAlign:'center' }}>
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
                value={this.handleValueChange(type)}
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
        {this.maybeRenderCategoryModal('negative')}
        {this.renderImageButton()}
        {this.renderSubmitButton()}
        {this.maybeRenderDeleteButton()}
        {this.maybeRenderImage()}
      </View>
    );
    // console.log(this.state.negativeFeedback, this.props.feedback, 'here' );
    const positiveBackgroundColor = (this.state.negativeFeedback === '' && (this.props.feedback.negativeImageURL === '' || this.props.feedback.negativeImageURL === undefined ) ) ? null : 'grey';
    const negativeBackgroundColor = (this.state.positiveFeedback === '' && ( this.props.feedback.positiveImageURL == '' || this.props.feedback.positiveImageURL === undefined)  ) ? null : 'grey';
    const positivePlacholderText = (this.state.negativeFeedback === '' && (this.props.feedback.negativeImageURL == '' || this.props.feedback.negativeImageURL === undefined)) ? translate(language).POSITIVE_FILL_TEXT : 'Clear negative feedback to submit positive feedback';
    const negativePlacholderText = (this.state.positiveFeedback === '' && (this.props.feedback.positiveImageURL == '' || this.props.feedback.positiveImageURL === undefined) ) ? translate(language).NEGATIVE_FILL_TEXT : 'Clear positive feedback to submit negative feedback';

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
              editable={(this.state.negativeFeedback === '' && (this.props.feedback.negativeImageURL === '' || this.props.feedback.negativeImageURL === undefined ))}
              value={this.state.positiveFeedback}
              maxLength={500}
            />
          </View>
          {/* Submit button / loading spinner */}
          {this.maybeRenderCategoryModal('positive')}
          {this.renderImageButton('positive')}
          {this.renderSubmitButton('positive')}
          {this.maybeRenderDeleteButton('positive')}
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
              editable={(this.state.positiveFeedback === '' && (this.props.feedback.positiveImageURL == '' || this.props.feedback.positiveImageURL === undefined))}
              placeholderTextColor="#d0d0d0"
              value={this.state.negativeFeedback}
              maxLength={500}
            />
          </View>
          {/* Submit button / loading spinner */}
          {this.maybeRenderCategoryModal('negativeCategory')}
          {this.renderImageButton('negative')}
          {this.renderSubmitButton('negative')}
          {this.maybeRenderDeleteButton('negative')}
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
  updateFeedbackToServer: PropTypes.func,
  navigation: PropTypes.object,
};

function mapStateToProps(state) {
  const { user, group, feedback } = state;
  return { user, group, feedback };
}

export default connect(mapStateToProps, {
  submitFeedbackToServer,
  updateFeedbackToServer,
  uploadImage,
  sendGoogleAnalytics,
  removeImage,
})(FeedbackSubmit);

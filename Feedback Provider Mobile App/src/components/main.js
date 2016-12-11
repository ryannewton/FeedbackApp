import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      height: 0,
      text: "Enter your feedback here. We will discuss it with the appropriate department head on Monday and get back to you with their response."
    };
  }

  submitFeedbackToServer(text) {
    console.log("Feedback Submitted: " + text);
    
    let dev = "10.0.2.2";
    let production = "feedbackprototype-env.us-west-2.elasticbeanstalk.com";
    let time = new Date(Date.now());
    console.log(time);
    let timeISO = time.toISOString();
    console.log(timeISO);
    let timeSliced = timeISO.slice(0, 10);
    console.log(timeSliced);
    let current = production;
    console.log('http://' + current + '/addFeedback');
    return fetch('http://' + current + '/addFeedback', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        time: timeSliced
      }),
    })
    .then((response) => console.log(response))
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Thanks for providing feedback!
        </Text>
        <TextInput
          multiline={true}
          onChangeText={(text) => {
            this.setState({text});
          }}
          onFocus={() => {
            if (this.state.text === "Enter your feedback here. We will discuss it with the appropriate department head on Monday and get back to you with their response.") {
              this.setState({text: ""});
            }
          }}
          onContentSizeChange={(event) => {
            this.setState({height: event.nativeEvent.contentSize.height});
          }}
          style={{height: Math.max(200, this.state.height), borderColor: 'gray', borderWidth: 1}}
          value={this.state.text}
        />
        <Button
          onPress={() => {
            this.submitFeedbackToServer(this.state.text);
            this.setState({text: "Feedback Submitted!"});
          }}
          title="Submit Feedback"
          color="#841584"
        />
      </View>
    );
  }
}

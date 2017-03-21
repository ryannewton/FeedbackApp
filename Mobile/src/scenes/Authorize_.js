// Import Libraries 
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Header } from '../components/common';
import { authorizeUser } from '../actions';
import styles from '../styles/styles_main';

class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = { code: '' };
  }

  onButtonPress() {
    this.props.authorizeUser(this.props.email, this.state.code);
  }

  renderSignupButton() {
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Verify Email
      </Button>
    );
  }

  renderButtons() {
    if (this.props.loading) {
      return <Spinner />;
    }

    return (
      <View style={{ flex: 1 }}>
        {this.renderSignupButton()}
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Header>
            Enter Code From Email
          </Header>


          <Card>
            {/* Email input */}
            <CardSection>
              <Input
                label="Code: "
                placeholder="Enter code here"
                value={this.state.code}
                onChangeText={text => this.setState({ code: text })}
              />
            </CardSection>

            {/* Error message (blank if no error) */}
            <Text style={styles.errorTextStyle}>
              {this.props.error}
            </Text>

            {/* Confirmation button, and 'go to login' button */}
            <CardSection>
              {this.renderButtons()}
            </CardSection>

            <CardSection>
              <Text style={styles.text}>
                  We sent you an email with a 4 digit code.{'\n'}
                  Please enter it here to verify your email address{'\n'}
              </Text>
            </CardSection>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Authorize.propTypes = {
  error: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  email: React.PropTypes.string,
  authorizeUser: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  const { email, error, loading } = state.auth;
  return { email, error, loading };
};

export default connect(mapStateToProps, { authorizeUser })(Authorize);

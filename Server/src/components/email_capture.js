//import libraries
import React from 'react';

export default class Email_Capture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    }

    this.emailChanged = this.emailChanged.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
  }

  emailChanged(event) {
    this.setState({email: event.target.value});
  }

  updateEmail(event) {
    this.props.updateEmail(this.state.email);
  }

  render() {
    return (
      <div>
        <div>Enter your email below so we can keep you updated on your project's progress</div>
        <input type="text" value={this.state.email} onChange={this.emailChanged} placeholder="Email here" />
        <button onClick={this.updateEmail}>Enter Site</button>
      </div>
    );
  }
}
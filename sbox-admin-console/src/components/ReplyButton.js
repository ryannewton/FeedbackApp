// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Glyphicon, Button, Overlay, Popover, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { submitOfficialReply } from '../actions';


class ReplyButton extends Component {

  state = {
    response: this.props.feedback.officialReply,
    show: false,
  }

  buttonClicked = () => {
    this.props.updateButtonActive(!this.state.show);
    this.setState({ show: !this.state.show });
  }

  submitOfficialReply = () => {
    this.props.submitOfficialReply(this.props.feedback, this.state.response);
  }

  render = () => {
    const placement = (this.props.feedback.status === 'complete') ? "left" : "bottom";
    const marginLeft = (this.props.feedback.status === 'complete') ? 30 : 40;
    
    const sortPopover = (
      <Popover
        id={'reply-' + this.props.feedback.id}
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          width:350,
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          marginLeft: marginLeft,
          marginTop: 0,
          padding: 10,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Add an official response:</ControlLabel>
          <FormControl componentClass="textarea" value={this.state.response} onChange={(event) => this.setState({response: event.target.value})} placeholder="Add official response" />
        </FormGroup>
        <Button onClick={this.submitOfficialReply}>Send</Button>
      </Popover>
    );

    return (
      <span style={{ position: 'relative'}}>
        <Button ref="target" style={{ zIndex:100, position: 'absolute', marginLeft:40}} onClick={this.buttonClicked}><Glyphicon glyph='share' /></Button>
        <Overlay
          rootClose
          show={this.state.show}
          onHide={() => {
            this.props.updateButtonActive(false);
            this.setState({ show: false });
          }}
          placement={placement}
          container={this}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
        >
          {sortPopover}
        </Overlay>
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { submitOfficialReply })(ReplyButton);

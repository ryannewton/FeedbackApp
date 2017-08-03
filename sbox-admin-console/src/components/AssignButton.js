// Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
  Glyphicon,
  Button,
  Overlay,
  Popover,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import { routeFeedback } from '../actions';

class AssignButton extends Component {
  state = {
    show: false,
    routingNote: '',
    email: '',
  }

  sortClicked = (sortMethod) => {
    this.props.updateSortMethod(sortMethod);
    this.setState({ show: !this.state.show });
  }

  buttonClicked = () => {
    this.props.updateButtonActive(!this.state.show);
    this.setState({ show: !this.state.show });
  }

  sendFeedback = () => {
    const successText = 'Email Sent';
    this.props.showSuccess(false, successText);
    this.props.routeFeedback(this.props.feedback, this.state.email, this.state.routingNote);
  }

  render = () => {
    const placement = (this.props.feedback.status === 'complete') ? "left" : "bottom";
    const marginLeft = (this.props.feedback.status === 'complete') ? -10 : 10;

    const sortPopover = (
      <Popover
        id={'assign-' + this.props.feedback.id}
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          width:350,
          marginLeft: marginLeft,
          marginTop: 5,
          padding: 10,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <div style={{ color: 'black' }}>Route this feedback to:</div>
        <FormControl
            type="text"
            value={this.state.email}
            placeholder="Enter email here"
            onChange={(event) => this.setState({email: event.target.value})}
          />
          <br />
          <ControlLabel>Add a note:</ControlLabel>
          <FormControl
            componentClass="textarea"
            style={{height:100}}
            value={this.state.routingNote}
            onChange={(event) => this.setState({routingNote: event.target.value})}
            placeholder={'Enter note here...'}
          />
          <br />
        <Button onClick={this.sendFeedback}>Send</Button>
      </Popover>
    );

    return (
      <span style={{ position: 'relative'}}>
        <Button className="btn-xs btn-success" style={{ zIndex:100, position: 'absolute'}} ref="target" onClick={this.buttonClicked}><Glyphicon glyph='send' /></Button>
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

export default connect(mapStateToProps, { routeFeedback })(AssignButton);

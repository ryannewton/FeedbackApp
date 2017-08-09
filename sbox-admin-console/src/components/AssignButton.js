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
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { routeFeedback } from '../actions';

class AssignButton extends Component {
  state = {
    show: false,
    routingNote: '',
    email: '',
    error: '',
  }

  sortClicked = (sortMethod) => {
    this.props.updateSortMethod(sortMethod);
    this.setState({ show: !this.state.show });
  }

  buttonClicked = () => {
    this.props.updateButtonActive(!this.state.show);
    this.setState({ show: !this.state.show });
  }

  routeFeedback() {
    if (!this.state.email) {
      this.setState({ error: 'Please enter in an email!'});
    } else if (!this.state.routingNote) {
      this.setState({ error: 'Please enter in a routing note.'});
    } else {
      this.setState({ error: ''});
      this.props.showSuccess(false, 'Feedback routed!');
      this.props.routeFeedback(this.props.feedback, this.state.email, this.state.routingNote);
    }
  }

  maybeRenderErrorMessage() {
    const { error } = this.state;
    if (error !== '') {
      return (
        <center>
          <div style={{ color: 'red' }}>
            {error}
          </div>
        </center>
      );
    }
    return null;
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
          width: 350,
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
            onChange={(event) => this.setState({ routingNote: event.target.value })}
            placeholder={'Enter note here...'}
          />
          <br />
          {this.maybeRenderErrorMessage()}
        <Button onClick={() => this.routeFeedback()}>Send</Button>
      </Popover>
    );
    const tooltip = (
      <Tooltip id="tooltip"><strong>Share</strong></Tooltip>
    );
    return (
      <span style={{ position: 'relative'}}>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <Button className="btn-xs btn-success" style={{ zIndex:100, position: 'absolute'}} ref="target" onClick={this.buttonClicked}><Glyphicon glyph='send' /></Button>
        </OverlayTrigger>
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

// Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Glyphicon, Button, Overlay, Popover } from 'react-bootstrap';

class AssignButton extends Component {
  state = {
    show: false,
  }

  sortClicked = (sortMethod) => {
    this.props.updateSortMethod(sortMethod);
    this.setState({ show: !this.state.show });
  }

  buttonClicked = () => {
    this.props.updateButtonActive(!this.state.show);
    this.setState({ show: !this.state.show });
  }

  render = () => {
    const placement = (this.props.feedback.status === 'complete') ? "left" : "bottom";
    const marginLeft = (this.props.feedback.status === 'complete') ? -50 : 10;

    const sortPopover = (
      <Popover
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          marginLeft: marginLeft,
          marginTop: 5,
          padding: 10,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <div style={{ color: 'black' }}>Route this feedback to:</div>
        <input value={this.state.email} onChange={(event) => this.setState({email: event.target.value})} placeholder="Enter email here" />
        <button>Send</button>
      </Popover>
    );

    return (
      <span style={{ position: 'relative'}}>
        <Button style={{ zIndex:100, position: 'absolute'}} ref="target" onClick={this.buttonClicked}><Glyphicon glyph='send' /></Button>
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

export default AssignButton;

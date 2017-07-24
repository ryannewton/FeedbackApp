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
          marginTop: 0,
          padding: 10,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <div style={{ color: 'black' }}>[REJECT FROM OLD ADMIN GOES HERE]</div>
        <button onClick={this.buttonClicked}>Reject</button>
      </Popover>
    );

    return (
      <div style={{ position: 'relative'}}>
        <Button className="btn btn-danger" ref="target" style={{ position: 'absolute', right:0}} onClick={this.buttonClicked}>Reject</Button>
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
      </div>
    );
  }
}

export default AssignButton;

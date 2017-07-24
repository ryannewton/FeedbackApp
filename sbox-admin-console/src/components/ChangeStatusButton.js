// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Glyphicon, Button, Overlay, Popover } from 'react-bootstrap';
import { updateFeedback } from '../actions';

class ChangeStatusButton extends Component {
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

  updateStatus = (newStatus) => {
    const updatedFeedback = { ...this.props.feedback, status: newStatus };
    this.props.updateFeedback(updatedFeedback);
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
        <div style={{ color: 'black' }}>Change status to:</div>
        <ul>
          <li onClick={() => this.updateStatus('new')}>New</li>
          <li onClick={() => this.updateStatus('inprocess')}>In Process</li>
          <li onClick={() => this.updateStatus('complete')}>Complete</li>
        </ul>
      </Popover>
    );

    return (
      <span style={{ position: 'relative'}}>
        <Button ref="target" onClick={this.buttonClicked}>Change Status</Button>
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

export default connect(mapStateToProps, { updateFeedback })(ChangeStatusButton);

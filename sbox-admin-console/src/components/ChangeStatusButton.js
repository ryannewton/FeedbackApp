// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Button, Overlay, Popover, MenuItem } from 'react-bootstrap';
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
    const marginLeft = (this.props.feedback.status === 'complete') ? 0 : 0;
    
    const sortPopover = (
      <Popover
        id={'status-' + this.props.feedback.id}
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
        <MenuItem header style={{ padding: 0 }}>Change status to:</MenuItem>
        <MenuItem onClick={() => this.updateStatus('new')}>New</MenuItem>
        <MenuItem onClick={() => this.updateStatus('queue')}>Queue</MenuItem>
        <MenuItem onClick={() => this.updateStatus('inprocess')}>In Process</MenuItem>
        <MenuItem onClick={() => this.updateStatus('complete')}>Complete</MenuItem>
      </Popover>
    );

    return (
      <div style={{ position: 'relative'}}>
        <Button className="btn btn-primary" ref="target" style={{ position: 'absolute', right:0}} onClick={this.buttonClicked}>Change Status</Button>
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

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { updateFeedback })(ChangeStatusButton);

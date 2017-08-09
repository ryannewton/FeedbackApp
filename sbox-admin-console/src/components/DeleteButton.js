// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { updateFeedback } from '../actions';

class DeleteButton extends Component {
  state = {
    show: false,
    smShow: false,
  }

  updateStatus = () => {
    const updatedFeedback = { ...this.props.feedback, status: 'deleted' };
    this.props.updateFeedback(updatedFeedback);
  }

  MySmallModal = () => {
    let smClose = () => this.setState({ smShow: false });
    return (
      <Modal {...this.props} className="static-modal" show={this.state.smShow} bsSize="small">
        <Modal.Body>
          <p>You are about to delete this piece of feedback. It will not show up within the admin console or the mobile app any more.</p>
          <Button
            className="btn btn-primary"
              onClick={this.updateStatus}
              style={{marginRight:10}}
            >
              Delete
            </Button>
          <Button onClick={() => {
            smClose();
            this.props.onModalButtonClick();
          }}>
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
    );
  }

  render = () => {
    const tooltip = (
      <Tooltip id="tooltip"><strong>Delete</strong></Tooltip>
    );
    return (
      <div style={{ position: 'relative'}}>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <Button
            className="btn btn-xs btn-danger"
            ref="target" style={{ position: 'absolute', right:0, color:'white'}}
            onClick={()=>this.setState({ smShow: true })}>
              <Glyphicon glyph='trash' />
          </Button>
        </OverlayTrigger>
        {this.MySmallModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { updateFeedback })(DeleteButton);

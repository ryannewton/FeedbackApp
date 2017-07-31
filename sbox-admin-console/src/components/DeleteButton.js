// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
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
    return (
      <div style={{ position: 'relative'}}>
        <Button className="btn btn-sm" ref="target" style={{ position: 'absolute', right:-22, top:-20, backgroundColor:'rgba(0,0,0,0)', borderColor:'rgba(0,0,0,0)', color:'white'}} onClick={()=>this.setState({ smShow: true })}>✕</Button>
        {this.MySmallModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { updateFeedback })(DeleteButton);

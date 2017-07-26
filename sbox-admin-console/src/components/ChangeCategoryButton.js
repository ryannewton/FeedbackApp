// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Glyphicon, Button, Overlay, Popover, MenuItem } from 'react-bootstrap';
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

  updateCategory = (newCategory) => {
    this.props.updateButtonActive(!this.state.show);
    this.setState({ show: !this.state.show });
    const updatedFeedback = { ...this.props.feedback, category: newCategory };
    this.props.updateFeedback(updatedFeedback);
  }

  render = () => {
    const placement = (this.props.feedback.status === 'complete') ? "left" : "bottom";
    const marginLeft = (this.props.feedback.status === 'complete') ? 0 : 0;

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
        <MenuItem header style={{ padding: 0 }}>Change category to:</MenuItem>
        {this.props.categories.categories.map((item) => {
          return <MenuItem onClick={() => this.updateCategory(item)}> {item} </MenuItem>
          }
        )}
      </Popover>
    );

    return (
      <div style={{ position: 'relative'}}>
        <Button className="btn btn-primary" ref="target" style={{ position: 'absolute', right:0}} onClick={this.buttonClicked}>Change Category</Button>
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
  const { categories } = state;
  return { categories };
};

export default connect(mapStateToProps, { updateFeedback })(ChangeStatusButton);

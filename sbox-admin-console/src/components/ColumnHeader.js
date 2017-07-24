// Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Glyphicon, Overlay, Popover } from 'react-bootstrap';

class ColumnHeader extends Component {
  state = {
    show: false,
  }

  sortClicked = (sortMethod) => {
    this.props.updateSortMethod(sortMethod);
    this.setState({ show: !this.state.show });
  }

  render = () => {
    const sortPopover = (
      <Popover
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          marginLeft: 30,
          marginTop: 10,
          padding: 10,
          width: 150,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <div style={{ color: 'black' }}>Sort By:</div>
        <div style={{ color: 'black' }} onClick={() => this.sortClicked('most votes')}>Most Votes</div>
        <div style={{ color: 'black' }} onClick={() => this.sortClicked('most recent')}>Most Recent</div>
        <div style={{ color: 'black' }} onClick={() => this.sortClicked('oldest')}>Oldest</div>
      </Popover>
    );

    const sortIcon = (
      <span className="pull-right">
        <Glyphicon ref="target" glyph='sort' style={{ right: 10, top: 4 }} onClick={() => this.setState({ show: !this.state.show })}/>

        <Overlay
          rootClose
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="right"
          arrowOffsetLeft="5"
          arrowOffsetTop="5"
          container={this}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
        >
        {sortPopover}
        </Overlay>
      </span>
    );

    return (
      <div className="panel panel-default" style={{ backgroundColor: this.props.backgroundColor, color: 'white', textAlign: 'center', paddingTop: 10, paddingBottom: 10, marginBottom: 5, marginTop: 12 }}>
        {this.props.title}{sortIcon}
      </div>
    );
  }
}

export default ColumnHeader;

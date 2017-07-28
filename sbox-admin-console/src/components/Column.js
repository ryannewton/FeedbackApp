// Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Glyphicon, Overlay, Popover, MenuItem } from 'react-bootstrap';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const chessSquareTarget = {
  drop(props, monitor, component) {
    return { filterMethod: component.props.filterMethod };
  }
}

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}
class Column extends Component {
  state = {
    show: false,
  }

  sortClicked = (sortMethod) => {
    this.props.updateSortMethod(sortMethod);
    this.setState({ show: !this.state.show });
  }

  render = () => {
    const { connectDropTarget, isOver } = this.props;
    // console.log(isOver);
    const sortPopover = (
      <Popover
        id={'column-' + this.props.title}
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          marginLeft: 10,
          marginTop: 28,
          padding: 0,
          width: 150,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <MenuItem header style={{ padding: 0 }}>Sort By...</MenuItem>
        <MenuItem onClick={() => this.sortClicked('most votes')}>Most Votes</MenuItem>
        <MenuItem onClick={() => this.sortClicked('most recent')}>Most Recent</MenuItem>
        <MenuItem onClick={() => this.sortClicked('oldest')}>Oldest</MenuItem>
      </Popover>
    );

    const sortIcon = (
      <span className="pull-right">
        <Glyphicon ref="target" glyph='sort' style={{ right: 10, top: 4 }} onClick={() => this.setState({ show: !this.state.show })}/>

        <Overlay
          rootClose
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="bottom"
          arrowOffsetLeft="5"
          arrowOffsetTop="5"
          container={this}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
        >
        {sortPopover}
        </Overlay>
      </span>
    );
    const color = isOver ? 'rgba(255,255,255,0.1)' : '#eee';
    return connectDropTarget(
      <div className={this.props.gridClass} style={{ backgroundColor: color}}>
        <div className="panel panel-default" style={{ backgroundColor: this.props.backgroundColor, borderWidth:0, color: 'white', textAlign: 'center', paddingTop: 5, paddingBottom: 5, marginBottom: 15, marginTop: 12 }}>
          {this.props.title}{sortIcon}
        </div>
        {(this.props.feedback.length) ? this.props.feedback : <div style={{height: 300, width: 300}} /> }
      </div>
    );
  }
}

export default DropTarget(ItemTypes.BOX, chessSquareTarget, collect)(Column);

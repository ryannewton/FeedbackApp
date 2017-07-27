import React, { Component } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import TimeAgo from 'react-timeago'

class CommentCard extends Component {

  renderVotesAndTime = () => {
    return (
      <div className="row" style={{marginLeft:6, marginRight:6}}>
        <div className="pull-left" style={{fontSize:10, color:'#555'}}>
          <Glyphicon glyph='triangle-top' /><span style={{margin:5}}>{this.props.solution.upvotes}</span><Glyphicon glyph='triangle-bottom' /><span style={{margin:5}}>{this.props.solution.downvotes}</span>
        </div>
        <div className="pull-right" style={{fontSize:10, color:'#555'}}>
          <TimeAgo date={this.props.solution.date} />
        </div>
      </div>
    );
  }

  renderText = () => {
    return (
      <div className="row" style={{marginLeft:6, fontSize:12, marginRight:6}}>{this.props.solution.text}</div>
    );
  }

  render() {
    console.log(this.props.solution);
    return (
      <Panel>
        {this.renderVotesAndTime()}
        {this.renderText()}
      </Panel>
    );
  }
}

export default CommentCard;

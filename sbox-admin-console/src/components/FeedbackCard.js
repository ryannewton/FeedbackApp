import React, { Component } from 'react';
import logo from '../img/wb_logo.png';
import avatar from '../img/avatar.jpg';
import { ButtonGroup, DropdownButton, MenuItem, InputGroup, Panel, Button, Glyphicon, Image } from 'react-bootstrap';

class FeedbackCard extends Component {
  render() {
    return (
      <Panel>
        <Image src={logo} width={200} rounded />
        <div className="row">
          <div className="pull-left">
            <Glyphicon glyph='triangle-top' /><span>21</span><Glyphicon glyph='triangle-bottom' /><span>8</span>
          </div>
          <div className="pull-right">
            5 min ago
          </div>
        </div>
        <div className="row">
          Salad bar items could be improved, for example look at sweet greens menu in downtown PA or Dig Inn in NYC and add those types of food.
        </div>
        <div className="row">
          <div className="pull-left"># Dining # Stanford</div>
          <div className="pull-right"><Glyphicon glyph='option-horizontal' /></div>
        </div>
      </Panel>
    );
  }
}

export default FeedbackCard;

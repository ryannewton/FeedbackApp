// Import Libraries
import React, { Component } from 'react';

import { ButtonGroup, DropdownButton, MenuItem, InputGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

// Import imgs, css, components, and actions
import logo from '../img/wb_logo.png';
import avatar from '../img/avatar.jpg';
import FeedbackCard from '../components/FeedbackCard';
import RequireAuth from '../components/RequireAuth';
import ColumnHeader from '../components/ColumnHeader';
import { signoutUser } from '../actions';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Column from '../components/Column';

class App extends Component {
  state = {
    // Filters
    timeFilter: 'All',
    typeFilter: 'All',
    locationFilter: 'All',
    searchTerm: '',

    // Sorting
    approvalSort: 'most votes',
    openSort: 'most votes',
    inProcessSort: 'most votes',
    completeSort: 'most votes',
  }

  render = () => {
    return (
        <div className="container-fluid" style={{ overflow: 'hidden', clear: 'both' }}>
          {this.renderHeader()}
          {this.renderFilterBar()}
          {this.renderStatusColumns()}
        </div>
    );
  }

  renderHeader = () => {
    return (
      <div className="row">
        <img src={logo} height={60} className="pull-left" alt='' />
        <div className="pull-right">
          <Button style={{ border: 'none' }} onClick={() => this.props.signoutUser()}>
            <img src={avatar} height={40} alt='' />
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>Log Out</span>
          </Button>
        </div>
      </div>
    );
  }

  renderFilterBar = () => {
    return (
      <div className="row" style={{ paddingBottom: 3, padding: '0.5 0 0.17 0', color: '#000', boxShadow: '0 2px 2px 0px #D3D3D3' }}>
        <div className="col-md-8">
          <ButtonGroup>
            <DropdownButton id='main-filter-time' title={'Time: ' + this.state.timeFilter} style={{ border: 'none' }}>
              <MenuItem onClick={() => this.setState({ timeFilter: 'Last 7 Days' })}>Last 7 Days</MenuItem>
              <MenuItem onClick={() => this.setState({ timeFilter: 'Last 30 Days' })}>Last 30 Days</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.setState({ timeFilter: 'All' })}>Clear Filter</MenuItem>
            </DropdownButton>
            <DropdownButton id='main-filter-type' title={'Type: ' + this.state.typeFilter} style={{ border: 'none' }}>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Store Operations' })}>Store Operations</MenuItem>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Merchandising' })}>Merchandising</MenuItem>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Planning' })}>Planning & Allocation</MenuItem>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Marketing' })}>Marketing</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.setState({ typeFilter: 'All' })}>Clear Filter</MenuItem>
            </DropdownButton>
            <DropdownButton id='main-fitler-location' title={'Location: ' + this.state.locationFilter} style={{ border: 'none' }}>
              <MenuItem onClick={() => this.setState({ locationFilter: 'District A' })}>District A</MenuItem>
              <MenuItem onClick={() => this.setState({ locationFilter: 'Distict B' })}>District B</MenuItem>
              <MenuItem onClick={() => this.setState({ locationFilter: 'District C' })}>District C</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.setState({ locationFilter: 'All' })}>Clear Filter</MenuItem>
            </DropdownButton>
          </ButtonGroup>
        </div>
        <div className="col-md-4 pull-right">
          <InputGroup>
            <InputGroup.Addon style={{ backgroundColor: 'white' }}><Glyphicon glyph='search' style={{ color: 'grey' }} /></InputGroup.Addon>
            <input type="text" className="form-control" placeholder="Search feedback" value={this.state.searchTerm} onChange={(event) => this.setState({ searchTerm: event.target.value })} />
          </InputGroup>
        </div>
      </div>
    );
  }

  renderStatusColumns = () => {
    const filteredFeedback = this.props.feedback.list.filter(this.filterFeedback);

    const awaitingApprovalFeedback = filteredFeedback.filter(feedback => !feedback.approved).sort((a, b) => this.sortFeedback(a, b, this.state.approvalSort));
    const openFeedback = filteredFeedback.filter(feedback => feedback.status === 'new').sort((a, b) => this.sortFeedback(a, b, this.state.openSort));
    const inProcessFeedback = filteredFeedback.filter(feedback => feedback.status === 'inprocess').sort((a, b) => this.sortFeedback(a, b, this.state.inProcessSort));
    const completeFeedback = filteredFeedback.filter(feedback => feedback.status === 'complete').sort((a, b) => this.sortFeedback(a, b, this.state.completeSort));

    return (
      <div className="row">
        <Column
          title={'Awaiting Approval (' + awaitingApprovalFeedback.length + ')'}
          backgroundColor={'rgb(216,62,83)'}
          updateSortMethod={(sortMethod) => this.setState({ approvalSort: sortMethod })}
          feedback={awaitingApprovalFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'awaitingApproval'}
         />
        <Column
          title={'Open (' + openFeedback.length + ')'}
          backgroundColor={'rgb(0,162,255)'}
          updateSortMethod={(sortMethod) => this.setState({ openSort: sortMethod })}
          feedback={openFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'new'}
        />
        <Column
          title={'In Process (' + inProcessFeedback.length + ')'}
          backgroundColor={'rgb(245,166,35)'}
          updateSortMethod={(sortMethod) => this.setState({ inProcessSort: sortMethod })}
          feedback={inProcessFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'inprocess'}
        />
        <Column
          title={'Complete (' + completeFeedback.length + ')'}
          backgroundColor={'rgb(126,211,33)'}
          updateSortMethod={(sortMethod) => this.setState({ completeSort: sortMethod })}
          feedback={completeFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'completed'}
        />
      </div>
    );
  }
  sortFeedback = (a, b, method) => {
    if (method === 'most votes') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (method === 'most recent') return new Date(b.date) - new Date(a.date);
    if (method === 'oldest') return new Date(a.date) - new Date(b.date);
  }

  filterFeedback = (feedback) => {
    if (this.state.timeFilter !== 'All') {
      const feedbackDate = new Date(feedback.date);
      const daysAgo = (Date.now() - feedbackDate.getTime())/1000/60/60/24;
      if (this.state.timeFilter === 'Last 7 Days' && daysAgo > 7)
        return false;
      if (this.state.timeFilter === 'Last 30 Days' && daysAgo > 30)
        return false;
    }
    if (this.state.typeFilter !== 'All' && this.state.typeFilter !== feedback.type) {
      return false;
    }
    // It is not about where the submission came from - it is about where the votes came from
    if (this.state.locationFilter !== 'All' && this.state.locationFilter !== feedback.location) {
      return false;
    }
    //Then Filter by Search
    if (this.state.searchTerm !== '' && !feedback.text.includes(this.state.searchTerm)) {
      return false;
    }
    return true;
  }
}

const mapStateToProps = (state) => {
  const { feedback, solutions, group } = state;
  return { feedback, solutions, group };
};

export default connect(mapStateToProps, { signoutUser })(RequireAuth(DragDropContext(HTML5Backend)(App)));

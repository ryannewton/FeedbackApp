// Import Libraries
import React, { Component } from 'react';
import { saveAs } from 'file-saver';
import json2csv from 'json2csv';
import { ButtonGroup, DropdownButton, MenuItem, InputGroup, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

// Import imgs, css, components, and actions
import logo from '../img/wb_logo.png';
import avatar from '../img/avatar.png';
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
    newSort: 'most votes',
    queueSort: 'most votes',
    inProcessSort: 'most votes',
    completeSort: 'most votes',
  }

  render = () => {
    return (
        <div className="container-fluid" style={{ background:'#002A43', overflow: 'hidden', clear: 'both' }}>
          {this.renderHeader()}
          {this.renderFilterBar()}
          {this.renderStatusColumns()}
        </div>
    );
  }

  renderHeader = () => {
    return (
      <div className="row">
        <img src={logo} height={60} className="pull-left" style={{marginTop:10, marginLeft:10}} alt='' />
        <div className="pull-right">
          <Button style={{ border: 'none', backgroundColor:'rgba(0,0,0,0)' }} onClick={() => this.props.signoutUser()}>
            <img src={avatar} height={40} alt='' />
            <span style={{ color:'white', paddingLeft: 10, paddingRight: 10 }}>Log Out</span>
          </Button>
        </div>
      </div>
    );
  }

  rankFeedback = (feedback, method) => {
    const sortedFeedback = feedback.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - b.downvotes));
    if (method === 'Overall') {
      return sortedFeedback.map((item, index) => {
        return { ...item, rank: index+1 };
      });
    } else if (method === 'Department') {
      let deptIndexes = sortedFeedback.reduce((agg, value) => {
        if (agg.some(elem => elem.category === value.category)) return agg;
        else return [...agg, { category: value.category, index: 0 }];
      }, []);
      return sortedFeedback.map((item, index) => {
        let currentIndex = 0;
        deptIndexes.forEach((elem, index) => {
          console.log('elem', elem);
          if (elem.category === item.category) {
            currentIndex = elem.index + 1;
            deptIndexes[index].index = elem.index + 1;
          } 
        });
        return { ...item, rank: currentIndex }
      });
    }
  }

  exportData = (type) => {
    const filteredFeedback = this.props.feedback.list.filter(this.filterFeedback);
    let rankedFeedback;
    if (type === "Top 2 By Department") {
      rankedFeedback = this.rankFeedback(filteredFeedback, 'Department');
      rankedFeedback = rankedFeedback.filter(item => item.rank <= 2).sort((a, b) => a.category > b.category);
    } else {
      rankedFeedback = this.rankFeedback(filteredFeedback, 'Overall');
    }

    const fields = ['Department', 'Rank', 'Agrees', 'Disagrees', 'Text', 'Date'];
    const data = rankedFeedback.map(item => {
      const date = new Date(item.date);
      return { Department: item.category, Rank: item.rank, Agrees: item.upvotes, Disagrees: item.downvotes, Text: item.text, Date: date.toDateString() };
    });

    const date = new Date();
    let fileName = 'Customer Feedback - ' + this.state.typeFilter + ' - ' + date.getMonth() + '.' + date.getDate() + '.' + date.getFullYear() + '.csv';

    json2csv({ data, fields }, (err, csv) => {
      console.log(csv);
      const file = new File([csv], fileName, {
        type: 'text/csv',
      });
      saveAs(file);
    });
  }

  renderFilterBar = () => {
    return (
      <div className="row" style={{ paddingBottom: 3, padding: '0.5 0 0.17 3', color: '#000', boxShadow: '0 2px 2px 0px #D3D3D3' }}>
        <div className="col-md-8" style={{marginTop:10}}>
          <ButtonGroup>
            <DropdownButton bsStyle="primary" id='main-filter-time' title={'Time: ' + this.state.timeFilter} style={{ border: 'none', backgroundColor:'rgba(0,0,0,0)' }}>
              <MenuItem onClick={() => this.setState({ timeFilter: 'Last 7 Days' })}>Last 7 Days</MenuItem>
              <MenuItem onClick={() => this.setState({ timeFilter: 'Last 30 Days' })}>Last 30 Days</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.setState({ timeFilter: 'All' })}>Clear Filter</MenuItem>
            </DropdownButton>
            <DropdownButton bsStyle="primary" id='main-filter-type' title={'Type: ' + this.state.typeFilter} style={{ border: 'none', backgroundColor:'rgba(0,0,0,0)' }}>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Store Operations' })}>Store Operations</MenuItem>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Merchandising' })}>Merchandising</MenuItem>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Planning' })}>Planning & Allocation</MenuItem>
              <MenuItem onClick={() => this.setState({ typeFilter: 'Marketing' })}>Marketing</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.setState({ typeFilter: 'All' })}>Clear Filter</MenuItem>
            </DropdownButton>
            <DropdownButton bsStyle="primary" id='main-fitler-location' title={'Location: ' + this.state.locationFilter} style={{ border: 'none', backgroundColor:'rgba(0,0,0,0)' }}>
              <MenuItem onClick={() => this.setState({ locationFilter: 'Central' })}>Central</MenuItem>
              <MenuItem onClick={() => this.setState({ locationFilter: 'Northeast' })}>Northeast</MenuItem>
              <MenuItem onClick={() => this.setState({ locationFilter: 'Southeast' })}>Southeast</MenuItem>
              <MenuItem onClick={() => this.setState({ locationFilter: 'West' })}>West</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.setState({ locationFilter: 'All' })}>Clear Filter</MenuItem>
            </DropdownButton>
            <DropdownButton bsStyle="primary" id='main-fitler-export' title={'Export'} style={{ border: 'none', backgroundColor:'rgba(0,0,0,0)' }}>
              <MenuItem onClick={() => this.exportData('What Is Showing')}>Export What Is Showing</MenuItem>
              <MenuItem onClick={() => this.exportData('Top 2 By Department')}>Export Top 2 By Department</MenuItem>
            </DropdownButton>
          </ButtonGroup>
        </div>
        <div className="col-md-4 pull-right" style={{marginBottom:10}}>
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
    const awaitingApprovalSolution = this.props.solutions.list.filter((item) => (!item.approved && item.status !== 'rejected'));
    const awaitingApproval = [ ...awaitingApprovalFeedback, ...awaitingApprovalSolution];
    const newFeedback = filteredFeedback.filter(feedback => (feedback.status === 'new' && feedback.approved)).sort((a, b) => this.sortFeedback(a, b, this.state.newSort));
    const queueFeedback = filteredFeedback.filter(feedback => (feedback.status === 'queue' && feedback.approved)).sort((a, b) => this.sortFeedback(a, b, this.state.queueSort));
    const inProcessFeedback = filteredFeedback.filter(feedback => (feedback.status === 'inprocess' && feedback.approved)).sort((a, b) => this.sortFeedback(a, b, this.state.inProcessSort));
    const completeFeedback = filteredFeedback.filter(feedback => (feedback.status === 'complete' && feedback.approved)).sort((a, b) => this.sortFeedback(a, b, this.state.completeSort));

    let className;
    if (this.props.group.includePositiveFeedbackBox) {
      className = 'col-md-12';
    } else {
      className = awaitingApproval.length ? 'col-md-5ths' : 'col-md-3';
    }

    const approvalColumn = awaitingApproval.length ?
      (<Column
        title={'Awaiting Approval (' + awaitingApproval.length + ')'}
        gridClass={className}
        backgroundColor={'#cb333f'}
        updateSortMethod={(sortMethod) => this.setState({ approvalSort: sortMethod })}
        feedback={awaitingApproval.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
        filterMethod={'awaitingApproval'}
       />) : null;

    const actionColumns = (
      <div className="row">
        {approvalColumn}
        <Column
          title={'New (' + newFeedback.length + ')'}
          gridClass={className}
          backgroundColor={'#00a0b0'}
          updateSortMethod={(sortMethod) => this.setState({ newSort: sortMethod })}
          feedback={newFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'new'}
        />
        <Column
          title={'Queue (' + queueFeedback.length + ')'}
          gridClass={className}
          backgroundColor={'#edc951'}
          updateSortMethod={(sortMethod) => this.setState({ queueSort: sortMethod })}
          feedback={queueFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'queue'}
        />
        <Column
          title={'Working On It (' + inProcessFeedback.length + ')'}
          gridClass={className}
          backgroundColor={'#ec6841'}
          updateSortMethod={(sortMethod) => this.setState({ inProcessSort: sortMethod })}
          feedback={inProcessFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'inprocess'}
        />
        <Column
          title={'Complete (' + completeFeedback.length + ')'}
          gridClass={className}
          backgroundColor={'#6a4a3d'}
          updateSortMethod={(sortMethod) => this.setState({ completeSort: sortMethod })}
          feedback={completeFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'complete'}
        />
      </div>
    );

    const retailColumns = (
      <div className="row">
        {approvalColumn}
        <Column
          title={'Customer Feedback (' + newFeedback.length + ')'}
          gridClass={className}
          backgroundColor={'#00a0b0'}
          updateSortMethod={(sortMethod) => this.setState({ newSort: sortMethod })}
          feedback={newFeedback.map(feedback => <FeedbackCard key={feedback.id} feedback={feedback} />)}
          filterMethod={'new'}
        />
      </div>
    );

    return (this.props.group.includePositiveFeedbackBox ? retailColumns : actionColumns);
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

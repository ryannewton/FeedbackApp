import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {

  renderLinks() {
    if(this.props.authenticated) {
      return [
        <li className='nav-item' key='addReplies'>
          <Link className='nav-link' style={style.link} to='/managefeedback'>
            Add Replies
          </Link>
        </li>,
        <li className='nav-item' key='approveFeedback'>
          <Link className='nav-link' style={style.link} to='/approvefeedback'>
            Approve Feedback
          </Link>
        </li>,
        <li className='nav-item' key='approveSolutions'>
          <Link className='nav-link' style={style.link} to='/approvesolutions'>
            Approve Solutions
          </Link>
        </li>,
        <li className='nav-item' key='signOut'>
          <Link className='nav-link' style={style.link} to='/signout'>
            Sign Out
          </Link>
        </li>,
      ];
    } else {
      return [
        <li className='nav-item' key='signIn'>
          <Link className='nav-link' style={style.link} to='/sendcode'>
            Sign In
          </Link>
        </li>,
      ];
    }
  }

  render() {
    return (
      <nav className='navbar' style={style.nav}>
        <Link to='/' className='navbar-brand' style={style.link}>
          Suggestion Box App
        </Link>
        <ul className='nav navbar-nav navbar-right'>
          {this.renderLinks()}
        </ul>
      </nav>
    );
  }
}

const style = {
  nav: {
    backgroundColor: '#3AA0FB',
  },
  link: {
    color: 'white',
  }
}

function mapStateToProps(state) {
  const { authenticated } = state.auth;
  return { authenticated };
}

export default connect(mapStateToProps)(Header);

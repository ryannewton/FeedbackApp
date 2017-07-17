import React from 'react';
import { connect } from 'react-redux';
import { signoutUser } from '../../redux/actions';

const Header = (props) => {
  const {
    appName,
  } = props;

  return (
    <header className="header fixed--header">
      <a href="/admin" className="logo">
        { appName }
      </a>
      <nav
        className="navbar navbar-static-top"
        role="navigation"
      >
        [Put the name of the current page here]
        <button onClick={props.signoutUser}>Logout</button>
      </nav>
    </header>
  );
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, { signoutUser })(Header);

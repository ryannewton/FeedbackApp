import React from 'react';

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
      </nav>
    </header>
  );
};

export default Header;

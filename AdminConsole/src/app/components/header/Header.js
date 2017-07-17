import React from 'react';
import { connect } from 'react-redux';
import { signoutUser } from '../../redux/actions';

const Header = (props) => {
  const {
    appName,
  } = props;

  return (
    <header className="header fixed--header" style={{backgroundColor:'#00A2FF', height:50}}>
      <div style={{paddingTop:5}}>
        <img href="/admin" src={require('../../vendors/img/logo.png')} className="col-xs-2"/>
        <h4 className="col-xs-9" style={{color:'white'}}>Administrator Console</h4>
        <button className="btn btn-default" onClick={props.signoutUser}>Logout</button>
      </div>
    </header>
  );
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, { signoutUser })(Header);

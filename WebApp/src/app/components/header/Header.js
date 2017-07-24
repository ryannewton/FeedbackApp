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
        <img href="/admin" src={require('../../vendors/img/logo.png')} className="pull-left"  style={{height:40, paddingLeft:20}}/>
        <h4 className="col-xs-6" style={{color:'white', paddingLeft:30}}>Web Portal</h4>
        <button style={{marginRight:10}} className="btn btn-default pull-right" onClick={props.signoutUser}>Logout</button>
      </div>
    </header>
  );
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, { signoutUser })(Header);

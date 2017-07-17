import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MainRoutes from '../routes/MainRoutes';
import * as actions from '../redux/actions';
import {
  Header,
  AsideLeft,
  AsideRight
} from '../components';
import { navigation } from '../models';

class App extends Component {

  state = {
    appName: 'Suggestion Box',
  };

  componentDidMount() {
    const {
      actions: {
        getSideMenuCollpasedStateFromLocalStorage
      }
    } = this.props;

    getSideMenuCollpasedStateFromLocalStorage();
  }

  render() {
    const { appName, connectionStatus } = this.state;
    const { userIsConnected } = this.props;
    const { sideMenuIsCollapsed, currentView } = this.props;

    return (
      <div>
        <Header
          appName={appName}
          currentView={currentView}
          toggleSideMenu={this.handlesMenuButtonClick}
        />
        <div className="wrapper row-offcanvas row-offcanvas-left">
          <AsideLeft
            isAnimated={true}
            sideMenu={navigation.sideMenu}
            currentView={currentView}
            isCollapsed={sideMenuIsCollapsed}
            connectionStatus={connectionStatus}
            userIsConnected={userIsConnected}
          />
          <AsideRight
            isAnimated={true}
            isExpanded={sideMenuIsCollapsed}>
            <MainRoutes />
          </AsideRight>
        </div>
      </div>
    );
  }

  handlesMenuButtonClick = (event) => {
    event.preventDefault();
    const { actions: { toggleSideMenu } } = this.props;
    toggleSideMenu();
  }
}

const mapStateToProps = (state) => {
  return {
    currentView: state.views.currentView,
    sideMenuIsCollapsed: state.sideMenu.isCollapsed,
    routing: state.routing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {...actions},
      dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

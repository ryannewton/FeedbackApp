import React, {
  PropTypes,
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainRoutes from '../routes/MainRoutes';
import { withRouter } from 'react-router';
import * as actions from '../redux/modules/actions';
import {
  Header,
  // Footer,
  AsideLeft,
  AsideRight
} from '../components';
import { Modals } from '../views';
import { appConfig } from '../config';
import { navigation } from '../models';

class App extends Component {

  static propTypes = {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    sideMenuIsCollapsed: PropTypes.bool,
    userIsConnected: PropTypes.bool,
    currentView:     PropTypes.string,

    actions: PropTypes.shape({
      enterHome: PropTypes.func,
      leaveHome: PropTypes.func,
      openSideMenu:   PropTypes.func,
      closeSideMenu:  PropTypes.func,
      toggleSideMenu: PropTypes.func
    })
  };

  state = {
    appName:          appConfig.APP_NAME,
    connectionStatus: appConfig.CONNECTION_STATUS,
    helloWord:        appConfig.HELLO_WORD
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
    const { appName, connectionStatus, helloWord } = this.state;
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
            helloWord={helloWord}
            connectionStatus={connectionStatus}
            userIsConnected={userIsConnected}
          />
          <AsideRight
            isAnimated={true}
            isExpanded={sideMenuIsCollapsed}>
            <MainRoutes />
          </AsideRight>
        </div>
        {/* <Footer /> */}
        {/* modals cannot be placed anywhere (avoid backdrop or modal placement issues) so all grouped in same component and outside .wrapper*/}
        <Modals />
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
    currentView:         state.views.currentView,
    sideMenuIsCollapsed: state.sideMenu.isCollapsed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
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

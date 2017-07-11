/* eslint no-console: 0 */
import React, { PropTypes, Component } from 'react';
import cx         from 'classnames';
import UserPanel  from './userPanel/UserPanel';
import SearchForm from './searchForm/SearchForm';
import Horloge    from '../../horloge/Horloge';
import Menu       from './menu/Menu';
import { connect } from 'react-redux';


class AsideLeft extends Component {
  render() {
    const {
    connectionStatus,
    userIsConnected,
    username,
    helloWord,
    userPicture,
    showPicture
  } = this.props;

  const token = localStorage.getItem('token');
  const sideMenu = (token) ? this.props.sideMenu : [
    // group menu #1
    {
      id: 1,
      group: 'Dashboard  ',
      menus: [
        {
          name: 'Sign In',
          linkTo: '/Dashboard/workProgress',
          faIconName: 'fa-check'
        },
      ]
    }
  ];
  const currentView = (this.props.authenticated) ? this.props.currentView: 'WorkProgress';

  const {
    isAnimated,
    isCollapsed,
  } = this.props;

  return (
    <aside className={
      cx({
        'no-print': true,
        'left-side': true,
        'aside-left--fixed': true,
        'sidebar-offcanvas': true,
        'sidebar-animated': isAnimated,
        'collapse-left':    isCollapsed
      })}
      // add overflow to left sidebar:
      style={{
        height: '100%',
        overflow: 'auto',
        position: 'fixed'
      }}>
        <section className="sidebar">
          <Horloge />

          {
            sideMenu.map(
              ({id, group, menus}, menuIdx) => {
                return (
                  <Menu
                    key={menuIdx}
                    initialCollapseState={menuIdx === 0 ? false : null}
                    headerTitle={group}
                    headerBackColor="#283744"
                    activeView={currentView}
                    views={menus}
                  />
                );
              }
            )
          }
        </section>
    </aside>

  );}
};

AsideLeft.propTypes = {
  isAnimated: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  sideMenu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      group: PropTypes.string.isRequired,
      menus: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          linkTo: PropTypes.string.isRequired,
          faIconName: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  currentView: PropTypes.string,
  connectionStatus: PropTypes.shape({
    online: PropTypes.string,
    disconnected: PropTypes.string
  }),
  userIsConnected: PropTypes.bool,
  username: PropTypes.string,
  userPicture: PropTypes.string,
  showPicture: PropTypes.bool,
  helloWord: PropTypes.string
};

AsideLeft.defaultProps = {
  isAnimated: false,
  isCollapsed: false
};
// <SearchForm
//   onSearchSubmit={(value) => console.log('searching: ', value)}
// />
// <UserPanel
//   hello={helloWord}
//   username={username}
//   connectionStatus={connectionStatus}
//   online={userIsConnected}
//   userPicture={userPicture}
//   showUserPicture={showPicture}
// />
function mapStateToProps(state) {
  const { email, emailSentSuccess, loading, authenticated } = state.auth;
  return { email, emailSentSuccess, loading, authenticated };
}
export default connect(mapStateToProps, {})(AsideLeft);

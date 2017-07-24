/* eslint no-console: 0 */
import React, { PropTypes } from 'react';
import cx from 'classnames';
import Menu from './menu/Menu';


const AsideLeft = (props) => {
  const {
    connectionStatus,
    userIsConnected,
    username,
    helloWord,
    userPicture,
    showPicture
  } = props;

  const {
    isAnimated,
    isCollapsed,
    currentView,
    sideMenu
  } = props;

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

          {/*<SearchForm
            onSearchSubmit={(value) => console.log('searching: ', value)}
          />*/}
          {
            sideMenu.map(
              ({id, group, menus}, menuIdx) => {
                return (
                  <Menu
                    key={menuIdx}
                    initialCollapseState={menuIdx === 0 ? false : null}
                    headerTitle={group}
                    headerBackColor="#1F577F"
                    activeView={currentView}
                    views={menus}
                  />
                );
              }
            )
          }
        </section>
    </aside>

  );
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

export default AsideLeft;

import React, {
  PropTypes,
  PureComponent
} from 'react';
import {
  AnimatedView,
} from '../../components';
import Highlight from 'react-highlight';


class TabPanel extends PureComponent {

  state = {
    mockHeader: [
      {name: 'Home', tablink: 'home', isActive: true},
      {name: 'About', tablink: 'about', isActive: false},
      {name: 'Profile', tablink: 'profile', isActive: false},
      {name: 'Contact', tablink: 'contact', isActive: false}
    ]
  };

  componentWillMount() {
    const { actions: { enterTabPanel } } = this.props;
    enterTabPanel();
  }

  componentWillUnmount() {
    const { actions: { leaveTabPanel } } = this.props;
    leaveTabPanel();
  }

  render() {
    const { mockHeader } = this.state;

    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-6 col-xs-offset-3">
          </div>
        </div>
        {/* source: */}
        <div className="row">
          <div className="col-xs-12">
          </div>
        </div>
      </AnimatedView>
    );
  }
}

TabPanel.propTypes= {
  actions: PropTypes.shape({
    enterTabPanel: PropTypes.func.isRequired,
    leaveTabPanel: PropTypes.func.isRequired
  })
};

export default TabPanel;

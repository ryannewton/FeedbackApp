// flow

import React, {
  PropTypes,
  PureComponent
} from 'react';
import {
  AnimatedView,
} from '../../components';

class Home extends PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      enterHome: PropTypes.func,
      leaveHome: PropTypes.func,
    })
  };

  componentWillMount() {
    const { actions: { enterHome } } = this.props;
    enterHome();
  }

  componentWillUnmount() {
    const { actions: { leaveHome } } = this.props;
    leaveHome();
  }

  render() {
    console.log('Home props: ', this.props);

    return(
      <AnimatedView>
        <div
          className="row"
          style={{marginBottom: '5px'}}>
          <div className="col-md-3">
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
          </div>
          <div className="col-lg-4">
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
          </div>
          <div className="col-md-4">
          </div>
        </div>

        <div className="row">
          <div className="col-md-5">
          </div>
          <div className="col-md-7">
          </div>
        </div>

      </AnimatedView>
    );
  }
}

export default Home;

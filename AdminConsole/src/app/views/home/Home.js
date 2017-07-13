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
    earningGraphLabels: PropTypes.array,
    earningGraphDatasets: PropTypes.array,
    teamMatesIsFetching: PropTypes.bool,
    teamMates: PropTypes.arrayOf(
      PropTypes.shape({
        picture: PropTypes.string,
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        profile: PropTypes.string,
        profileColor: PropTypes.oneOf(['danger', 'warning', 'info', 'success'])
      })
    ),
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
    const {
      teamMates,
      teamMatesIsFetching,
      earningGraphLabels,
      earningGraphDatasets
    } = this.props;

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

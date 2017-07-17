import React, {
  PropTypes,
  PureComponent
} from 'react';
import AnimatedView from '../components/animatedView/AnimatedView';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

class PageNotFound extends PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      enterPageNotFound: PropTypes.func.isRequired,
      leavePageNotFound: PropTypes.func.isRequired
    })
  };

  componentDidMount() {
    const  { actions } =  this.props;
    actions.enterPageNotFound();
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.leavePageNotFound();
  }

  render() {
    return(
      <AnimatedView>
        <div className="row">
          <div className="col-md-12">
            <h2>
              <i
                className="fa fa-frown-o"
                aria-hidden="true">
              </i>
              &nbsp;
              Sorry... This page does not exist
            </h2>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterPageNotFound: actions.enterPageNotFound,
        leavePageNotFound: actions.leavePageNotFound
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageNotFound);

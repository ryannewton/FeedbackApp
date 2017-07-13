import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../redux/modules/actions';
import { Home } from '../views';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterHome: actions.enterHome,
        leaveHome: actions.leaveHome,
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

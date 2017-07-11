import React, {
  PropTypes,
  Component
}                         from 'react';
import {
  AnimatedView,
  Panel,
  StatsCard as StatsCardComponent
}                         from '../../components';
import shallowCompare     from 'react-addons-shallow-compare';
import Highlight          from 'react-highlight';

import { connect } from 'react-redux';
import { pullFeedback } from '../../actions';
import ErrorMessage from '../../components/ErrorMessage';


class StatsCard extends Component {
  componentWillMount() {
    const { actions: { enterStatsCard } } = this.props;
    enterStatsCard();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const { actions: { leaveStatsCard } } = this.props;
    leaveStatsCard();
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    if(token) {
      this.props.pullFeedback();
    }
  }

  listFeedback = () => {
    if (this.props.feedback.error) {
      return <ErrorMessage />
    }

    if (this.props.feedback.loading) {
      return this.renderLoadingScreen();
    }

    if (this.props.feedback.list.length === 0) {
      return this.renderEmptyList();
    }

    return (
      <div>
        {this.props.feedback.list
          .filter(feedback => feedback.approved)
          .map(feedback => {
            return (
              <div className='col-md-10 col-md-offset-1'>
                <ApproveFeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                />
              </div>
            )
          })
        }
      </div>
    );
  }
  renderEmptyList() {
    return (
      <div>Congratulations, youve hit zero inbox!</div>
    );
  }

  renderLoadingScreen() {
    return (
      <div>Beep boop. Retrieving your feedback...</div>
    );
  }


  render() {
    return(
      <AnimatedView>
        <div>
          <h5>Feedback Approval Needed: (currently shows approved feedback)</h5>
          {this.listFeedback()}
        </div>
      </AnimatedView>
    );
  }
}

StatsCard.propTypes= {
  actions: PropTypes.shape({
    enterStatsCard: PropTypes.func.isRequired,
    leaveStatsCard: PropTypes.func.isRequired
  })
};

function mapStateToProps(state) {
  const { feedback } = state;
  return { feedback };
}

export default connect(mapStateToProps, { pullFeedback })(StatsCard);


// {/* preview: */}
// <div className="row">
//   <div className="col-xs-12">
//     <Panel
//       title="Stats cards"
//       hasTitle={true}
//       bodyBackGndColor={'#F4F5F6'}>
//       <div className="row">
//         <div className="col-md-3">
//           <StatsCardComponent
//             statValue={'3200'}
//             statLabel={'Total Tasks'}
//             icon={<i className="fa fa-check-square-o"></i>}
//             backColor={'red'}
//           />
//         </div>
//         <div className="col-md-3">
//           <StatsCardComponent
//             statValue={'2200'}
//             statLabel={'Total Messages'}
//             icon={<i className="fa fa-envelope-o"></i>}
//             backColor={'violet'}
//           />
//         </div>
//         <div className="col-md-3">
//           <StatsCardComponent
//             statValue={'100,320'}
//             statLabel={'Total Profit'}
//             icon={<i className="fa fa-dollar"></i>}
//             backColor={'blue'}
//           />
//         </div>
//         <div className="col-md-3">
//           <StatsCardComponent
//             statValue={'4567'}
//             statLabel={'Total Documents'}
//             icon={<i className="fa fa-paperclip"></i>}
//             backColor={'green'}
//           />
//         </div>
//       </div>
//     </Panel>
//   </div>
// </div>
// {/* source: */}
// <div className="row">
//   <div className="col-xs-12">
//     <Panel
//       title="Source"
//       hasTitle={true}>
//       <Highlight className="javascript">
//         {source}
//       </Highlight>
//     </Panel>
//   </div>
// </div>

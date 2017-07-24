import moment from 'moment';

import {
  ENTER_HOME_VIEW,
  LEAVE_HOME_VIEW,
  ENTER_GENERAL_VIEW,
  LEAVE_GENERAL_VIEW,
  ENTER_PAGE_NOT_FOUND_VIEW,
  LEAVE_PAGE_NOT_FOUND_VIEW,
  ENTER_TAB_PANEL_VIEW,
  LEAVE_TAB_PANEL_VIEW,
} from '../actions/types';

const initialState = {
  currentView:  'home',
  enterTime:    null,
  leaveTime:    null
};

export default function views(state = initialState, action) {
  switch (action.type) {

  case ENTER_HOME_VIEW:
  case ENTER_GENERAL_VIEW:
  case ENTER_PAGE_NOT_FOUND_VIEW:
  case ENTER_TAB_PANEL_VIEW:
    // can't enter if you are already inside
    if (state.currentView !== action.currentView) {
      return {
        ...state,
        currentView:  action.currentView,
        enterTime:    action.enterTime,
        leaveTime:    action.leaveTime
      };
    }
    return state;

  case LEAVE_HOME_VIEW:
  case LEAVE_GENERAL_VIEW:
  case LEAVE_PAGE_NOT_FOUND_VIEW:
  case LEAVE_TAB_PANEL_VIEW:
    // can't leave if you aren't already inside
    if (state.currentView === action.currentView) {
      return {
        ...state,
        currentView:  action.currentView,
        enterTime:    action.enterTime,
        leaveTime:    action.leaveTime
      };
    }
    return state;

  default:
    return state;
  }
}

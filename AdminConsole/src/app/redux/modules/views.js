import moment from 'moment';

const ENTER_HOME_VIEW  = 'ENTER_HOME_VIEW';
const LEAVE_HOME_VIEW  = 'LEAVE_HOME_VIEW';
const ENTER_GENERAL_VIEW  = 'ENTER_GENERAL_VIEW';
const LEAVE_GENERAL_VIEW  = 'LEAVE_GENERAL_VIEW';
const ENTER_PAGE_NOT_FOUND_VIEW  = 'ENTER_PAGE_NOT_FOUND_VIEW';
const LEAVE_PAGE_NOT_FOUND_VIEW  = 'LEAVE_PAGE_NOT_FOUND_VIEW';
const ENTER_TAB_PANEL_VIEW = 'ENTER_TAB_PANEL_VIEW';
const LEAVE_TAB_PANEL_VIEW = 'LEAVE_TAB_PANEL_VIEW';

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


export function enterHome(time = moment().format()) {
  return {
    type:         ENTER_HOME_VIEW,
    currentView:  'Home',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveHome(time = moment().format()) {
  return {
    type:         LEAVE_HOME_VIEW,
    currentView:  'Home',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterGeneral(time = moment().format()) {
  return {
    type:         ENTER_GENERAL_VIEW,
    currentView:  'General',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveGeneral(time = moment().format()) {
  return {
    type:         LEAVE_GENERAL_VIEW,
    currentView:  'General',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterPageNotFound(time = moment().format()) {
  return {
    type:         ENTER_PAGE_NOT_FOUND_VIEW,
    currentView:  'PageNotFound',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leavePageNotFound(time = moment().format()) {
  return {
    type:         LEAVE_PAGE_NOT_FOUND_VIEW,
    currentView:  'PageNotFound',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterTabPanel(time = moment().format()) {
  return {
    type:         ENTER_TAB_PANEL_VIEW,
    currentView:  'TabPanel',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveTabPanel(time = moment().format()) {
  return {
    type:         LEAVE_TAB_PANEL_VIEW,
    currentView:  'TabPanel',
    enterTime:    null,
    leaveTime:    time
  };
}

import moment from 'moment';

import {
  SIDEMU_IS_COLLAPSED_KEY,
  SIDEMU_IS_COLLAPSED_VALUE,
  SIDEMU_IS_NOT_COLLAPSED_VALUE,
  READ_LOCALSTORAGE,
  WRITE_LOCALSTORAGE,
  OPEN_SIDE_MENU,
  CLOSE_SIDE_MENU,
  GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE,
} from '../actions/types';

const initialState = {
  isCollapsed: false,
  time: null
};

export default function sideMenu(state = initialState, action) {
  switch (action.type) {

  case GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE:
    return {
      isCollapsed:  Boolean(action.permanentStore.storeValue),
      time:         action.time
    };
  case OPEN_SIDE_MENU:
    return {
      ...state,
      isCollapsed:  action.isCollapsed,
      time:         action.time
    };
  case CLOSE_SIDE_MENU:
    return {
      ...state,
      isCollapsed:  action.isCollapsed,
      time:         action.time
    };
  default:
    return state;
  }
}

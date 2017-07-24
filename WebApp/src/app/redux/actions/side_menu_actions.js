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
} from './types';


export function getSideMenuCollpasedStateFromLocalStorage(time = moment().format()) {
  return {
    type: GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE,
    time,
    // for localStorageManager middleware
    permanentStore: {
      required: true,
      storeKey: SIDEMU_IS_COLLAPSED_KEY,
      storeValue: '',
      ReadOrWrite: READ_LOCALSTORAGE // write key / value to localStorage
    }
  };
}
export function openSideMenu(time = moment().format()) {
  return {
    type:         OPEN_SIDE_MENU,
    isCollapsed:  false,
    time,
    // for localStorageManager middleware
    permanentStore: {
      required: true,
      storeKey: SIDEMU_IS_COLLAPSED_KEY,
      storeValue: SIDEMU_IS_NOT_COLLAPSED_VALUE,
      ReadOrWrite: WRITE_LOCALSTORAGE // write key / value to localStorage
    }
  };
}
export function closeSideMenu(time = moment().format()) {
  return {
    type:         CLOSE_SIDE_MENU,
    isCollapsed:  true,
    time,
    // for localStorageManager middleware
    permanentStore: {
      required: true,
      storeKey: SIDEMU_IS_COLLAPSED_KEY,
      storeValue: SIDEMU_IS_COLLAPSED_VALUE,
      ReadOrWrite: WRITE_LOCALSTORAGE // write key / value to localStorage
    }
  };
}
export function toggleSideMenu() {
  return (dispatch, getState) => {
    const state = getState();
    const sideMenuStore = state.sideMenu;
    if (sideMenuStore.isCollapsed) {
      dispatch(openSideMenu());
    } else {
      dispatch(closeSideMenu());
    }
  };
}

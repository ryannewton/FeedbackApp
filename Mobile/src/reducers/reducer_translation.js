import {
CHANGE_LANGUAGE_CHOICE,
PULL_GROUP_INFO,
} from '../actions/types';

import translate from '../translation';

const INITIAL_STATE = {
  language: 'en',
  ...translate('en'),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE_CHOICE: {
      const { payload } = action;
      return { ...state, language: payload, ...translate(payload) };
    }
    case PULL_GROUP_INFO: {
      // Deconstruction for language variable was throwing error
      return {
        ...state,
        language: action.payload.groupInfo.language,
        ...translate(action.payload.groupInfo.language),
      };
    }
    default:
      return state;
  }
};

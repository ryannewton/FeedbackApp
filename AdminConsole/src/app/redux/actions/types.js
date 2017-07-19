// Auth Actions
export const AUTHORIZING_USER = 'authorize_user';
export const AUTHORIZE_USER_SUCCESS = 'authorize_user_success';
export const AUTHORIZE_USER_FAIL = 'authorize_user_fail';
export const SIGNOUT_USER = 'signout_user';

// Feedback Actions
export const REQUEST_FEEDBACK = 'requested_feedback';
export const REQUEST_FEEDBACK_SUCCESS = 'request_feedback_success';
export const APPROVE_FEEDBACK = 'approve_feedback';
export const APPROVE_FEEDBACK_SUCCESS = 'approve_feedback_success';
export const APPROVE_FEEDBACK_FAIL = 'approve_feedback_fail';
export const CLARIFY_FEEDBACK = 'clarify_feedback';
export const CLARIFY_FEEDBACK_SUCCESS = 'clarify_feedback_success';
export const CLARIFY_FEEDBACK_FAIL = 'clarify_feedback_fail';
export const REJECT_FEEDBACK = 'reject_feedback';
export const REJECT_FEEDBACK_SUCCESS = 'reject_feedback_success';
export const REJECT_FEEDBACK_FAIL = 'reject_feedback_fail';
export const SUBMIT_OFFICIAL_REPLY = 'submit_official_reply';
export const SUBMIT_OFFICIAL_REPLY_SUCCESS = 'submit_official_reply_success';
export const SUBMIT_OFFICIAL_REPLY_FAIL = 'submit_official_reply_fail';
export const UPDATE_FEEDBACK_STATUS = 'update_feedback_status';
export const UPDATE_FEEDBACK = 'update_feedback';

// Solutions Actions
export const REQUEST_SOLUTIONS = 'request_solutions';
export const REQUEST_SOLUTIONS_SUCCESS = 'request_solutions_success';
export const APPROVE_SOLUTION = 'approve_solution';
export const APPROVE_SOLUTION_SUCCESS = 'approve_solution_success';
export const APPROVE_SOLUTION_FAIL = 'approve_solution_fail';
export const CLARIFY_SOLUTION = 'clarify_solution';
export const CLARIFY_SOLUTION_SUCCESS = 'clarify_solution_success';
export const CLARIFY_SOLUTION_FAIL = 'clarify_solution_fail';
export const REJECT_SOLUTION = 'reject_solution';
export const REJECT_SOLUTION_SUCCESS = 'reject_solution_success';
export const REJECT_SOLUTION_FAIL = 'reject_solution_fail';

// Group Actions
export const GROUP_TREE_INFO = 'get_group_tree_info';

// Side Menu Actions
export const SIDEMU_IS_COLLAPSED_KEY = 'SIDEMENU_IS_OPENED_KEY';
export const SIDEMU_IS_COLLAPSED_VALUE = true;
export const SIDEMU_IS_NOT_COLLAPSED_VALUE = false;
export const READ_LOCALSTORAGE = false;
export const WRITE_LOCALSTORAGE = true;

export const OPEN_SIDE_MENU = 'OPEN_SIDE_MENU';
export const CLOSE_SIDE_MENU = 'CLOSE_SIDE_MENU';
export const GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE = 'GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE';

// Views Actions
export const ENTER_HOME_VIEW = 'ENTER_HOME_VIEW';
export const LEAVE_HOME_VIEW = 'LEAVE_HOME_VIEW';
export const ENTER_GENERAL_VIEW = 'ENTER_GENERAL_VIEW';
export const LEAVE_GENERAL_VIEW = 'LEAVE_GENERAL_VIEW';
export const ENTER_PAGE_NOT_FOUND_VIEW = 'ENTER_PAGE_NOT_FOUND_VIEW';
export const LEAVE_PAGE_NOT_FOUND_VIEW = 'LEAVE_PAGE_NOT_FOUND_VIEW';
export const ENTER_TAB_PANEL_VIEW = 'ENTER_TAB_PANEL_VIEW';
export const LEAVE_TAB_PANEL_VIEW = 'LEAVE_TAB_PANEL_VIEW';

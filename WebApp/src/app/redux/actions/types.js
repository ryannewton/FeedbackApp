// Auth Actions
export const SIGNOUT_USER = 'signout_user';
export const SENDING_AUTHORIZATION_EMAIL = 'sending_authorization_email';
export const SENT_AUTHORIZATION_EMAIL_SUCCESS = 'sent_authorization_email_success';
export const SENT_AUTHORIZATION_EMAIL_FAIL = 'sent_authorization_email_fail';
export const AUTHORIZING_USER = 'authorizing_user';
export const VERIFYING_EMAIL = 'verify_user';
export const AUTHORIZE_USER_SUCCESS = 'authorize_user_success';
export const AUTHORIZE_USER_FAIL = 'authorize_user_fail';
export const NEEDS_GROUP_CODE = 'needs_group_code';
export const SAVE_GROUP_CODE = 'save_group_code';


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
export const PULL_FEEDBACK_VOTES_SUCCESS = 'pull_feedback_votes';
export const ADD_FEEDBACK_UPVOTE = 'add_feedback_upvote';
export const ADD_FEEDBACK_DOWNVOTE = 'add_feedback_downvote';
export const REMOVE_FEEDBACK_UPVOTE = 'remove_feedback_upvote';
export const REMOVE_FEEDBACK_DOWNVOTE = 'remove_feedback_downvote';
export const SUBMIT_FEEDBACK_SUCCESS = 'submit_feedback_success';
export const SUBMIT_FEEDBACK_FAIL = 'submit_feedback_fail';
export const ADD_FEEDBACK_TO_STATE = 'add_feedback_to_state';

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
export const ADD_SOLUTION_TO_STATE = 'add_solution_to_state';
export const SUBMIT_SOLUTION_FAIL = 'submit_solution_fail';
export const PULL_SOLUTION_VOTES_SUCCESS = 'pull_solution_votes_success';
export const REMOVE_SOLUTION_DOWNVOTE = 'remove_solution_downvote';
export const REMOVE_SOLUTION_UPVOTE = 'REMOVE_SOLUTION_UPVOTE';
export const ADD_SOLUTION_DOWNVOTE = 'add_solution_downvote';
export const ADD_SOLUTION_UPVOTE = 'add_solution_upvote';

// Group Actions
export const GROUP_TREE_INFO = 'get_group_tree_info';
export const PULL_GROUP_INFO = 'pull_group_info';

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

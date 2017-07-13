// Import action types
import {
  PULL_GROUP_INFO,
  LOG_OUT_USER,
  SAVE_GROUP_CODE
} from '../actions/types';

const INITIAL_STATE = {
  groupAuthCode: 0,
  groupName: '',
  feedbackRequireApproval: true,
  solutionsRequireApproval: true,
  showStatus: true,
  includePositiveFeedbackBox: false,
  includeLanguage: false,
  bannedWords: /(?:\banal\b|\banus\b|\barse\b|\bass\b|\bballsack\b|\bballs\b|\bbastard\b|\bbitch\b|\bbiatch\b|\bbloody\b|\bblowjob\b|\bblow job\b|\bbollock\b|\bbollok\b|\bboner\b|\bboob\b|\bbugger\b|\bbum\b|\bbutt\b|\bbuttplug\b|\bclitoris\b|\bcock\b|\bcoon\b|\bcrap\b|\bcunt\b|\bdamn\b|\bdick\b|\bdildo\b|\bdyke\b|\bfag\b|\bfeck\b|\bfellate\b|\bfellatio\b|\bfelching\b|\bfuck\b|\bf u c k\b|\bfudgepacker\b|\bfudge packer\b|\bflange\b|\bGoddamn\b|\bGod damn\b|\bhell\b|\bhomo\b|\bjerk\b|\bjizz\b|\bknobend\b|\bknob end\b|\blabia\b|\blmao\b|\blmfao\b|\bmuff\b|\bnigger\b|\bnigga\b|\bomg\b|\bpenis\b|\bpiss\b|\bpoop\b|\bprick\b|\bpube\b|\bpussy\b|\bqueer\b|\bscrotum\b|\bsex\b|\bshit\b|\bs hit\b|\bsh1t\b|\bslut\b|\bsmegma\b|\bspunk\b|\btit\b|\btosser\b|\bturd\b|\btwat\b|\bvagina\b|\bwank\b|\bwhore\b|\bwtf\b)/,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_GROUP_INFO:
      return {...state,
        groupName: action.payload.groupName,
        feedbackRequireApproval: Boolean(action.payload.feedbackRequireApproval),
        solutionsRequireApproval: Boolean(action.payload.solutionsRequireApproval),
        showStatus: Boolean(action.payload.showStatus),
        includePositiveFeedbackBox: Boolean(action.payload.includePositiveFeedbackBox),
        groupAuthCode: action.payload.groupAuthCode,
        includeLanguage: Boolean(action.payload.includeLanguage),
      };
    case SAVE_GROUP_CODE:
      return {...state, groupAuthCode: action.payload}
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};

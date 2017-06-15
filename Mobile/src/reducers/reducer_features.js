// Import action types
import {
  PULL_FEATURES,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  moderatorApproval: true,
  moderatorApprovalSolutions: true,
  showStatus: true,
  enableNewFeedback: null,
  positiveFeedbackBox: null,
  domain: null,
  email: null,
  bannedWords: /(?:\banal\b|\banus\b|\barse\b|\bass\b|\bballsack\b|\bballs\b|\bbastard\b|\bbitch\b|\bbiatch\b|\bbloody\b|\bblowjob\b|\bblow job\b|\bbollock\b|\bbollok\b|\bboner\b|\bboob\b|\bbugger\b|\bbum\b|\bbutt\b|\bbuttplug\b|\bclitoris\b|\bcock\b|\bcoon\b|\bcrap\b|\bcunt\b|\bdamn\b|\bdick\b|\bdildo\b|\bdyke\b|\bfag\b|\bfeck\b|\bfellate\b|\bfellatio\b|\bfelching\b|\bfuck\b|\bf u c k\b|\bfudgepacker\b|\bfudge packer\b|\bflange\b|\bGoddamn\b|\bGod damn\b|\bhell\b|\bhomo\b|\bjerk\b|\bjizz\b|\bknobend\b|\bknob end\b|\blabia\b|\blmao\b|\blmfao\b|\bmuff\b|\bnigger\b|\bnigga\b|\bomg\b|\bpenis\b|\bpiss\b|\bpoop\b|\bprick\b|\bpube\b|\bpussy\b|\bqueer\b|\bscrotum\b|\bsex\b|\bshit\b|\bs hit\b|\bsh1t\b|\bslut\b|\bsmegma\b|\bspunk\b|\btit\b|\btosser\b|\bturd\b|\btwat\b|\bvagina\b|\bwank\b|\bwhore\b|\bwtf\b)/,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_FEATURES:
      return {
        ...state,
        moderatorApproval: Boolean(action.payload.moderatorApproval),
        moderatorApprovalSolutions: Boolean(action.payload.moderatorApprovalSolutions),
        showStatus: Boolean(action.payload.showStatus),
        enableNewFeedback: Boolean(action.payload.enableNewFeedback),
        positiveFeedbackBox: Boolean(action.payload.positiveFeedbackBox),
        domain: action.payload.domain,
        email: action.payload.email,
      };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};


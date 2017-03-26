// Import action types
import {
  REQUESTED_FEEDBACK,
} from './types';

// Handle Feedback
export const requestedFeedback = (startDate, endDate) => (
  {
    type: REQUESTED_FEEDBACK,
    startDate,
    endDate,
  }
);

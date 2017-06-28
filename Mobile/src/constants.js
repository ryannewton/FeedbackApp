import axios from 'axios';
// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

export const ROOT_STORAGE = '@FeedbackApp:';
export const ROOT_URL = 'https://feedbackappdev.com';
// export const ROOT_URL = 'https://collaborativefeedback.com';
// export const ROOT_URL = 'http://10.0.2.2:3000';
// export const ROOT_URL = 'http://localhost:3000';

export const http = axios.create({
  baseURL: ROOT_URL,
});

// export const tracker = new GoogleAnalyticsTracker('UA-99660629-1', { domain: 1, project: 2 });

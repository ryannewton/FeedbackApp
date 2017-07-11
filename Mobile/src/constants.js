import axios from 'axios';

export const ROOT_STORAGE = '@FeedbackApp:';
export const ROOT_URL = 'https://feedbackappdev.com';
// export const ROOT_URL = 'https://collaborativefeedback.com';
// export const ROOT_URL = 'http://10.0.2.2:8081';
// export const ROOT_URL = 'http://localhost:8081';
// export const ROOT_URL = 'http://fd49da60.ngrok.io';

export const http = axios.create({
  baseURL: ROOT_URL,
});

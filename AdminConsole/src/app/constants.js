import axios from 'axios';

// const ROOT_URL = 'https://feedbackappdev.com';
// const ROOT_URL = 'https://collaborativefeedback.com';
// const ROOT_URL = 'http://10.0.2.2:3000';
const ROOT_URL = 'http://localhost:8081';

export default axios.create({
  baseURL: ROOT_URL,
});

// export default axios.create();

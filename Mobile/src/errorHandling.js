const errorHandling = (error, location) => {
  if (error.response) {
    console.log('Error in location: ', location, 'Error is: ', error.response);
    if (error.response.request.status === 400 && error.response.data !== 'Bad Request') {
      return error.response.data;
    }
    return 'The server is experiencing an issue, please try again.';
  }
  console.log('Error in location: ', location, 'Error is: ', error);
  return 'The server is experiencing an issue, please try again.';
};

export default errorHandling;

const errorHandling = error => {
  if (error.message.indexOf('502') === -1) {
    return error
  }
  return 'The server is experiencing an issue, please try again.'
}

export default errorHandling;

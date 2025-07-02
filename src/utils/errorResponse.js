class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Only for development
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;

class ApiResponse {
  constructor({
    data = null,
    message = "Success",
    status = "success",
    token = null,
  } = {}) {
    this.status = status;
    this.message = message;
    this.data = data;
    if (token) {
      this.token = token;
    }
  }
}

module.exports = ApiResponse;

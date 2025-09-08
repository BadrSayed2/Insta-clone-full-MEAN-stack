class ApiResponse {
  constructor({
    data = null,
    message = "Success",
    status = "success",
    token = null,
    pagination = null,
  } = {}) {
    this.status = status;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
    if (token) {
      this.token = token;
    }
  }
}

module.exports = ApiResponse;

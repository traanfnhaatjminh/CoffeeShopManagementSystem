const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class UnAuthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCodes = StatusCodes.UNAUTHORIZED;
    }
}
export default UnAuthenticatedError;

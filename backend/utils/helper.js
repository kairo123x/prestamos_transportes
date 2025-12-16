export function apiResponse(res, success, message, data = null, statusCode = 200) {
    const response = { success, message };
    if (data) {
        response.data = data;
    }
    res.status(statusCode).json(response);
}

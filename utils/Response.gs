/**
 * Response Utility
 * Provides consistent JSON response structure across all services.
 */

function successResponse(data) {
  return {
    success: true,
    data: data
  };
}

function errorResponse(message) {
  return {
    success: false,
    error: message
  };
}

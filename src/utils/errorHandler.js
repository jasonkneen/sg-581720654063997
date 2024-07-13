export function logError(error, errorInfo = null) {
  console.error("An error occurred:", error);
  if (errorInfo) {
    console.error("Error Info:", errorInfo);
  }
  
  // You can add more sophisticated error logging here, such as sending to a service like Sentry
  // Example: Sentry.captureException(error);
}

export function handleApiError(error) {
  logError(error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return `Error: ${error.response.status} - ${error.response.data.message || 'An error occurred'}`;
  } else if (error.request) {
    // The request was made but no response was received
    return "Error: No response received from server";
  } else {
    // Something happened in setting up the request that triggered an Error
    return "Error: Failed to send request";
  }
}

export function validateInput(input, rules) {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    if (rule.required && !input[field]) {
      errors[field] = `${field} is required`;
    } else if (rule.minLength && input[field].length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && input[field].length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    } else if (rule.pattern && !rule.pattern.test(input[field])) {
      errors[field] = `${field} is invalid`;
    }
  }
  
  return errors;
}
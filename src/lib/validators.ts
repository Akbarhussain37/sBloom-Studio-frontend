/**
 * Validates an email address format using a regular expression.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a password meets minimum requirements (at least 6 characters).
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates if two passwords match.
 */
export const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

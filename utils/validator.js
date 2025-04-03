const { AppError } = require('./errorHandler');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validateRegistration = (username, email, password) => {
  if (!username || !email || !password) {
    throw new AppError('All fields are required', 400);
  }

  if (!validateUsername(username)) {
    throw new AppError('Invalid username format', 400);
  }

  if (!validateEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }

  if (!validatePassword(password)) {
    throw new AppError(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      400
    );
  }

  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateRegistration
}; 
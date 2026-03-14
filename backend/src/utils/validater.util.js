function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  email = email.trim().toLowerCase();

  if (email.length < 3 || email.length > 255) {
    return {
      valid: false,
      error: "Email must be between 3 and 255 characters",
    };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true, email };
}

function validatePassword(password, fieldName = "Password") {
  if (!password || typeof password !== "string") {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: `${fieldName} must be at least 6 characters`,
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      error: `${fieldName} must be less than 128 characters`,
    };
  }

  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return { valid: true, password };
}

function validateName(name) {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Name is required" };
  }

  name = name.trim();

  if (name.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }

  if (name.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      valid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { valid: true, name };
}

function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, error: "Passwords do not match" };
  }
  return { valid: true };
}

module.exports = {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
};


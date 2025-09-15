// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation regex (optional, for future use)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

export const validateUpdateProfile = (data) => {
  const errors = [];
  const { fullName, email, address } = data;

  // Validate full name
  if (fullName !== undefined) {
    if (typeof fullName !== 'string') {
      errors.push('Full name must be a string');
    } else if (fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    } else if (fullName.trim().length > 100) {
      errors.push('Full name must not exceed 100 characters');
    } else if (!/^[a-zA-Z\s\.]+$/.test(fullName.trim())) {
      errors.push('Full name can only contain letters, spaces, and periods');
    }
  }

  // Validate email
  if (email !== undefined) {
    if (typeof email !== 'string') {
      errors.push('Email must be a string');
    } else if (email.trim() === '') {
      errors.push('Email cannot be empty');
    } else if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email format');
    } else if (email.length > 255) {
      errors.push('Email must not exceed 255 characters');
    }
  }

  // Validate address
  if (address !== undefined) {
    if (typeof address !== 'string') {
      errors.push('Address must be a string');
    } else if (address.trim().length > 255) {
      errors.push('Address must not exceed 255 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required and must be a string' };
  }
  
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  return { isValid: true };
};

export const validateFullName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return { isValid: false, message: 'Full name is required and must be a string' };
  }
  
  if (fullName.trim().length < 2) {
    return { isValid: false, message: 'Full name must be at least 2 characters long' };
  }
  
  if (fullName.trim().length > 100) {
    return { isValid: false, message: 'Full name must not exceed 100 characters' };
  }
  
  if (!/^[a-zA-Z\s\.]+$/.test(fullName.trim())) {
    return { isValid: false, message: 'Full name can only contain letters, spaces, and periods' };
  }
  
  return { isValid: true };
};
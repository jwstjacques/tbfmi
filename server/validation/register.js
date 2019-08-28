const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatRegisterInput(data) {
  let errors = {};

  data.user_name = !isEmpty(data.user_name) ? data.user_name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (Validator.isEmpty(data.user_name)) {
    errors.user_name = 'User name field is required';
  } else if (!Validator.isLength(data.user_name, { min: 2, max: 30 })) {
    errors.user_name = 'User name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  } else if (!Validator.equals(data.password2, data.password)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

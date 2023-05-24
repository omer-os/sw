const { check } = require('express-validator');
const { body } = require('express-validator');

const createUserValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),
  ];
};

  
  module.exports = {
    createUserValidationRules,
  };
  
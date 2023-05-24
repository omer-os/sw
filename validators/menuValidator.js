// validators/menuValidator.js

const { check } = require('express-validator');

exports.menuValidationRules = [
  check('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required and must be a string'),
  check('price')
    .isNumeric()
    .withMessage('Price is required and must be a numeric value'),
  // Add more validation rules as needed
];
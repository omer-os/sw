const { body, param } = require('express-validator');
const { validatePhone } = require('./baseValidators');

// Validation for POST /restaurants
const createRestaurantValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .trim(),
  body('address')
    .isString()
    .withMessage('Address must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Address must be between 2 and 100 characters long')
    .trim(),
  body('city')
    .isString()
    .withMessage('City must be a string')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters long')
    .trim(),
  body('country')
    .isString()
    .withMessage('Country must be a string')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters long')
    .trim(),
  body('zipCode')
    .isString()
    .withMessage('Zip code must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('Zip code must be between 2 and 20 characters long')
    .trim(),
  body('phone')
    .isString()
    .withMessage('Phone number must be a string')
    .custom((value) => {
      if (!validatePhone(value)) {
        throw new Error('Invalid phone number format');
      }
      return true;
    })
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .trim(),
  body('website')
    .isURL()
    .withMessage('Invalid website URL')
    .trim(),
  body('operatingHours').isArray().withMessage('Operating hours must be an array'),
  body('socialMediaLinks').isObject().withMessage('Social media links must be an object'),
  body('features').isArray().withMessage('Features must be an array'),
  body('tags').isArray().withMessage('Tags must be an array'),
];

// Validation for GET /restaurants/:restaurantId
const getRestaurantValidation = [
  param('restaurantId')
    .custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid restaurant ID');
      }
      return true;
    }),
];

module.exports = {
  createRestaurantValidation,
  getRestaurantValidation,
};

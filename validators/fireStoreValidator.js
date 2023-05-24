const { validationResult } = require('express-validator');

exports.validateFirestoreId = (id) => {
  const re = /^[a-zA-Z0-9_-]*$/;
  return re.test(id);
};

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

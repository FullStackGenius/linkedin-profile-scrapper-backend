const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMap = {};

    // Group messages by field
    errors.array().forEach(err => {
      if (!errorMap[err.path]) {
        errorMap[err.path] = [];
      }
      if (!errorMap[err.path].includes(err.msg)) {
        errorMap[err.path].push(err.msg);
      }
    });

    // Format grouped errors
    const formattedErrors = Object.entries(errorMap).map(([field, messages]) => ({
      field,
      messages
    }));

    return res.status(422).json({
      status: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  next();
};

module.exports = validate;

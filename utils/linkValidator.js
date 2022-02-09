const validator = require('validator');

const linkValidator = (value, helpers) => {
  if (value && !validator.isURL(value, { require_protocol: true })) {
    return helpers.error('any.invalid');
  }

  return value;
};

module.exports = linkValidator;

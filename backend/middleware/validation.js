const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name: Joi.string().min(3).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
      }),
    address: Joi.string().max(400).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
      })
  }),

  createUser: Joi.object({
    name: Joi.string().min(3).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
      }),
    address: Joi.string().max(400).required(),
    role: Joi.string().valid('admin', 'normal', 'store_owner').required()
  }),

  createStore: Joi.object({
    name: Joi.string().min(3).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    ownerEmail: Joi.string().email().required()
  }),

  rating: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = { schemas, validate };
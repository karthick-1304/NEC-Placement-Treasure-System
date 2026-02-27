// src/middleware/validationMiddleware.js

import AppError from "../utils/appError.js";

/**
 * Generic Validation Middleware
 * Accepts Joi schema
 */
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details
        .map((detail) => detail.message)
        .join(", ");

      return next(new AppError(message, 400));
    }

    req[property] = value; // sanitized data
    next();
  };
};

export default validate;
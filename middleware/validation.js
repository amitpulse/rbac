import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors";
import { ROLES } from "../constants/roles";

export class ValidationMiddleware {
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return next(new AppError(errorMessages.join('. '), 400));
    }
    next();
  }

  static validateRegistration() {
    return [
      body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3-30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
      
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
      
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
      
      body('role')
        .optional()
        .isIn(Object.values(ROLES))
        .withMessage('Invalid role specified'),
      
      this.handleValidationErrors
    ];
  }

  static validateLogin() {
    return [
      body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
      body('password').notEmpty().withMessage('Password is required'),
      this.handleValidationErrors
    ];
  }
}

import { body, validationResult } from "express-validator";
import { AppError } from "../utils/errors.js";
import { ROLES } from "../constants/roles.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(errorMessages.join('. '), 400));
  }
  next();
};

export const validateRegistration = () => {
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
    
    handleValidationErrors
  ];
};

export const validateLogin = () => {
  return [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ];
};
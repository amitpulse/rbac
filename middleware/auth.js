import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";
import { hasPermission } from "../utils/roleChecker.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(new AppError('Access denied. No token provided.', 401));
    }

    const decoded = verifyToken(token);
    
    if (decoded.type !== 'access') {
      return next(new AppError('Invalid token type.', 401));
    }

    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return next(new AppError('Invalid token or user inactive.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token.', 401));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

export const authorizeHierarchy = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!hasPermission(req.user.role, requiredRole)) {
      return next(new AppError('Access denied. Insufficient role level.', 403));
    }

    next();
  };
};
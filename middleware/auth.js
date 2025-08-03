import User from "../models/User"
import { JWTUtil } from "../utils/jwt"
import { AppError } from "../utils/errors"


export class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return next(new AppError('Access denied. No token provided.', 401));
      }

      const decoded = JWTUtil.verifyToken(token);
      
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
  }

  static authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AppError('Authentication required.', 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError('Access denied. Insufficient permissions.', 403));
      }

      next();
    };
  }

  static authorizeHierarchy(requiredRole) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AppError('Authentication required.', 401));
      }

      const RoleChecker = require('../utils/roleChecker');
      if (!RoleChecker.hasPermission(req.user.role, requiredRole)) {
        return next(new AppError('Access denied. Insufficient role level.', 403));
      }

      next();
    };
  }
}
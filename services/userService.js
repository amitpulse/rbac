import User from "../models/User"
import { RoleChecker } from "../utils/roleChecker"
import { AppError } from "../utils/errors"


export class UserService {
  static async getAllUsers(requestingUser, page = 1, limit = 10) {
    if (!RoleChecker.hasPermission(requestingUser.role, 'admin')) {
      throw new AppError('Access denied', 403);
    }

    const skip = (page - 1) * limit;
    const users = await User.find({})
      .select('-password -refreshTokens')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({});

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    };
  }

  static async updateUserRole(userId, newRole, requestingUser) {
    if (requestingUser.role !== 'superadmin') {
      throw new AppError('Only superadmin can change user roles', 403);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.role = newRole;
    await user.save();

    return user;
  }

  static async deactivateUser(userId, requestingUser) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!RoleChecker.canModifyUser(requestingUser.role, user.role)) {
      throw new AppError('Cannot modify user with equal or higher role', 403);
    }

    user.isActive = false;
    await user.save();

    return user;
  }
}
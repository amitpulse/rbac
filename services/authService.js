import User from '../models/User'
import { JWTUtil } from '../utils/jwt'
import { RoleChecker } from '../utils/roleChecker'
import { AppError } from '../utils/errors'
import { ROLES } from '../constants/roles'

export class AuthService {
  static async register(userData, requestingUser = null) {
    const { username, email, password, role = ROLES.USER } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Role assignment validation
    if (role !== ROLES.USER) {
      if (!requestingUser || requestingUser.role !== ROLES.SUPERADMIN) {
        throw new AppError('Only superadmin can create admin accounts', 403);
      }
    }

    const user = new User({ username, email, password, role });
    await user.save();

    const tokens = JWTUtil.generateTokenPair(user._id, user.role);
    
    // Store refresh token
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    return { user, tokens };
  }

  static async login(email, password) {
    const user = await User.findOne({ email, isActive: true });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    await user.updateLastLogin();
    
    const tokens = JWTUtil.generateTokenPair(user._id, user.role);
    
    // Store refresh token
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    return { user, tokens };
  }

  static async refreshToken(refreshToken) {
    try {
      const decoded = JWTUtil.verifyToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid refresh token', 401);
      }

      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      // Check if refresh token exists in user's tokens
      const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
      if (!tokenExists) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new token pair
      const tokens = JWTUtil.generateTokenPair(user._id, user.role);
      
      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      user.refreshTokens.push({ token: tokens.refreshToken });
      await user.save();

      return { user, tokens };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  static async logout(userId, refreshToken) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
    }
  }
}
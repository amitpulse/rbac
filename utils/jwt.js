import { jwt} from "jsonwebtoken";
import {JWT_CONFIG} from "../config/jwt"

export class JWTUtil {
  static generateAccessToken(userId, role) {
    return jwt.sign(
      { userId, role, type: 'access' },
      JWT_CONFIG.JWT_SECRET,
      { expiresIn: JWT_CONFIG.JWT_EXPIRES_IN }
    );
  }

  static generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      JWT_CONFIG.JWT_SECRET,
      { expiresIn: JWT_CONFIG.JWT_REFRESH_EXPIRES_IN}
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, JWT_CONFIG.JWT_SECRET);
  }

  static generateTokenPair(userId, role) {
    return {
      accessToken: this.generateAccessToken(userId, role),
      refreshToken: this.generateRefreshToken(userId)
    };
  }
}
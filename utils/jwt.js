import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt.js";

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role, type: "access" }, JWT_CONFIG.JWT_SECRET, {
    expiresIn: JWT_CONFIG.JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: "refresh" }, JWT_CONFIG.JWT_SECRET, {
    expiresIn: JWT_CONFIG.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.JWT_SECRET);
};

export const generateTokenPair = (userId, role) => {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId),
  };
};

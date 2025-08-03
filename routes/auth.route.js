import express from "express";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middleware/auth";
import { ValidationMiddleware } from "../middleware/validation";

export const router = express.Router();

router.post('/register', 
  ValidationMiddleware.validateRegistration(),
  AuthController.register
);

router.post('/login', 
  ValidationMiddleware.validateLogin(),
  AuthController.login
);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', 
  AuthMiddleware.authenticate,
  AuthController.logout
);

router.get('/profile', 
  AuthMiddleware.authenticate,
  AuthController.getProfile
);


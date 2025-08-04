import express from "express";
import { 
  registerUser, 
  loginUser, 
  refreshUserToken, 
  logoutUser, 
  getUserProfile 
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validateRegistration, validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post('/register', 
  validateRegistration(),
  registerUser
);

router.post('/login', 
  validateLogin(),
  loginUser
);

router.post('/refresh-token', refreshUserToken);

router.post('/logout', 
  authenticate,
  logoutUser
);

router.get('/profile', 
  authenticate,
  getUserProfile
);

export default router;
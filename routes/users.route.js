import express from "express";
import { AuthMiddleware } from "../middleware/auth";
import { UserController } from "../controllers/userController";
import { ROLES } from "../constants/roles";

export const router = express.Router();

// All routes require authentication
router.use(AuthMiddleware.authenticate);

router.get('/', 
  AuthMiddleware.authorizeHierarchy(ROLES.ADMIN),
  UserController.getAllUsers
);

router.put('/:userId/role', 
  AuthMiddleware.authorize(ROLES.SUPERADMIN),
  UserController.updateUserRole
);

router.put('/:userId/deactivate', 
  AuthMiddleware.authorizeHierarchy(ROLES.ADMIN),
  UserController.deactivateUser
);
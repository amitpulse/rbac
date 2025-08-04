import express from "express";
import { authenticate, authorize, authorizeHierarchy } from "../middleware/auth.js";
import { 
  getAllUsersController, 
  updateUserRoleController, 
  deactivateUserController 
} from "../controllers/userController.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', 
  authorizeHierarchy(ROLES.ADMIN),
  getAllUsersController
);

router.put('/:userId/role', 
  authorize(ROLES.SUPERADMIN),
  updateUserRoleController
);

router.put('/:userId/deactivate', 
  authorizeHierarchy(ROLES.ADMIN),
  deactivateUserController
);

export default router;
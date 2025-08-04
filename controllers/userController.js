import { getAllUsers, updateUserRole, deactivateUser } from "../services/userService.js";

export const getAllUsersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getAllUsers(req.user, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const user = await updateUserRole(userId, role, req.user);
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateUserController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await deactivateUser(userId, req.user);
    
    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
import { UserService } from "../services/userService";

export class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await UserService.getAllUsers(req.user, parseInt(page), parseInt(limit));
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      const user = await UserService.updateUserRole(userId, role, req.user);
      
      res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await UserService.deactivateUser(userId, req.user);
      
      res.json({
        success: true,
        message: 'User deactivated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}
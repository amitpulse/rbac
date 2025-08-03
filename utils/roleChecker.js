import { ROLE_HIERARCHY } from "../constants/roles";

export class RoleChecker {
  static hasPermission(userRole, requiredRole) {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
  }

  static canModifyUser(modifierRole, targetRole) {
    return ROLE_HIERARCHY[modifierRole] > ROLE_HIERARCHY[targetRole];
  }

  static getAllowedRoles(userRole) {
    const userLevel = ROLE_HIERARCHY[userRole];
    return Object.keys(ROLE_HIERARCHY).filter(role => 
      ROLE_HIERARCHY[role] <= userLevel
    );
  }
}
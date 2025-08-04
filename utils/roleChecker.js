import { ROLE_HIERARCHY } from "../constants/roles.js";

export const hasPermission = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const canModifyUser = (modifierRole, targetRole) => {
  return ROLE_HIERARCHY[modifierRole] > ROLE_HIERARCHY[targetRole];
};

export const getAllowedRoles = (userRole) => {
  const userLevel = ROLE_HIERARCHY[userRole];
  return Object.keys(ROLE_HIERARCHY).filter(role => 
    ROLE_HIERARCHY[role] <= userLevel
  );
};
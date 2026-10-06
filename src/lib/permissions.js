/**
 * Canonical RBAC Role Utilities
 * Authoritative role values: 'super_admin', 'managing_director', 'hr', 'employee'
 * Note: 'designation' is NEVER used for authorization.
 */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGING_DIRECTOR: 'managing_director',
  HR: 'hr',
  EMPLOYEE: 'employee',
};

export const normalizeRole = (role) => (role || '').toLowerCase().trim();

// Presentation helper for UI display
export const formatRoleDisplay = (role) => {
  const norm = normalizeRole(role);
  switch (norm) {
    case ROLES.SUPER_ADMIN:
      return 'Super Admin';
    case ROLES.MANAGING_DIRECTOR:
      return 'Managing Director';
    case ROLES.HR:
      return 'HR';
    case ROLES.EMPLOYEE:
      return 'Employee';
    default:
      return role || 'Employee';
  }
};

// Permission checks
export const canProvisionAccounts = (role) => {
  const norm = normalizeRole(role);
  return norm === ROLES.SUPER_ADMIN || norm === ROLES.HR;
};

export const canManageProjects = (role) => {
  const norm = normalizeRole(role);
  return norm === ROLES.SUPER_ADMIN || norm === ROLES.MANAGING_DIRECTOR;
};

export const canApproveLeaves = (role) => {
  const norm = normalizeRole(role);
  return norm === ROLES.SUPER_ADMIN || norm === ROLES.MANAGING_DIRECTOR || norm === ROLES.HR;
};

export const canViewCompanyAttendance = (role) => {
  const norm = normalizeRole(role);
  return norm === ROLES.SUPER_ADMIN || norm === ROLES.MANAGING_DIRECTOR || norm === ROLES.HR;
};

export const canManageAttendanceActions = (role) => {
  const norm = normalizeRole(role);
  return norm === ROLES.SUPER_ADMIN || norm === ROLES.MANAGING_DIRECTOR || norm === ROLES.HR;
};

export const canManageDirectory = (role) => {
  const norm = normalizeRole(role);
  return norm === ROLES.SUPER_ADMIN || norm === ROLES.MANAGING_DIRECTOR || norm === ROLES.HR;
};

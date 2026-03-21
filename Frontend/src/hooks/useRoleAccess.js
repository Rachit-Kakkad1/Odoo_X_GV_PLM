import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../data/mockData';

/**
 * Custom hook that provides role-based access control flags.
 * Uses the current user from AppContext and maps role to boolean permissions.
 */
export default function useRoleAccess() {
  const { currentUser } = useApp();

  return useMemo(() => {
    const role = currentUser?.role || '';

    const isAdmin = role === ROLES.ADMIN;
    const isEngineer = role === ROLES.ENGINEERING;
    const isApprover = role === ROLES.APPROVER;
    const isOperations = role === ROLES.OPERATIONS;

    return {
      canCreateECO: isEngineer || isAdmin,
      canApproveECO: isApprover || isAdmin,
      canRejectECO: isApprover || isAdmin,
      canViewReports: true,
      canEditSettings: isAdmin,
      canViewAllECOs: true,
      canAssignRoles: isAdmin,
      canEditDraft: isEngineer || isAdmin,
      canManageBoM: isEngineer || isAdmin,
      isAdmin,
      isEngineer,
      isApprover,
      isOperations,
      isReadOnly: isOperations,
      currentRole: role,
      currentUser,
    };
  }, [currentUser]);
}

import { useMemo } from 'react';
import useRoleAccess from '../../hooks/useRoleAccess';

/**
 * RoleGate — Conditionally renders children based on user role.
 * If the user's role is not in allowedRoles, renders the fallback component (or nothing).
 *
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of role strings allowed to see children
 * @param {React.ReactNode} [props.fallback] - Optional fallback UI when access is denied
 * @param {React.ReactNode} props.children - Content to render when access is granted
 */
export default function RoleGate({ allowedRoles = [], fallback = null, children }) {
  const { currentRole } = useRoleAccess();

  const hasAccess = useMemo(() => {
    if (!allowedRoles.length) return true;
    return allowedRoles.some(role =>
      currentRole?.toLowerCase().includes(role.toLowerCase()) ||
      role.toLowerCase().includes('admin') && currentRole === 'Admin'
    );
  }, [allowedRoles, currentRole]);

  if (hasAccess) return children;
  return fallback;
}

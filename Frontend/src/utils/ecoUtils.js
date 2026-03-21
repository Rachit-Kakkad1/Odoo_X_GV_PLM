/**
 * ECO utility functions for the PLM system.
 */

export function getStageBadgeColor(stage) {
  const map = {
    'New':        { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', dot: '#94A3B8' },
    'In Review':  { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', dot: '#3B82F6' },
    'Approval':   { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', dot: '#F59E0B' },
    'Done':       { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', dot: '#10B981' },
    'Rejected':   { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', dot: '#EF4444' },
  };
  return map[stage] || map['New'];
}

export function getPriorityColor(priority) {
  const map = {
    'High':   { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
    'Medium': { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' },
    'Low':    { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
  };
  return map[priority] || map['Medium'];
}

export function getECOsThisMonth(ecos) {
  if (!ecos) return [];
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return ecos.filter(eco => {
    const d = new Date(eco.createdAt);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

export function getApprovedThisMonth(ecos) {
  if (!ecos) return [];
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return ecos.filter(eco => {
    if (eco.stage !== 'Done') return false;
    const approvedLog = eco.approvalLogs?.find(l => l.action === 'Approved' || l.action?.includes('Applied'));
    if (approvedLog) {
      const d = new Date(approvedLog.timestamp);
      return d.getMonth() === month && d.getFullYear() === year;
    }
    const d = new Date(eco.createdAt);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

export function groupECOsByDay(ecos) {
  if (!ecos) return {};
  return ecos.reduce((acc, eco) => {
    const day = eco.createdAt?.slice(0, 10);
    if (!day) return acc;
    if (!acc[day]) acc[day] = [];
    acc[day].push(eco);
    return acc;
  }, {});
}

export function getChangeTypeLabel(changeType) {
  const map = {
    'modified': 'Modified',
    'added':    'Added',
    'removed':  'Removed',
  };
  return map[changeType] || changeType;
}

export function getChangeTypeColor(changeType) {
  const map = {
    'modified': { bg: '#FFF7ED', text: '#C2410C', border: '#F59E0B', badge: '#FDE68A' },
    'added':    { bg: '#F0FDF4', text: '#166534', border: '#10B981', badge: '#A7F3D0' },
    'removed':  { bg: '#FFF1F2', text: '#9F1239', border: '#EF4444', badge: '#FECACA' },
  };
  return map[changeType] || map['modified'];
}

export function calculateCostImpact(oldComponents, newComponents) {
  if (!oldComponents || !newComponents) return { amount: 0, percent: 0 };
  const oldTotal = oldComponents.reduce((s, c) => s + (c.cost || 0) * (c.quantity || 0), 0);
  const newTotal = newComponents.reduce((s, c) => s + (c.cost || 0) * (c.quantity || 0), 0);
  const diff = newTotal - oldTotal;
  const percent = oldTotal > 0 ? ((diff / oldTotal) * 100).toFixed(1) : 0;
  return { amount: diff, percent: Number(percent), oldTotal, newTotal };
}

export function countChangeTypes(changes) {
  if (!changes) return { modified: 0, added: 0, removed: 0 };
  return changes.reduce((acc, c) => {
    const t = c.type || c.changeType || 'modified';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, { modified: 0, added: 0, removed: 0 });
}

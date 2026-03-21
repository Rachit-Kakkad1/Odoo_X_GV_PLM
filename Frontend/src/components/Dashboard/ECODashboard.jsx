import { useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { FileText, Clock, CheckCircle, XCircle, Plus, ArrowRight, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import useAnimatedNumber from '../../hooks/useAnimatedNumber';
import { timeAgo, getLast7Days } from '../../utils/dateUtils';
import { getStageBadgeColor, getApprovedThisMonth, groupECOsByDay } from '../../utils/ecoUtils';

/* ──────────────── Stat Card ──────────────── */
function StatCard({ label, value, icon: Icon, color, trend, delay = 0, pulse = false }) {
  const animatedValue = useAnimatedNumber(value, 1200);
  const colors = {
    teal:  { border: '#0D9488', bg: '#CCFBF1', icon: '#0D9488' },
    amber: { border: '#F59E0B', bg: '#FEF3C7', icon: '#D97706' },
    green: { border: '#10B981', bg: '#D1FAE5', icon: '#059669' },
    red:   { border: '#EF4444', bg: '#FEE2E2', icon: '#DC2626' },
  };
  const c = colors[color] || colors.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      style={{
        background: '#fff', borderRadius: 8, padding: '20px 24px',
        borderLeft: `4px solid ${c.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        cursor: 'default', transition: 'all 150ms ease', flex: '1 1 0',
        minWidth: 200,
      }}
      whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#94A3B8', marginBottom: 6, fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {label}
          </p>
          <p style={{
            fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em',
            lineHeight: 1.1, fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {animatedValue}
          </p>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: pulse && value > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
        }}>
          <Icon size={18} style={{ color: c.icon }} />
        </div>
      </div>
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
          {trend >= 0 ? (
            <TrendingUp size={13} style={{ color: '#10B981' }} />
          ) : (
            <TrendingDown size={13} style={{ color: '#EF4444' }} />
          )}
          <span style={{
            fontSize: 12, fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif',
            color: trend >= 0 ? '#10B981' : '#EF4444',
          }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 2 }}>vs last month</span>
        </div>
      )}
    </motion.div>
  );
}

/* ──────────────── Stage Badge ──────────────── */
function StageBadge({ stage }) {
  const c = getStageBadgeColor(stage);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
      borderRadius: 9999, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text,
      border: `1px solid ${c.border}`, fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />
      {stage}
    </span>
  );
}

/* ──────────────── Custom Tooltip ──────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: '#fff', borderRadius: 10, padding: '12px 16px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: '#64748B' }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────── Main Dashboard ──────────────── */
export default function ECODashboard({ ecos = [], products = [], currentUser = {} }) {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = ecos.length;
    const pending = ecos.filter(e => e.stage === 'In Review' || e.stage === 'Approval').length;
    const approved = getApprovedThisMonth(ecos).length;
    const rejected = ecos.filter(e => e.stage === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [ecos]);

  const chartData = useMemo(() => {
    const days = getLast7Days();
    const grouped = groupECOsByDay(ecos);
    return days.map(d => ({
      name: d.label,
      Created: grouped[d.date]?.length || 0,
      Approved: grouped[d.date]?.filter(e => e.stage === 'Done').length || 0,
      Rejected: grouped[d.date]?.filter(e => e.stage === 'Rejected').length || 0,
    }));
  }, [ecos]);

  const recentEcos = useMemo(() => {
    return [...ecos]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [ecos]);

  const handleRowClick = useCallback((eco) => {
    navigate(`/eco/${eco.id}`);
  }, [navigate]);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Total ECOs" value={stats.total} icon={FileText} color="teal" trend={12} delay={0} />
        <StatCard label="Pending Approval" value={stats.pending} icon={Clock} color="amber" trend={-5} delay={1} pulse />
        <StatCard label="Approved This Month" value={stats.approved} icon={CheckCircle} color="green" trend={25} delay={2} />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="red" trend={0} delay={3} />
      </div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{
          background: '#fff', borderRadius: 8, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              ECO Activity
            </h2>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Last 7 days</p>
          </div>
          <BarChart3 size={18} style={{ color: '#94A3B8' }} />
        </div>
        <div style={{ height: 240, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 500 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false}
                tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 500 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle" iconSize={8}
                wrapperStyle={{ paddingTop: 16, fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              <Bar dataKey="Created" fill="#0D9488" radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={800} />
              <Bar dataKey="Approved" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={800} />
              <Bar dataKey="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent ECOs Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{
          background: '#fff', borderRadius: 8, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          marginBottom: 28,
        }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Recent ECOs
          </h2>
        </div>
        {recentEcos.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <FileText size={40} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>No ECOs yet</p>
            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Create your first Engineering Change Order to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['ECO Number', 'Title', 'Product', 'Stage', 'Created By', 'Time'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 500,
                      letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94A3B8',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEcos.map((eco, idx) => (
                  <motion.tr
                    key={eco.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleRowClick(eco)}
                    style={{
                      borderBottom: '1px solid #F1F5F9', cursor: 'pointer',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#0D9488', fontSize: 12 }}>
                      {eco.ecoNumber}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0F172A', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {eco.title}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>{eco.productName}</td>
                    <td style={{ padding: '12px 16px' }}><StageBadge stage={eco.stage} /></td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>{eco.createdByName}</td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: 12 }}>{timeAgo(eco.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
      >
        <Link to="/eco/create" style={{ textDecoration: 'none', flex: '1 1 auto' }}>
          <button
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: '#0D9488', color: '#fff', border: 'none', cursor: 'pointer',
              transition: 'all 150ms ease', fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.01)'; e.target.style.background = '#0F766E'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#0D9488'; }}
          >
            <Plus size={16} /> Create New ECO
          </button>
        </Link>
        <Link to="/eco" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'transparent', color: '#0F172A', border: '1.5px solid #E2E8F0',
              cursor: 'pointer', transition: 'all 150ms ease', fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => { e.target.style.background = '#F8FAFC'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
          >
            <ArrowRight size={14} /> View All ECOs
          </button>
        </Link>
        <Link to="/reports" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'transparent', color: '#0F172A', border: '1.5px solid #E2E8F0',
              cursor: 'pointer', transition: 'all 150ms ease', fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => { e.target.style.background = '#F8FAFC'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
          >
            <BarChart3 size={14} /> Generate Report
          </button>
        </Link>
      </motion.div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

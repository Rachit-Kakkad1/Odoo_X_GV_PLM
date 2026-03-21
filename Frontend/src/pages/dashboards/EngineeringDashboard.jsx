import { FileText, Clock, GitBranch, Edit2, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { activityTimeline } from '../../data/mockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EngineeringDashboard() {
  const { ecoList } = useApp();

  const myDrafts = ecoList.filter(e => e.stage === 'Draft').length;
  const myPending = ecoList.filter(e => e.stage === 'Approval').length;
  const recentEditedEcos = ecoList.slice(0, 5); // Mocked recently edited

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Engineering Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your ECO drafts and track submissions</p>
      </div>

      {/* Creator Focus Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="My Drafts" value={myDrafts} subtitle="Awaiting submission" icon={Edit2} color="primary" delay={0} />
        <Card title="In Review" value={myPending} subtitle="Pending approval" icon={Clock} color="warning" delay={1} />
        <Card title="Draft New ECO" value="+" subtitle="Start a new change" icon={FileText} onClickPath="/eco/create" color="primary" delay={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1 lg:col-span-2 bg-surface-100 rounded-xl border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-surface-800">My Recent Work</h2>
            <Link to="/eco" className="text-xs text-primary-600 hover:underline">View all drafts</Link>
          </div>
          <div className="divide-y divide-surface-100">
            {recentEditedEcos.map(eco => (
              <Link key={eco.id} to={`/eco/${eco.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-surface-400">{eco.ecoNumber}</span>
                    <StatusBadge status={eco.type} />
                  </div>
                  <p className="text-sm font-medium text-surface-800 truncate">{eco.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={eco.stage} />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

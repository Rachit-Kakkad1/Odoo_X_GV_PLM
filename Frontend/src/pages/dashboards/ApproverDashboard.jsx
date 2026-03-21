import { Inbox, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ApproverDashboard() {
  const { ecoList } = useApp();

  const pendingApprovals = ecoList.filter(e => e.stage === 'Approval');
  const urgentApprovals = pendingApprovals.filter(e => e.priority === 'High');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Approvals Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">Review and sign off on pending Engineering Change Orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Pending Review" value={pendingApprovals.length} subtitle="Awaiting your signature" icon={Inbox} color="primary" delay={0} />
        <Card title="Urgent Actions" value={urgentApprovals.length} subtitle="High priority ECOs" icon={AlertTriangle} color="danger" delay={1} />
        <Card title="Completed Today" value="0" subtitle="Recently approved" icon={CheckCircle} color="success" delay={2} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface-100 rounded-xl border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-surface-800">ECOs Assigned to Me</h2>
        </div>
        <div className="divide-y divide-surface-100">
          {pendingApprovals.length > 0 ? pendingApprovals.map(eco => (
            <Link key={eco.id} to={`/eco/${eco.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-surface-400">{eco.ecoNumber}</span>
                  {eco.priority === 'High' && <span className="text-[10px] bg-danger-100 text-danger-700 px-1.5 py-0.5 rounded font-bold uppercase">Urgent</span>}
                </div>
                <p className="text-sm font-medium text-surface-800 truncate">{eco.title}</p>
                <p className="text-xs text-surface-400 mt-0.5">Submitted by {eco.createdByName}</p>
              </div>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg shadow-sm">
                Review Diff
              </button>
            </Link>
          )) : (
            <div className="px-6 py-12 text-center">
              <CheckCircle size={32} className="mx-auto text-success-400 mb-3" />
              <p className="text-surface-500 font-medium">You're all caught up!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

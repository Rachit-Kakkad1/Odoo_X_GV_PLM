import { Users, ShieldCheck, GitMerge, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { users } from '../../data/mockData';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-800 tracking-tight">System Control Panel</h1>
        <p className="text-sm text-surface-500 mt-1">Manage users, security, and global workflows</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Active Users" value={users.length} subtitle="Across 4 roles" icon={Users} color="primary" delay={0} />
        <Card title="Approval Rules" value="12" subtitle="Active conditions" icon={ShieldCheck} color="success" delay={1} />
        <Card title="ECO Stages" value="5" subtitle="Workflow steps" icon={GitMerge} color="purple" delay={2} />
        <Card title="System Health" value="99.9%" subtitle="Uptime" icon={Activity} color="surface" delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface-100 rounded-xl border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-surface-800">User Management Overview</h2>
          </div>
          <div className="divide-y divide-surface-100">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{user.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">{user.name}</p>
                    <p className="text-xs text-surface-500">{user.email}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-surface-100 text-surface-700 text-xs font-bold rounded border border-surface-200">{user.role}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

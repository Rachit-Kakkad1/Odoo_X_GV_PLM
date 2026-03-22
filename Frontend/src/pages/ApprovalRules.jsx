import { ShieldCheck, Plus, CheckCircle, XCircle, Trash2, Edit2, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function ApprovalRules() {
  const { t } = useTranslation();
  const { approvalRulesList, addApprovalRule, updateApprovalRule, deleteApprovalRule } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    conditions: '',
    requiredRole: 'Engineering User',
    stage: 'In Review',
    status: 'Active'
  });

  const handleOpenModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        conditions: rule.conditions,
        requiredRole: rule.requiredRole || rule.required_role,
        stage: rule.stage,
        status: rule.status
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        conditions: '',
        requiredRole: 'Engineering User',
        stage: 'In Review',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRule) {
      const res = await updateApprovalRule(editingRule.id, formData);
      if (res.success) toast.success(t('admin.rule_updated', 'Rule updated successfully'));
    } else {
      const res = await addApprovalRule(formData);
      if (res.success) toast.success(t('admin.rule_created', 'Rule created successfully'));
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (rule) => {
    const newStatus = rule.status === 'Active' ? 'Inactive' : 'Active';
    const res = await updateApprovalRule(rule.id, { status: newStatus });
    if (res.success) toast.success(`${t('admin.rule', 'Rule')} ${newStatus}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirm_delete_rule', 'Are you sure you want to delete this rule?'))) {
      const res = await deleteApprovalRule(id);
      if (res.success) toast.success(t('admin.rule_deleted', 'Rule deleted successfully'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-800 tracking-tight">{t('admin.approval_rules', 'Approval Rules')}</h1>
          <p className="text-sm text-surface-500 mt-1">{t('admin.approval_rules_desc', 'Manage conditional logic for ECO routing and required signatures')}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition shadow-sm"
        >
          <Plus size={16} /> {t('actions.add_rule', 'Add Rule')}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {approvalRulesList.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-surface-50 rounded-2xl border-2 border-dashed border-surface-200">
            <div className="mx-auto w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} className="text-surface-300" />
            </div>
            <h3 className="text-sm font-semibold text-surface-700">{t('admin.no_rules', 'No active approval rules.')}</h3>
            <p className="text-xs text-surface-400 mt-1">{t('admin.create_first_rule', 'Click "Add Rule" to define your first logic path.')}</p>
          </div>
        ) : (
          approvalRulesList.map(rule => (
            <div key={rule.id} className={`bg-white rounded-xl border p-5 shadow-sm transition-all relative flex flex-col h-full ${rule.status === 'Active' ? 'border-surface-200 hover:border-primary-300' : 'border-surface-100 opacity-75 grayscale-[0.5]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${rule.status === 'Active' ? 'bg-primary-50 text-primary-600' : 'bg-surface-100 text-surface-400'}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-surface-800">{rule.name}</h3>
                </div>
                {rule.status === 'Active' ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-success-600 bg-success-50 px-2 py-0.5 rounded-full ring-1 ring-inset ring-success-500/20">
                    <CheckCircle size={10} /> {t('admin.active', 'ACTIVE')}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full ring-1 ring-inset ring-surface-500/10">
                    <XCircle size={10} /> {t('admin.inactive', 'INACTIVE')}
                  </div>
                )}
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-surface-400 mb-1.5">{t('admin.condition', 'Condition')}</p>
                  <p className="text-xs font-mono text-primary-700 bg-primary-50/50 border border-primary-100 px-2 py-1.5 rounded-lg inline-block w-full">{rule.conditions}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-surface-400 mb-1">{t('admin.required_role', 'Required Role')}</p>
                    <p className="text-xs font-medium text-surface-700">{rule.requiredRole || rule.required_role}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-surface-400 mb-1">{t('admin.applies_stage', 'Applies at Stage')}</p>
                    <p className="text-xs font-medium text-surface-700">{rule.stage}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-surface-100 flex gap-2">
                <button 
                  onClick={() => handleOpenModal(rule)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-surface-600 bg-surface-50 hover:bg-surface-100 rounded-lg transition-colors border border-surface-200"
                >
                  <Edit2 size={14} /> {t('actions.edit', 'Edit')}
                </button>
                <button 
                  onClick={() => handleToggleStatus(rule)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${
                    rule.status === 'Active' 
                    ? 'text-danger-600 bg-danger-50 border-danger-100 hover:bg-danger-100' 
                    : 'text-success-600 bg-success-50 border-success-100 hover:bg-success-100'
                  }`}
                >
                  {rule.status === 'Active' ? t('actions.disable', 'Disable') : t('actions.enable', 'Enable')}
                </button>
                <button 
                  onClick={() => handleDelete(rule.id)}
                  className="p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors border border-transparent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                <h2 className="text-lg font-bold text-surface-800">
                  {editingRule ? t('actions.edit_rule', 'Edit Approval Rule') : t('actions.add_rule', 'Add New Rule')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-full transition-colors text-surface-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5">{t('admin.rule_name', 'Rule Name')}</label>
                  <input 
                    type="text" required
                    placeholder="e.g., High Priority Software Review"
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider">{t('admin.logic_condition', 'Logic Condition')}</label>
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-bold">
                      <Info size={10} /> {t('admin.syntax_help', 'SQL Syntax')}
                    </span>
                  </div>
                  <textarea 
                    required rows={2}
                    placeholder="e.g., Priority = High AND Category = Electronics"
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm font-mono focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all resize-none"
                    value={formData.conditions}
                    onChange={e => setFormData({...formData, conditions: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5">{t('admin.assign_role', 'Assign to Role')}</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 appearance-none"
                      value={formData.requiredRole}
                      onChange={e => setFormData({...formData, requiredRole: e.target.value})}
                    >
                      <option value="Engineering User">Engineering User</option>
                      <option value="Approver">Approver</option>
                      <option value="Operations User">Operations User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-1.5">{t('admin.trigger_stage', 'Trigger at Stage')}</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 appearance-none"
                      value={formData.stage}
                      onChange={e => setFormData({...formData, stage: e.target.value})}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Approval">Approval</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200"
                  >
                    {editingRule ? t('actions.save_changes', 'Save Changes') : t('actions.create_rule', 'Create Rule')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-surface-100 text-surface-600 font-bold rounded-xl hover:bg-surface-200 transition"
                  >
                    {t('actions.cancel', 'Cancel')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

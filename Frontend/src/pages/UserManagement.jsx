import { useState, useMemo } from 'react';
import { Search, UserPlus, Shield, Mail, Filter, CheckCircle, X, Check } from 'lucide-react';
import { users as initialUsers, ROLES } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement() {
  const [localUsers, setLocalUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: ROLES.ENGINEERING, status: 'Active' });
  
  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Derived state for filtering
  const filteredUsers = useMemo(() => {
    return localUsers.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'All' || user.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [localUsers, searchQuery, roleFilter]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      console.log('Editing user:', user);
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role, status: 'Active' });
    } else {
      console.log('Adding new user');
      setEditingUser(null);
      setFormData({ name: '', email: '', role: ROLES.ENGINEERING, status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Auto-generate avatar from initials
    const avatar = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    if (editingUser) {
      setLocalUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData, avatar } : u));
      showToast('User updated successfully');
    } else {
      const newUser = {
        id: `u${Date.now()}`,
        ...formData,
        avatar
      };
      setLocalUsers(prev => [...prev, newUser]);
      showToast('New user added successfully');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-800 tracking-tight">User Management</h1>
          <p className="text-sm text-surface-500 mt-1">Manage system access, roles, and permissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition"
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-100 rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-surface-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-50 relative">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm text-surface-700 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400" 
            />
          </div>
          <div className="relative flex-shrink-0">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg transition text-sm font-medium ${isFilterOpen || roleFilter !== 'All' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'}`}
            >
              <Filter size={16} /> Filter {roleFilter !== 'All' && '(1)'}
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-surface-200 shadow-lg rounded-lg py-2 z-10">
                <p className="px-3 py-1 text-xs font-semibold text-surface-400 uppercase">Role</p>
                {['All', ...Object.values(ROLES)].map(role => (
                  <button
                    key={role}
                    onClick={() => { setRoleFilter(role); setIsFilterOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center justify-between"
                  >
                    {role}
                    {roleFilter === role && <Check size={14} className="text-primary-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200">
                <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-surface-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs flex-shrink-0">{user.avatar}</div>
                        <div>
                          <p className="text-sm font-medium text-surface-800">{user.name}</p>
                          <div className="flex items-center gap-1 text-xs text-surface-400 mt-0.5"><Mail size={12}/> {user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-surface-600">
                        <Shield size={14} className="text-primary-500"/> {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${user.status === 'Inactive' ? 'bg-surface-50 text-surface-500 border-surface-200' : 'bg-success-50 text-success-700 border-success-200'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-900/40 z-40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 border border-surface-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-surface-800">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-surface-400 hover:bg-surface-50 p-1 rounded">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400" placeholder="e.g. john@plm.io" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">System Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-400 flex-1">
                    {Object.values(ROLES).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-400 flex-1">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-surface-600 bg-surface-50 hover:bg-surface-100 rounded-lg transition">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition">{editingUser ? 'Save Changes' : 'Create User'}</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-surface-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 pointer-events-none"
          >
            <CheckCircle size={18} className="text-success-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

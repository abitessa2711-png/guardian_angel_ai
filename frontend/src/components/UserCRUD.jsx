import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, X, Shield, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserCRUD({ users, onRefresh }) {
  const { getAuthHeaders, apiBase, user: loggedInUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'SECURITY_OFFICER',
    password: '',
    is_active: true
  });
  const [error, setError] = useState(null);

  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      role: 'SECURITY_OFFICER',
      password: '',
      is_active: true
    });
    setError(null);
    setIsOpen(true);
  };

  const openEditModal = (usr) => {
    setEditingUser(usr);
    setForm({
      name: usr.name,
      email: usr.email,
      role: usr.role,
      password: '', // blank password unless modifying
      is_active: usr.is_active
    });
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validations
    if (!form.name || !form.email || (!editingUser && !form.password)) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const url = editingUser 
        ? `${apiBase}/users/${editingUser.id}` 
        : `${apiBase}/users/`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      // Filter payload payload
      const payload = {
        name: form.name,
        role: form.role,
        is_active: form.is_active
      };
      
      if (!editingUser) {
        payload.email = form.email;
        payload.password = form.password;
      } else if (form.password) {
        payload.password = form.password; // only send if they entered a new password
      }

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to save user account.');
      }

      setIsOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (userId === loggedInUser.id) {
      alert("Self-deletion of administrator credentials is block-listed.");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;
    setError(null);

    try {
      const response = await fetch(`${apiBase}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete user account.');
      }

      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-6 font-mono select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase flex items-center space-x-2">
            <Users className="h-5 w-5 text-surveillance-accent" />
            <span>OPERATOR MANAGEMENT REGISTER</span>
          </h3>
          <p className="text-3xs text-surveillance-textMuted mt-1">
            CONTROL ROOM USERS AND ACCESS PERMISSIONS
          </p>
        </div>

        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-surveillance-accent hover:bg-sky-600 text-white px-3 py-2 rounded text-xs cursor-pointer transition-all shadow-glow-cyan"
        >
          <Plus className="h-4 w-4" />
          <span>ADD NEW OPERATOR</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-surveillance-danger/10 border border-surveillance-danger/30 rounded flex items-center space-x-2 text-surveillance-danger text-xs animate-shake">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-2xs">
          <thead>
            <tr className="border-b border-surveillance-border text-surveillance-textMuted">
              <th className="py-3 px-4 font-semibold uppercase">ID</th>
              <th className="py-3 px-4 font-semibold uppercase">FULL NAME</th>
              <th className="py-3 px-4 font-semibold uppercase">EMAIL ADDRESS</th>
              <th className="py-3 px-4 font-semibold uppercase">PRIVILEGES ROLE</th>
              <th className="py-3 px-4 font-semibold uppercase">ACCOUNT STATUS</th>
              <th className="py-3 px-4 font-semibold uppercase text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surveillance-border/50 text-white">
            {users.map((usr) => (
              <tr key={usr.id} className="hover:bg-surveillance-header/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-surveillance-textMuted">#{usr.id}</td>
                <td className="py-3.5 px-4 font-bold">{usr.name}</td>
                <td className="py-3.5 px-4 select-all text-slate-300">{usr.email}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-3xs font-bold ${
                    usr.role === 'ADMIN' 
                      ? 'bg-surveillance-danger/15 text-surveillance-danger' 
                      : 'bg-surveillance-accent/15 text-surveillance-accent'
                  }`}>
                    {usr.role === 'ADMIN' ? <ShieldAlert className="h-3 w-3 mr-0.5" /> : <Shield className="h-3 w-3 mr-0.5" />}
                    <span>{usr.role}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                    usr.is_active 
                      ? 'bg-surveillance-success/15 text-surveillance-success' 
                      : 'bg-surveillance-danger/15 text-surveillance-danger'
                  }`}>
                    {usr.is_active ? 'ENABLED' : 'DISABLED'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button 
                    onClick={() => openEditModal(usr)}
                    className="p-1.5 hover:bg-surveillance-border text-surveillance-accent hover:text-white rounded cursor-pointer transition-all inline-block"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(usr.id)}
                    disabled={usr.id === loggedInUser.id}
                    className={`p-1.5 rounded cursor-pointer transition-all inline-block ${
                      usr.id === loggedInUser.id 
                        ? 'opacity-30 cursor-not-allowed text-gray-600' 
                        : 'hover:bg-surveillance-danger/20 text-surveillance-danger hover:text-white'
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operator Add/Edit Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-surveillance-panel border border-surveillance-border rounded-lg max-w-md w-full flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="bg-surveillance-header border-b border-surveillance-border px-6 py-4 flex justify-between items-center">
              <h4 className="text-sm font-bold text-white uppercase">
                {editingUser ? 'MODIFY OPERATOR SETTINGS' : 'CREATE NEW CONTROL OPERATOR'}
              </h4>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-surveillance-textMuted hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-surveillance-textMuted">FULL NAME *</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Sub-Inspector A. Abinaya"
                  className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-surveillance-textMuted">EMAIL ADDRESS *</label>
                <input 
                  type="email" 
                  value={form.email}
                  disabled={!!editingUser}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="name@tnpolice.gov.in"
                  className={`w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent ${
                    editingUser ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-surveillance-textMuted">
                  {editingUser ? 'NEW PASSWORD (OPTIONAL)' : 'SECURITY PASSWORD *'}
                </label>
                <input 
                  type="password" 
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder={editingUser ? 'Leave blank to preserve password' : 'Enter strong password'}
                  className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-surveillance-textMuted">CONTROL ROOM ROLE</label>
                  <select 
                    value={form.role}
                    onChange={(e) => setForm({...form, role: e.target.value})}
                    className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                  >
                    <option value="SECURITY_OFFICER">SECURITY OFFICER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-surveillance-textMuted">ACCOUNT ACCESSIBILITY</label>
                  <select 
                    value={form.is_active ? 'true' : 'false'}
                    onChange={(e) => setForm({...form, is_active: e.target.value === 'true'})}
                    className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                  >
                    <option value="true">ENABLED (ACTIVE)</option>
                    <option value="false">DISABLED (LOCKED)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surveillance-header border-t border-surveillance-border px-6 py-4 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white px-4 py-2 rounded cursor-pointer"
              >
                CANCEL
              </button>
              <button 
                type="submit"
                className="bg-surveillance-accent hover:bg-sky-600 text-white px-5 py-2 rounded cursor-pointer shadow-glow-cyan"
              >
                SAVE OPERATOR
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

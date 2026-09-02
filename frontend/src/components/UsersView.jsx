import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Lock, 
  Mail, 
  Key, 
  CheckCircle, 
  Edit, 
  Trash2,
  X,
  History
} from 'lucide-react';

export const INITIAL_USERS = [
  {
    id: 'USR-01',
    name: 'Inspector R. Rajesh',
    email: 'admin@trichypolice.gov.in',
    badgeId: 'TN-POL-4412',
    role: 'Duty Commander',
    station: 'Central Control Room',
    status: 'Active',
    lastLogin: 'Today, 11:24 AM'
  },
  {
    id: 'USR-02',
    name: 'Sub-Inspector M. Vijay',
    email: 'm.vijay@trichypolice.gov.in',
    badgeId: 'TN-POL-5120',
    role: 'Field Dispatcher',
    station: 'Srirangam Division',
    status: 'Active',
    lastLogin: 'Today, 10:45 AM'
  },
  {
    id: 'USR-03',
    name: 'Forensic Analyst Dr. Priya S.',
    email: 'p.priya@trichypolice.gov.in',
    badgeId: 'TN-CYBER-102',
    role: 'Forensic Analyst',
    station: 'Cyber Forensic Cell',
    status: 'Active',
    lastLogin: 'Yesterday, 04:12 PM'
  },
  {
    id: 'USR-04',
    name: 'Traffic SI K. Arul',
    email: 'k.arul@trichypolice.gov.in',
    badgeId: 'TN-TRF-3301',
    role: 'Traffic Officer',
    station: 'Highway Patrol Sector 4',
    status: 'Active',
    lastLogin: 'Today, 09:15 AM'
  },
  {
    id: 'USR-05',
    name: 'Beat Constable S. Selvam',
    email: 's.selvam@trichypolice.gov.in',
    badgeId: 'TN-BEAT-8821',
    role: 'Field Dispatcher',
    station: 'Gandhi Market Post',
    status: 'Active',
    lastLogin: 'Today, 11:05 AM'
  }
];

export const USER_AUDIT_LOGS = [
  { time: '11:23:45 AM', user: 'Inspector R. Rajesh', action: 'Verified evidence snapshot EVD-9920 and approved highway patrol dispatch.' },
  { time: '11:22:15 AM', user: 'Sub-Inspector M. Vijay', action: 'Accepted dispatch assignment INC-2025-089 for Srirangam Temple South Gate.' },
  { time: '11:15:30 AM', user: 'Dr. Priya S.', action: 'Exported chain of custody certificate for case dossier GA-TRICHY-2025/05/15.' },
  { time: '10:50:12 AM', user: 'Inspector R. Rajesh', action: 'Modified AI facial distress confidence sensitivity to 85%.' },
];

export default function UsersView() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'audit'

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newRole, setNewRole] = useState('Field Dispatcher');
  const [newStation, setNewStation] = useState('Central Command');

  const filtered = users.filter(u => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) ||
             u.email.toLowerCase().includes(q) ||
             u.badgeId.toLowerCase().includes(q) ||
             u.role.toLowerCase().includes(q) ||
             u.station.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newBadge) return;

    const newUser = {
      id: `USR-0${users.length + 1}`,
      name: newName,
      email: newEmail,
      badgeId: newBadge,
      role: newRole,
      station: newStation,
      status: 'Active',
      lastLogin: 'Never'
    };

    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewBadge('');
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Authorized Personnel & Role-Based Access Control</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Government officer credentials, security clearance levels, and operational audit logs.</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'directory' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Officer Directory
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'audit' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Activity Log
            </button>
          </div>

          {activeTab === 'directory' && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Officer</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'directory' ? (
        <>
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search officer name, police badge ID, official email, station..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-4">Officer Name</th>
                    <th className="py-2.5 px-4">Badge / Cyber ID</th>
                    <th className="py-2.5 px-4">Official Email</th>
                    <th className="py-2.5 px-3">Clearance Role</th>
                    <th className="py-2.5 px-3">Division Station</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-4">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {user.badgeId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {user.email}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'Duty Commander' 
                            ? 'bg-blue-100 text-blue-800' 
                            : user.role === 'Forensic Analyst'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {user.station}
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{user.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {user.lastLogin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Audit Activity Log */
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Immutable Security Audit Trail (Section 43A IT Act)</span>
          </h4>
          <div className="divide-y divide-slate-100">
            {USER_AUDIT_LOGS.map((log, idx) => (
              <div key={idx} className="py-2.5 flex items-start space-x-3 text-xs">
                <span className="font-mono text-slate-400 font-semibold shrink-0 pt-0.5">{log.time}</span>
                <div className="flex-1">
                  <span className="font-bold text-slate-900 mr-2">{log.user}:</span>
                  <span className="text-slate-700">{log.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Provision Authorized Personnel</h4>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Officer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sub-Inspector R. Ramesh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge / Cyber ID</label>
                  <input 
                    type="text" 
                    placeholder="TN-POL-9921"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Security Role</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Duty Commander">Duty Commander</option>
                    <option value="Field Dispatcher">Field Dispatcher</option>
                    <option value="Forensic Analyst">Forensic Analyst</option>
                    <option value="Traffic Officer">Traffic Officer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@trichypolice.gov.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Station / Command Ward</label>
                <input 
                  type="text" 
                  placeholder="e.g. Central Command / Sector 1"
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
                >
                  Create Officer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import type { Database } from '../../types/database.types';

type Profile = Database['public']['Tables']['profile_studio']['Row'];
type Role = Profile['role'];

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile_studio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string) => {
    if (!selectedRole) return;
    
    try {
      // @ts-expect-error - role update type mismatch
      const { error } = await supabase
        .from('profile_studio')
        .update({ role: selectedRole as Role })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: selectedRole as Role } : u));
      setEditingUserId(null);
      setSelectedRole('');
    } catch (err: any) {
      alert(`Failed to update role: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
          User Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">Manage user roles and permissions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading...</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{user.full_name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1" title={user.id}>{user.id.slice(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  {editingUserId === user.id ? (
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      className="border border-slate-300 rounded-md p-1 text-sm bg-white"
                    >
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="doctor">Doctor</option>
                      <option value="kid">Kid</option>
                    </select>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-bold uppercase">
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingUserId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleUpdateRole(user.id)} className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"><FiCheck /></button>
                      <button onClick={() => setEditingUserId(null)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><FiX /></button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setEditingUserId(user.id); setSelectedRole(user.role); }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <FiEdit2 />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

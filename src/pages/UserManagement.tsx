import { useState } from 'react';
import { Trash2, Edit, Check, X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive';
  joinedDate: string;
}

const MOCK_USERS: User[] = [
  { id: '1', email: 'bishop@vessel.com', role: 'admin', status: 'active', joinedDate: '2025-01-01' },
  { id: '2', email: 'member@vessel.com', role: 'member', status: 'active', joinedDate: '2025-01-02' },
  { id: '3', email: 'newbie@vessel.com', role: 'member', status: 'inactive', joinedDate: '2025-01-10' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm(user);
  };

  const saveEdit = () => {
    setUsers(users.map(u => u.id === editingId ? { ...u, ...editForm } : u));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-montserrat font-bold text-gray-800">User Management</h1>
        <button className="px-4 py-2 bg-primary-blue text-white rounded hover:bg-blue-700">
            Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                {editingId === user.id ? (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <input
                                className="border rounded px-2 py-1 w-full"
                                value={editForm.email}
                                onChange={e => setEditForm({...editForm, email: e.target.value})}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <select
                                className="border rounded px-2 py-1"
                                value={editForm.role}
                                onChange={e => setEditForm({...editForm, role: e.target.value as 'member' | 'admin'})}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <select
                                className="border rounded px-2 py-1"
                                value={editForm.status}
                                onChange={e => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.joinedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={saveEdit} className="text-green-600 hover:text-green-900 mr-2"><Check size={20} /></button>
                            <button onClick={cancelEdit} className="text-red-600 hover:text-red-900"><X size={20} /></button>
                        </td>
                    </>
                ) : (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.joinedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => startEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                        </td>
                    </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

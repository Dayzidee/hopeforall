import { useState, useEffect } from 'react';
import { Trash2, Shield, Crown } from 'lucide-react';
import { db, COLLECTIONS } from '../services/db';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface User {
  id: string; // firestore uid
  email: string;
  displayName?: string;
  role: 'member' | 'admin';
  tier?: 'vessel' | 'golden_vessel'; // optional in schema, default to vessel
  status?: 'active' | 'inactive'; // optional, maybe not used yet
  createdAt?: any;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Real-time listener for users
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      const userList: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as User;
        // Ensure id is present or fallback to doc.id
        userList.push({ ...data, id: doc.id });
      });
      setUsers(userList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you completely delete this user profile? Only do this if the user is also deleted from Auth.')) {
      try {
        await deleteDoc(doc(db, COLLECTIONS.USERS, id));
      } catch (e) {
        alert("Error deleting: " + e);
      }
    }
  };



  const toggleAdmin = async (user: User) => {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    if (confirm(`Change role for ${user.email} to ${newRole}?`)) {
      await updateDoc(doc(db, COLLECTIONS.USERS, user.id), { role: newRole });
    }
  }

  const togglePremium = async (user: User) => {
    const newTier = user.tier === 'golden_vessel' ? 'vessel' : 'golden_vessel';
    if (confirm(`Change tier for ${user.email} to ${newTier === 'golden_vessel' ? 'Golden Vessel' : 'Standard Vessel'}?`)) {
      await updateDoc(doc(db, COLLECTIONS.USERS, user.id), { tier: newTier });
    }
  }

  if (loading) return <div>Loading Users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-montserrat font-bold text-gray-800">User Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{user.displayName || 'No Name'}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <span className="text-xs text-gray-400 font-mono">{user.id}</span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAdmin(user)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {user.role === 'admin' && <Shield size={12} />}
                    {user.role}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => togglePremium(user)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${user.tier === 'golden_vessel' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    {user.tier === 'golden_vessel' && <Crown size={12} />}
                    {user.tier === 'golden_vessel' ? 'Golden' : 'Standard'}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all" title="Delete Profile">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found in database.</div>}
      </div>
    </div>
  );
}

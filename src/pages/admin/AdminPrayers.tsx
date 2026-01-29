import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../../services/db';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Trash2 } from 'lucide-react';

export default function AdminPrayers() {
    const [prayers, setPrayers] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, COLLECTIONS.PRAYERS), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrayers(fetched);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this prayer request?")) return;
        await deleteDoc(doc(db, COLLECTIONS.PRAYERS, id));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-neutral-800">Prayer Requests</h1>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Author</th>
                            <th className="p-4">Content</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {prayers.map(prayer => (
                            <tr key={prayer.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="p-4 font-medium text-neutral-800">
                                    {prayer.authorName} <br />
                                    <span className="text-xs text-neutral-400">
                                        {prayer.isAnonymous ? '(Anon)' : ''}
                                    </span>
                                </td>
                                <td className="p-4 text-neutral-600 max-w-md truncate" title={prayer.content}>
                                    {prayer.content}
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-600">{prayer.category}</span>
                                </td>
                                <td className="p-4">
                                    {prayer.isPrivate ? (
                                        <span className="text-red-500 font-bold text-xs flex items-center gap-1">Private</span>
                                    ) : (
                                        <span className="text-green-500 font-bold text-xs">Public</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(prayer.id)}
                                        className="text-red-400 hover:text-red-600 p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {prayers.length === 0 && <div className="p-8 text-center text-neutral-400">No prayer requests found.</div>}
            </div>
        </div>
    );
}

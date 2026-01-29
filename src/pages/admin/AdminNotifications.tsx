import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../../services/db';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminNotifications() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'info' | 'alert' | 'success'>('info');
    const [submitting, setSubmitting] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(0);

    // Fetch history
    useEffect(() => {
        const fetchHistory = async () => {
            const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchHistory();
    }, [refresh]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
                title,
                message,
                type,
                createdAt: serverTimestamp(),
                createdBy: user?.uid
            });

            setTitle('');
            setMessage('');
            setRefresh(prev => prev + 1);
            alert("Notification Sent!");
        } catch (error) {
            console.error("Error sending notification:", error);
            alert("Failed to send.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id));
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-montserrat text-gray-800">Global Notifications</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compose Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Send size={20} className="text-primary" />
                        Compose Announcement
                    </h2>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="e.g. Sunday Service Time Change"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="info"
                                        checked={type === 'info'}
                                        onChange={() => setType('info')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">Info</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="alert"
                                        checked={type === 'alert'}
                                        onChange={() => setType('alert')}
                                        className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">Alert</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="success"
                                        checked={type === 'success'}
                                        onChange={() => setType('success')}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">Success</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={4}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                placeholder="Type your announcement here..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Sending...' : 'Send to All Users'}
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-gray-500" />
                        Recent History
                    </h2>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {history.length > 0 ? (
                            history.map(item => (
                                <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${item.type === 'alert' ? 'bg-red-100 text-red-700' :
                                                item.type === 'success' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{item.message}</p>
                                    <p className="text-xs text-gray-400">
                                        Sent: {item.createdAt?.toDate().toLocaleDateString()}
                                    </p>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-10">No notifications sent yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import { db, COLLECTIONS } from '../../services/db';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Trash2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminChat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(collection(db, COLLECTIONS.MESSAGES), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        await addDoc(collection(db, COLLECTIONS.MESSAGES), {
            text: input,
            user: "Admin",
            userId: user?.uid || 'admin',
            isAdmin: true,
            createdAt: serverTimestamp(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setInput('');
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden animate-fade-in">
            <div className="p-4 bg-neutral-900 text-white flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Community Chat Moderation</h1>
                    <p className="text-xs text-neutral-400">View and manage live chat</p>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-neutral-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 group ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                        <div className={`p-4 rounded-xl max-w-xl shadow-sm ${msg.isAdmin ? 'bg-black text-white' : 'bg-white text-neutral-800'}`}>
                            <div className="flex justify-between items-start gap-4 mb-1">
                                <span className="text-xs font-bold opacity-70">{msg.user}</span>
                                <span className="text-xs opacity-50">{msg.time}</span>
                            </div>
                            <p>{msg.text}</p>
                        </div>

                        {/* Admin Actions */}
                        <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-all self-center"
                            title="Delete Message"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-neutral-200 flex gap-2">
                <input
                    className="flex-grow p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Send an announcement or reply..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="p-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}

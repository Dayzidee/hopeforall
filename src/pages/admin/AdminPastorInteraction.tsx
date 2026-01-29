import { useState, useEffect, useRef } from 'react';
import { db, COLLECTIONS } from '../../services/db';
import { collection, query, orderBy, onSnapshot, serverTimestamp, updateDoc, deleteDoc, doc, arrayUnion } from 'firebase/firestore';
import { Send, MessageSquare, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function AdminPastorInteraction() {
    const { userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'list' | 'chat'>('list');
    const [interactions, setInteractions] = useState<any[]>([]);
    const [currentChat, setCurrentChat] = useState<any>(null);
    const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all');

    // Reply State
    const [reply, setReply] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.PASTOR_INTERACTIONS),
            orderBy('lastMessageAt', 'desc')
        );
        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setInteractions(list);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (activeTab === 'chat' && currentChat) {
            const updated = interactions.find(i => i.id === currentChat.id);
            if (updated) setCurrentChat(updated);
            scrollToBottom();
        }
    }, [interactions, activeTab, currentChat]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const { showToast, showConfirm } = useNotification();

    const handleDelete = (id: string) => {
        showConfirm("Are you sure you want to delete this conversation? This cannot be undone.", async () => {
            try {
                await deleteDoc(doc(db, COLLECTIONS.PASTOR_INTERACTIONS, id));
                showToast("Conversation deleted.", 'success');
                if (currentChat?.id === id) {
                    setCurrentChat(null);
                    setActiveTab('list');
                }
            } catch (error) {
                console.error("Error deleting:", error);
                showToast("Failed to delete conversation.", 'error');
            }
        });
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !currentChat) return;

        try {
            await updateDoc(doc(db, COLLECTIONS.PASTOR_INTERACTIONS, currentChat.id), {
                status: 'replied',
                lastMessageAt: serverTimestamp(),
                messages: arrayUnion({
                    sender: 'admin',
                    adminName: userProfile?.displayName || 'Pastor',
                    text: reply,
                    createdAt: new Date().toISOString()
                })
            });
            setReply('');
        } catch (error) {
            console.error("Error replying:", error);
        }
    };

    const filteredInteractions = interactions.filter(i => {
        if (filter === 'all') return true;
        return i.status === filter;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden h-[calc(100vh-100px)] flex flex-col md:flex-row animate-fade-in">

            {/* Sidebar List */}
            <div className={`w-full md:w-1/3 border-r border-neutral-100 bg-neutral-50 flex flex-col ${activeTab !== 'list' ? 'hidden md:flex' : ''}`}>
                <div className="p-4 border-b border-neutral-200 bg-white">
                    <h2 className="font-bold text-lg mb-2">Inbox</h2>
                    <div className="flex gap-2">
                        {['all', 'new', 'replied'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${filter === f ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {filteredInteractions.length === 0 ? (
                        <div className="p-8 text-center text-neutral-400 text-sm">
                            No messages found.
                        </div>
                    ) : (
                        filteredInteractions.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => { setCurrentChat(chat); setActiveTab('chat'); }}
                                className={`p-4 border-b border-neutral-100 cursor-pointer hover:bg-white transition-colors ${currentChat?.id === chat.id ? 'bg-white border-l-4 border-l-primary-blue' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-neutral-800 truncate text-sm">{chat.userName || 'Anonymous'}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${chat.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                        {chat.status}
                                    </span>
                                </div>
                                <p className="font-bold text-primary-dark text-sm truncate">{chat.subject}</p>
                                <p className="text-xs text-neutral-500 truncate mt-1">
                                    {chat.messages[chat.messages.length - 1]?.text}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow flex flex-col h-full bg-white relative">
                {activeTab === 'chat' && currentChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <button onClick={() => setActiveTab('list')} className="md:hidden text-xs font-bold text-neutral-500 mb-1">&larr; Back</button>
                                <h2 className="font-bold text-lg">{currentChat.subject}</h2>
                                <p className="text-xs text-neutral-500">From: {currentChat.userName}</p>
                            </div>
                            <button onClick={() => handleDelete(currentChat.id)} className="p-2 text-red-500 hover:bg-neutral-50 rounded-lg" title="Delete Conversation">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
                            {currentChat.messages.map((msg: any, idx: number) => (
                                <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.sender === 'admin' ? 'bg-black text-white rounded-br-none' : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-none'}`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-2 opacity-60 ${msg.sender === 'admin' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                                            {msg.adminName ? `${msg.adminName} • ` : ''}{new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleReply} className="p-4 bg-white border-t border-neutral-100 flex gap-3">
                            <input
                                className="flex-grow p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Type a reply..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                            <button type="submit" className="p-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-neutral-300">
                        <MessageSquare size={64} className="mb-4 opacity-50" />
                        <p className="font-bold">Select a conversation to moderate</p>
                    </div>
                )}
            </div>
        </div>
    );
}

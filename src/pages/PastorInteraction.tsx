import React, { useState, useEffect, useRef } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Plus, Check } from 'lucide-react';

export default function PastorInteraction() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'new' | 'chat'>('list');
  const [interactions, setInteractions] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);

  // New Thread State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Reply State
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, COLLECTIONS.PASTOR_INTERACTIONS),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Client-side sort to avoid composite index requirement
      list.sort((a: any, b: any) => {
        const tA = a.lastMessageAt?.seconds || 0;
        const tB = b.lastMessageAt?.seconds || 0;
        return tB - tA;
      });
      setInteractions(list);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'chat' && currentChat) {
      // Keep current chat updated from the list
      const updated = interactions.find(i => i.id === currentChat.id);
      if (updated) setCurrentChat(updated);
      scrollToBottom();
    }
  }, [interactions, activeTab, currentChat]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    try {
      await addDoc(collection(db, COLLECTIONS.PASTOR_INTERACTIONS), {
        userId: user?.uid,
        userName: userProfile?.displayName || user?.email,
        subject,
        status: 'new',
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messages: [
          {
            sender: 'user',
            text: message,
            createdAt: new Date().toISOString()
          }
        ]
      });
      setSubject('');
      setMessage('');
      // wait a tick for the snapshot to fire
      setTimeout(() => setActiveTab('list'), 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !currentChat) return;

    try {
      await updateDoc(doc(db, COLLECTIONS.PASTOR_INTERACTIONS, currentChat.id), {
        status: 'new', // Re-open or flag as unread for admin
        lastMessageAt: serverTimestamp(),
        messages: arrayUnion({
          sender: 'user',
          text: reply,
          createdAt: new Date().toISOString()
        })
      });
      setReply('');
    } catch (error) {
      console.error("Error replying:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-montserrat font-bold text-primary-blue">Pastor Interaction</h1>
        {activeTab !== 'new' && (
          <button
            onClick={() => setActiveTab('new')}
            className="bg-accent-teal text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-600 transition-colors"
          >
            <Plus size={18} /> New Message
          </button>
        )}
      </div>

      <div className="flex-grow bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden flex flex-col md:flex-row">

        {/* Sidebar List (Visible on mobile if looking at list) */}
        <div className={`w-full md:w-1/3 border-r border-neutral-100 bg-neutral-50 flex flex-col ${activeTab !== 'list' ? 'hidden md:flex' : ''}`}>
          <div className="p-4 border-b border-neutral-200 font-bold text-neutral-500 text-sm">YOUR CONVERSATIONS</div>
          <div className="flex-grow overflow-y-auto">
            {interactions.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-sm">
                No messages yet. Start a conversation!
              </div>
            ) : (
              interactions.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => { setCurrentChat(chat); setActiveTab('chat'); }}
                  className={`p-4 border-b border-neutral-100 cursor-pointer hover:bg-white transition-colors ${currentChat?.id === chat.id ? 'bg-white border-l-4 border-l-primary-blue' : ''}`}
                >
                  <h3 className="font-bold text-neutral-800 truncate">{chat.subject}</h3>
                  <p className="text-xs text-neutral-500 truncate mt-1">
                    {chat.messages[chat.messages.length - 1]?.text}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${chat.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-500'}`}>
                      {chat.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col h-full bg-white relative">

          {activeTab === 'new' && (
            <div className="p-8 max-w-lg mx-auto w-full overflow-y-auto h-full">
              <h2 className="text-xl font-bold mb-6">Start a New Conversation</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Subject</label>
                  <select
                    className="w-full p-3 border rounded-lg bg-neutral-50"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                  >
                    <option value="">Select Topic...</option>
                    <option value="Prayer Request">Prayer Request</option>
                    <option value="Counseling">Counseling</option>
                    <option value="Testimony">Testimony</option>
                    <option value="Question">Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Message</label>
                  <textarea
                    className="w-full p-3 border rounded-lg bg-neutral-50 h-40 resize-none"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="How can we help?"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setActiveTab('list')} className="flex-1 py-3 text-neutral-500 font-bold hover:bg-neutral-50 rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-primary-blue text-white font-bold rounded-lg hover:bg-blue-700">Send</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'chat' && currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
                <div>
                  <button onClick={() => setActiveTab('list')} className="md:hidden text-xs font-bold text-neutral-500 mb-1">&larr; Back</button>
                  <h2 className="font-bold text-lg">{currentChat.subject}</h2>
                </div>
                <span className="text-xs text-neutral-400">ID: {currentChat.id.slice(0, 6)}</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
                {currentChat.messages.map((msg: any, idx: number) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user' ? 'bg-primary-blue text-white rounded-br-none' : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-none'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 opacity-60 ${msg.sender === 'user' ? 'text-blue-100' : 'text-neutral-400'}`}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleReply} className="p-4 bg-white border-t border-neutral-100 flex gap-3">
                <input
                  className="flex-grow p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Type a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button type="submit" className="p-3 bg-accent-teal text-white rounded-lg hover:bg-teal-600 transition-colors">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            activeTab === 'list' && (
              <div className="hidden md:flex flex-col items-center justify-center h-full text-neutral-300">
                <MessageSquare size={64} className="mb-4 opacity-50" />
                <p className="font-bold">Select a conversation to view</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

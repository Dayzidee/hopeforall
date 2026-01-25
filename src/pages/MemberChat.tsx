import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MemberChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, user: "System", text: "Welcome to the community chat!", time: "10:00 AM" },
    { id: 2, user: "Sister Mary", text: "Good morning everyone! Blessed Sunday.", time: "10:05 AM" },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: user?.email?.split('@')[0] || "Anonymous",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white-text rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-primary-blue text-white-text flex justify-between items-center">
        <h2 className="font-montserrat font-bold">Community Chat</h2>
        <span className="text-sm bg-accent-teal px-2 py-1 rounded-full">Online: 24</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user === user?.email?.split('@')[0] ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${msg.user === user?.email?.split('@')[0] ? 'bg-primary-blue text-white-text rounded-br-none' : 'bg-white text-dark-text rounded-bl-none'}`}>
              <div className="text-xs font-bold opacity-75 mb-1">{msg.user}</div>
              <p>{msg.text}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-teal"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-accent-teal text-white-text font-bold rounded-lg hover:bg-teal-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

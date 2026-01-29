import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { MessageCircle, Send, HelpCircle, Lock, Crown, ChevronDown, ChevronUp } from 'lucide-react';

interface Question {
    id: string;
    userId: string;
    userName: string;
    content: string;
    answer?: string;
    isPublic: boolean;
    status: 'pending' | 'answered';
    createdAt: any;
    answeredAt?: any;
}

export default function BishopQA() {
    const { user, userProfile } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // Demo Data State
    const [demoQuestions, setDemoQuestions] = useState<Question[]>([
        {
            id: '1',
            userId: 'demo1',
            userName: 'Sarah J.',
            content: 'Bishop, how do I know if I am called to ministry or just eager to serve?',
            answer: 'This is a great question. The call to ministry is often confirmed by three things: an internal conviction, external confirmation from leadership, and fruitfulness in your current area of service. Don\'t rush the process; allow God to develop your character before your gift makes room for you.',
            isPublic: true,
            status: 'answered',
            createdAt: new Date(),
            answeredAt: new Date()
        },
        {
            id: '2',
            userId: 'demo2',
            userName: 'Anonymous',
            content: 'How should a Christian handle conflict in the workplace?',
            answer: 'We are called to be peacemakers. Matthew 18 gives us a model: go to the person directly first. Maintain your integrity, speak the truth in love, and remember that your testimony is more important than winning an argument.',
            isPublic: true,
            status: 'answered',
            createdAt: new Date(),
            answeredAt: new Date()
        }
    ]);

    useEffect(() => {
        if (!user) return;

        let qRef;
        if (activeTab === 'my') {
            qRef = query(
                collection(db, COLLECTIONS.QUESTIONS),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
        } else {
            // Community: Public and Answered
            qRef = query(
                collection(db, COLLECTIONS.QUESTIONS),
                where("isPublic", "==", true),
                where("status", "==", "answered"),
                orderBy("createdAt", "desc")
            );
        }

        const unsubscribe = onSnapshot(qRef, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Question[];
            setQuestions(fetched);
        });

        return () => unsubscribe();
    }, [user, activeTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        try {
            await addDoc(collection(db, COLLECTIONS.QUESTIONS), {
                userId: user?.uid,
                userName: userProfile?.displayName || 'Member',
                content: newQuestion,
                isPublic,
                status: 'pending',
                createdAt: serverTimestamp() // Using the imported serverTimestamp
            });

            setNewQuestion("");
            setActiveTab('my');
            alert("Your question has been submitted to Bishop Sapp.");
        } catch (error) {
            console.error("Error submitting question:", error);
            alert("Failed to submit question.");
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Date helper
    const getDate = (date: any) => {
        if (!date) return new Date();
        return date.toDate ? date.toDate() : new Date(date);
    };

    // Combine Data
    const relevantDemoQuestions = activeTab === 'all'
        ? demoQuestions.filter(q => q.isPublic && q.status === 'answered')
        : demoQuestions.filter(q => q.userId === user?.uid || q.userId === 'user');

    const visibleQuestions = [...questions, ...relevantDemoQuestions].sort((a, b) =>
        getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime()
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-accent-gold font-bold uppercase tracking-wider text-sm mb-2">
                        <Crown size={16} fill="currentColor" /> Golden Vessel Exclusive
                    </div>
                    <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-2">Ask The Bishop</h1>
                    <p className="text-neutral-400 max-w-lg">
                        Gain wisdom for your walk. Submit your questions directly to Bishop Sapp for spiritual guidance and insight.
                    </p>
                </div>
                <div className="w-20 h-20 bg-accent-gold/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <HelpCircle size={40} className="text-accent-gold" />
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Your Question</label>
                    <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className="w-full p-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold outline-none resize-none h-32"
                    />
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-accent-gold focus:ring-accent-gold"
                            />
                            <span className="text-neutral-600 text-sm">Make this question public (allows others to see the answer)</span>
                        </label>
                        <button
                            type="submit"
                            disabled={!newQuestion.trim()}
                            className="px-8 py-3 bg-gradient-to-r from-accent-gold to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} /> Submit Question
                        </button>
                    </div>
                </form>
            </div>

            {/* Questions List */}
            <div>
                <div className="flex gap-6 border-b border-neutral-200 mb-6">
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`pb-4 font-bold text-sm uppercase tracking-wider transition-all relative ${activeTab === 'my' ? 'text-primary' : 'text-neutral-400 hover:text-neutral-600'}`}
                    >
                        My Questions
                        {activeTab === 'my' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-4 font-bold text-sm uppercase tracking-wider transition-all relative ${activeTab === 'all' ? 'text-primary' : 'text-neutral-400 hover:text-neutral-600'}`}
                    >
                        Community Answers
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
                    </button>
                </div>

                <div className="space-y-4">
                    {visibleQuestions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-200">
                            <p className="text-neutral-400 font-bold">No questions found.</p>
                        </div>
                    ) : (
                        visibleQuestions.map((q) => (
                            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100/50 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                                            {q.userName.charAt(0)}
                                        </div>
                                        <span className="font-bold text-sm text-neutral-700">{q.userName}</span>
                                        <span className="text-neutral-300 text-xs">• {getDate(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!q.isPublic && (
                                            <div className="flex items-center gap-1 text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
                                                <Lock size={12} /> Private
                                            </div>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${q.status === 'answered' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            {q.status}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="cursor-pointer group"
                                    onClick={() => toggleExpand(q.id)}
                                >
                                    <h3 className="text-lg font-bold text-neutral-800 mb-2 font-montserrat flex justify-between items-start gap-4">
                                        {q.content}
                                        <span className="text-neutral-300 group-hover:text-primary transition-colors">
                                            {expandedIds.includes(q.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </span>
                                    </h3>
                                </div>

                                {expandedIds.includes(q.id) && q.answer && (
                                    <div className="bg-neutral-50 rounded-xl p-5 border-l-4 border-accent-gold relative mt-4 animate-fade-in">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-accent-gold text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                                BISHOP SAPP
                                            </div>
                                            <MessageCircle size={14} className="text-accent-gold" />
                                        </div>

                                        <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                                            {q.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

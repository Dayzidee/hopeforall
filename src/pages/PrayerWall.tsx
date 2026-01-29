import { useState, useEffect } from "react";
import { MessageCircle, Heart, Lock, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    doc,
    increment
} from "firebase/firestore";
import { db } from "../services/db";

interface PrayerRequest {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    category: string;
    isAnonymous: boolean;
    isPrivate: boolean; // Golden Vessel feature
    likes: number;
    prayedCount: number;
    createdAt: any;
}

import PremiumUpsellBanner from "../components/dashboard/PremiumUpsellBanner";

export default function PrayerWall() {
    const { user, userProfile } = useAuth();
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const isGolden = userProfile?.tier === 'golden_vessel';

    useEffect(() => {
        const q = query(
            collection(db, "prayers"), // Assuming 'prayers' collection
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PrayerRequest[];
            setRequests(fetched);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim()) return;

        try {
            await addDoc(collection(db, "prayers"), {
                userId: user.uid,
                authorName: isAnonymous ? "Anonymous Vessel" : (userProfile?.displayName || "Member"),
                content,
                category,
                isAnonymous,
                isPrivate, // Only Golden can set to true, relying on UI restriction + Firestore rules
                likes: 0,
                prayedCount: 0,
                createdAt: serverTimestamp()
            });
            setIsModalOpen(false);
            setContent("");
            setCategory("General");
            alert("Prayer request shared successfully.");
        } catch (error) {
            console.error("Error sharing prayer:", error);
            alert("Failed to share prayer.");
        }
    };

    const handlePray = async (id: string) => {
        // Optimistic update or just direct Firestore update
        const ref = doc(db, "prayers", id);
        await updateDoc(ref, {
            prayedCount: increment(1)
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <PremiumUpsellBanner featureName="Prayer" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-montserrat font-bold text-primary-blue">Prayer Wall</h1>
                    <p className="text-neutral-500 mt-1">Bear one another's burdens, and so fulfill the law of Christ.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-accent-teal text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                    <MessageCircle size={20} /> Share Prayer Request
                </button>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${req.isAnonymous ? 'bg-neutral-300' : 'bg-primary-blue'}`}>
                                    {req.authorName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-neutral-800 text-sm">{req.authorName}</p>
                                    <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-full text-neutral-500">{req.category}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-neutral-600 mb-6 flex-grow whitespace-pre-wrap leading-relaxed">"{req.content}"</p>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                            <div className="text-xs text-neutral-400">
                                {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                            </div>
                            <button
                                onClick={() => handlePray(req.id)}
                                className="flex items-center gap-1.5 text-accent-teal font-bold text-sm hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors group"
                            >
                                <Heart size={16} className="group-hover:fill-current" />
                                <span>Pray ({req.prayedCount})</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {requests.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-neutral-300">
                    <p className="text-neutral-400 font-bold text-lg">No prayer requests yet. Be the first to share.</p>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-primary-blue">Share Prayer Request</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Your Prayer</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="How can we pray for you today?"
                                    className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-teal outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full p-3 border border-neutral-200 rounded-lg outline-none"
                                    >
                                        <option>General</option>
                                        <option>Healing</option>
                                        <option>Family</option>
                                        <option>Finance</option>
                                        <option>Salvation</option>
                                    </select>
                                </div>
                                <div className="space-y-3 pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="rounded text-accent-teal" />
                                        <span className="text-sm font-medium text-neutral-600">Post Anonymously</span>
                                    </label>

                                    {isGolden ? (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} className="rounded text-accent-gold" />
                                            <span className="text-sm font-bold text-accent-gold flex items-center gap-1"><Lock size={12} /> Pastor Only (Private)</span>
                                        </label>
                                    ) : (
                                        <div className="flex items-center gap-2 opacity-50 cursor-not-allowed" title="Upgrade to Golden Vessel to use this">
                                            <div className="w-4 h-4 border border-neutral-300 rounded flex items-center justify-center"><Lock size={10} /></div>
                                            <span className="text-sm font-medium text-neutral-500">Pastor Only (Locked)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-accent-teal text-white font-bold rounded-xl shadow-lg hover:bg-teal-600 transition-all mt-4">
                                Post Prayer Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

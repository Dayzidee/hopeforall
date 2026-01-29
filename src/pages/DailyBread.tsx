import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db, COLLECTIONS } from '../services/db';
import { Sun, Play, Lock, Calendar, BookOpen, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';

interface Devotional {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    scriptureReference: string;
    scriptureText: string;
    content: string;
    audioUrl?: string;
    author: string;
}

export default function DailyBread() {
    const { userProfile } = useAuth();
    const [todayDevo, setTodayDevo] = useState<Devotional | null>(null);
    const [loading, setLoading] = useState(true);

    const isGolden = userProfile?.tier === 'golden_vessel';

    useEffect(() => {
        const fetchDevotional = async () => {
            try {
                const todayStr = new Date().toISOString().split('T')[0];

                // 1. Try to find devotional match strictly for today
                const q = query(
                    collection(db, COLLECTIONS.DEVOTIONALS),
                    where("date", "==", todayStr),
                    limit(1)
                );
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    setTodayDevo({ id: snapshot.docs[0].id, ...data } as Devotional);
                } else {
                    // 2. Fallback to most recent one if no specific entry for today
                    const recentQ = query(
                        collection(db, COLLECTIONS.DEVOTIONALS),
                        orderBy("date", "desc"),
                        limit(1)
                    );
                    const recentSnap = await getDocs(recentQ);

                    if (!recentSnap.empty) {
                        const data = recentSnap.docs[0].data();
                        setTodayDevo({ id: recentSnap.docs[0].id, ...data } as Devotional);
                    } else {
                        // 3. Last Resort: Demo fallback if DB is completely empty
                        setTodayDevo({
                            id: 'demo',
                            title: 'Walking in Divine Authority',
                            date: todayStr,
                            scriptureReference: 'Luke 10:19',
                            scriptureText: 'Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you.',
                            content: "When we understand who we are in Christ, fear loses its grip. Many believers walk as if they are defeated, but the mandate of heaven is clear: you have been given authority.\n\nToday, challenge every fearful thought with the Word of God. You are not a victim of your circumstances; you are a victor through the blood of Jesus. Stand tall, speak life, and watch the atmosphere around you shift.",
                            author: 'Bishop Marvin L. Sapp',
                            audioUrl: '#'
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching devotional:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevotional();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading today's word...</div>;

    if (!todayDevo) return <div className="p-10 text-center">No devotional for today.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <PremiumUpsellBanner featureName="Devotional" />

            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-2">
                    <Sun size={16} /> Daily Bread
                </div>
                <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-primary-blue">{todayDevo.title}</h1>
                <p className="text-neutral-500 font-medium flex items-center justify-center gap-2">
                    <Calendar size={16} /> {new Date(todayDevo.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                {/* Audio Player Section */}
                <div className="bg-neutral-900 p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Play size={24} className="ml-1" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Listen to Audio Devotional</h3>
                                <p className="text-white/60 text-sm">Read by {todayDevo.author} • 5 mins</p>
                            </div>
                        </div>

                        {isGolden ? (
                            <button className="bg-white text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-accent-gold hover:text-white transition-all shadow-lg flex items-center gap-2">
                                <Play size={18} fill="currentColor" /> Play Episode
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-xs uppercase tracking-widest font-bold text-accent-gold">Locked</span>
                                <Link to="/subscribe" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2 border border-white/20">
                                    <Lock size={14} /> Unlock Audio
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 space-y-8">
                    {/* Scripture Box */}
                    <div className="bg-neutral-50 p-6 md:p-8 rounded-2xl border-l-4 border-accent-teal relative">
                        <BookOpen className="text-accent-teal/20 absolute top-4 right-4 w-12 h-12" />
                        <h4 className="font-bold text-accent-teal mb-3 uppercase tracking-wide text-sm">{todayDevo.scriptureReference}</h4>
                        <p className="text-xl md:text-2xl font-serif text-neutral-800 italic leading-relaxed">
                            "{todayDevo.scriptureText}"
                        </p>
                    </div>

                    {/* Devotional Text */}
                    <div className="prose prose-lg text-neutral-600 leading-loose max-w-none font-sans">
                        {todayDevo.content.split('\\n\\n').map((para, i) => (
                            <p key={i} className="mb-4">{para}</p>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden">
                                {/* Placeholder Author Image */}
                                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                                    {todayDevo.author.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-neutral-800">{todayDevo.author}</p>
                                <p className="text-xs text-neutral-500">Senior Pastor</p>
                            </div>
                        </div>

                        <button className="text-neutral-400 hover:text-primary transition-colors">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

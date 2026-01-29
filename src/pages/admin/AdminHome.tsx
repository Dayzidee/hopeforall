import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../../services/db';
import { collection, getDocs } from 'firebase/firestore';
import { Users, BookOpen, MessageCircle, Calendar } from 'lucide-react';

export default function AdminHome() {
    const [stats, setStats] = useState({
        users: 0,
        prayers: 0,
        events: 0,
        content: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app with many docs, use 'count' aggregation queries for cost/performance
                // For now, we'll just check snapshot size or existing mock counts
                const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
                const prayersSnap = await getDocs(collection(db, COLLECTIONS.PRAYER_REQUESTS)); // check correct collection name usage
                const eventsSnap = await getDocs(collection(db, COLLECTIONS.EVENTS));

                setStats({
                    users: usersSnap.size,
                    prayers: prayersSnap.size,
                    events: eventsSnap.size,
                    content: 0 // Placeholder
                });
            } catch (error) {
                console.error("Error loading admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    const cards = [
        { title: "Total Users", value: stats.users, icon: <Users size={24} />, color: "bg-blue-500" },
        { title: "Prayer Requests", value: stats.prayers, icon: <MessageCircle size={24} />, color: "bg-teal-500" },
        { title: "Events Scheduled", value: stats.events, icon: <Calendar size={24} />, color: "bg-purple-500" },
        { title: "Content Items", value: stats.content, icon: <BookOpen size={24} />, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                        <div className={`${card.color} text-white p-3 rounded-lg shadow-md`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-neutral-500 text-sm font-bold">{card.title}</p>
                            <h3 className="text-2xl font-bold text-neutral-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="text-neutral-500 italic">No recent activity logs found.</div>
            </div>
        </div>
    );
}

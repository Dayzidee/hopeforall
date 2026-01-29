import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Calendar, MapPin, Clock, ArrowRight, Share2 } from 'lucide-react';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    time: string;
    location: string;
    image?: string;
    category: string;
}

export default function EventsCalendar() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(db, COLLECTIONS.EVENTS), orderBy("date", "asc"));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
                    setEvents(fetched);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);



    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <PremiumUpsellBanner featureName="Events" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-primary p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-montserrat font-bold mb-2">Upcoming Events</h1>
                    <p className="text-white/80 max-w-xl">
                        Stay connected with what's happening at The Chosen Vessel. Mark your calendars and get ready for an encounter.
                    </p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-20 w-24 h-24 bg-accent-gold/20 rounded-full blur-xl"></div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {['all', 'Worship', 'Conference', 'Outreach', 'Family'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${filter === cat
                            ? 'bg-neutral-900 text-white shadow-lg'
                            : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-100'
                            }`}
                    >
                        {cat === 'all' ? 'All Events' : cat}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-20">Loading calendar...</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200">
                        <p className="text-neutral-400 font-bold">No events found in this category.</p>
                    </div>
                ) : (
                    filteredEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 md:gap-8 group">
                            {/* Date Badge */}
                            <div className="flex-shrink-0 flex md:flex-col items-center justify-center bg-neutral-50 rounded-2xl p-4 md:w-24 md:h-24 border border-neutral-100 text-center gap-2 md:gap-0">
                                <span className="text-red-500 font-bold uppercase text-xs tracking-wider block mb-1">
                                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="text-3xl font-bold text-neutral-800 block leading-none">
                                    {new Date(event.date).getDate()}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {event.category}
                                    </span>
                                    <button className="text-neutral-400 hover:text-primary transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                <h3 className="text-2xl font-montserrat font-bold text-neutral-800 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>

                                <p className="text-neutral-500 leading-relaxed max-w-2xl">
                                    {event.description}
                                </p>

                                <div className="flex flex-wrap gap-4 md:gap-8 pt-2 text-sm font-medium text-neutral-500">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-accent-gold" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-accent-gold" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex-shrink-0 flex items-center">
                                <button className="w-full md:w-auto px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg group-hover:scale-105">
                                    Register <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

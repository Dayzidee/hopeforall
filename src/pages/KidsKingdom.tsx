import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { collection, getDocs, query } from 'firebase/firestore';
import { Play, FileText, Music, Heart, Star, Smile } from 'lucide-react';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';

interface KidResource {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'worksheet' | 'song';
    url: string;
    ageGroup: 'Preschool' | 'Elementary' | 'Pre-Teen';
    thumbnail?: string;
}

export default function KidsKingdom() {
    const [resources, setResources] = useState<KidResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterAge, setFilterAge] = useState('all');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const q = query(collection(db, COLLECTIONS.KIDS_CONTENT));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as KidResource[];
                    setResources(fetched);
                } else {
                    setResources([]);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchResources();
    }, []);

    const filtered = filterAge === 'all'
        ? resources
        : resources.filter(r => r.ageGroup === filterAge);



    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <PremiumUpsellBanner featureName="Kids Kingdom" />
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-12 rounded-3xl text-white shadow-xl relative overflow-hidden text-center">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white/20 p-4 rounded-full mb-6 animate-bounce-slow backdrop-blur-sm">
                        <Smile size={64} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-comic font-bold mb-4 drop-shadow-sm">Kids Kingdom</h1>
                    <p className="text-white/90 text-xl max-w-2xl font-medium">
                        Fun, faith-filled adventures for our little ones! Watch videos, sing songs, and learn about Jesus.
                    </p>
                </div>

                {/* Bubbly Background */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-blob" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300/20 rounded-full animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-20 w-24 h-24 bg-pink-300/20 rounded-full animate-blob animation-delay-4000" />
            </div>

            {/* Age Filter */}
            <div className="flex justify-center gap-4 flex-wrap">
                {['all', 'Preschool', 'Elementary', 'Pre-Teen'].map(age => (
                    <button
                        key={age}
                        onClick={() => setFilterAge(age)}
                        className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${filterAge === age
                            ? 'bg-yellow-400 text-yellow-900 shadow-lg rotate-1 scale-105 ring-4 ring-yellow-400/30'
                            : 'bg-white text-neutral-500 border-2 border-dashed border-neutral-200 hover:border-yellow-400 hover:text-yellow-500 hover:border-solid shadow-sm'
                            }`}
                    >
                        {age === 'all' ? 'All Ages' : age}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {filtered.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border-b-8 border-neutral-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
                        <div className={`h-48 flex items-center justify-center relative overflow-hidden ${item.type === 'video' ? 'bg-red-50 text-red-400' :
                            item.type === 'song' ? 'bg-purple-50 text-purple-400' :
                                'bg-green-50 text-green-400'
                            }`}>
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-current opacity-50" />
                                <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full border-8 border-current opacity-20" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-current blur-3xl opacity-20" />
                            </div>

                            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                                {item.type === 'video' && <Play size={80} fill="currentColor" className="drop-shadow-lg" />}
                                {item.type === 'song' && <Music size={80} className="drop-shadow-lg" />}
                                {item.type === 'worksheet' && <FileText size={80} className="drop-shadow-lg" />}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.ageGroup === 'Preschool' ? 'bg-yellow-100 text-yellow-700' :
                                    item.ageGroup === 'Elementary' ? 'bg-blue-100 text-blue-700' :
                                        'bg-pink-100 text-pink-700'
                                    }`}>
                                    {item.ageGroup}
                                </span>
                                <button className="text-neutral-300 hover:text-pink-500 hover:fill-current transition-colors">
                                    <Heart size={24} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-neutral-800 mb-2 font-comic leading-tight group-hover:text-primary transition-colors min-h-[3.5rem]">
                                {item.title}
                            </h3>
                            <p className="text-neutral-500 text-sm mb-6 line-clamp-2 h-10">
                                {item.description}
                            </p>

                            <button className={`w-full py-4 font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-white ${item.type === 'video' ? 'bg-red-400 hover:bg-red-500 shadow-red-200' :
                                item.type === 'song' ? 'bg-purple-400 hover:bg-purple-500 shadow-purple-200' :
                                    'bg-green-400 hover:bg-green-500 shadow-green-200'
                                }`}>
                                <span className="text-lg">
                                    {item.type === 'video' ? 'Watch Video' : item.type === 'song' ? 'Listen Now' : 'Download Activity'}
                                </span>
                                <div className="bg-white/20 rounded-full p-1.5 backdrop-blur-sm">
                                    {item.type === 'video' ? <Play size={16} fill="currentColor" /> :
                                        item.type === 'song' ? <Music size={16} /> :
                                            <FileText size={16} />}
                                </div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <p className="font-comic text-2xl font-bold">No fun stuff found for this age group yet!</p>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Search, FileText, Music, Video, Download, Filter, Crown, BookOpen } from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'audio' | 'video' | 'pdf' | 'ebook';
    url: string;
    thumbnail?: string;
    author: string;
    date: string;
    isExclusive: boolean;
}

export default function ResourceLibrary() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Mock Fetch with fallback data since DB might be empty
                const q = query(collection(db, COLLECTIONS.RESOURCES), orderBy("date", "desc"));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
                    setResources(fetched);
                } else {
                    setResources([]);
                }
            } catch (error) {
                console.error("Error loading resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    // Filter Logic
    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || res.type === filterType;
        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'audio': return <Music size={20} className="text-purple-500" />;
            case 'video': return <Video size={20} className="text-red-500" />;
            case 'pdf': return <FileText size={20} className="text-blue-500" />;
            case 'ebook': return <BookOpen size={20} className="text-amber-600" />;
            default: return <FileText size={20} />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-accent-gold font-bold uppercase tracking-wider text-sm mb-2">
                        <Crown size={16} fill="currentColor" /> Premium Access
                    </div>
                    <h1 className="text-4xl font-montserrat font-bold mb-2">The Armory</h1>
                    <p className="text-neutral-400 max-w-xl">
                        Equip yourself with exclusive spiritual resources. Download sermons, e-books, and study guides reserved for Golden Vessels.
                    </p>
                </div>

                {/* Decorative */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 sticky top-4 z-10">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-sm border border-neutral-100 focus:ring-2 focus:ring-accent-gold/20 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {['all', 'audio', 'video', 'pdf', 'ebook'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-4 rounded-xl font-bold capitalize whitespace-nowrap transition-all ${filterType === type
                                ? 'bg-neutral-900 text-white shadow-lg'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-100'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                        <div key={res.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-all group flex flex-col overflow-hidden">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
                                        {getTypeIcon(res.type)}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">
                                        {res.type}
                                    </span>
                                </div>
                                <h3 className="font-exbold text-xl text-neutral-800 mb-2 group-hover:text-primary transition-colors font-montserrat font-bold">
                                    {res.title}
                                </h3>
                                <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                                    {res.description}
                                </p>
                                <div className="text-xs font-bold text-neutral-400 flex items-center gap-2">
                                    <span>By {res.author}</span>
                                    <span>•</span>
                                    <span>{res.date}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                                <button className="text-accent-gold font-bold text-sm flex items-center gap-2 hover:text-yellow-600 transition-colors">
                                    <Download size={16} /> Download
                                </button>
                                <button className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                                    View Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredResources.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                        <Filter size={40} />
                    </div>
                    <p className="text-neutral-400 font-bold text-lg">No resources found matching your search.</p>
                </div>
            )}
        </div>
    );
}

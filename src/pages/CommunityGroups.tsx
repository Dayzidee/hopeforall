import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Users, MapPin, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';

interface Group {
    id: string;
    name: string;
    description: string;
    category: string;
    meetDay: string;
    meetTime: string;
    location: string; // "Zoom" or "Fellowship Hall"
    leader: string;
    members: string[]; // array of userIds
    image?: string;
}

export default function CommunityGroups() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Mock/Fallback Data
                const snapshot = await getDocs(collection(db, COLLECTIONS.GROUPS));
                if (!snapshot.empty) {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Group[];
                    setGroups(fetched);
                } else {
                    // Demo Data
                    setGroups([
                        {
                            id: '1',
                            name: 'Men of Valor',
                            description: 'A brotherhood committed to spiritual growth, accountability, and leadership.',
                            category: 'Men',
                            meetDay: 'Tuesday',
                            meetTime: '7:00 PM',
                            location: 'Fellowship Hall',
                            leader: 'Deacon Jones',
                            members: []
                        },
                        {
                            id: '2',
                            name: 'Women of Destiny',
                            description: 'Empowering women to walk in their God-given purpose and identity.',
                            category: 'Women',
                            meetDay: 'Thursday',
                            meetTime: '6:30 PM',
                            location: 'Zoom',
                            leader: 'Sis. Sarah',
                            members: []
                        },
                        {
                            id: '3',
                            name: 'Young Adults (The Bridge)',
                            description: 'Bridging the gap for ages 18-35. Real talk, real faith, real community.',
                            category: 'Youth',
                            meetDay: 'Friday',
                            meetTime: '8:00 PM',
                            location: 'The Cafe',
                            leader: 'Min. David',
                            members: []
                        },
                        {
                            id: '4',
                            name: 'Kingdom Marriage',
                            description: 'For married couples seeking to build a Christ-centered union.',
                            category: 'Marriage',
                            meetDay: 'Saturday',
                            meetTime: '10:00 AM',
                            location: 'Zoom',
                            leader: 'The Williams',
                            members: []
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleJoin = async (groupId: string) => {
        if (!user) return;
        try {
            // In a real app with Firestore data:
            // const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);
            // await updateDoc(groupRef, {
            //     members: arrayUnion(user.uid)
            // });

            // local state update for demo
            setGroups(groups.map(g => {
                if (g.id === groupId) {
                    return { ...g, members: [...g.members, user.uid] };
                }
                return g;
            }));
            alert("You have successfully joined this group!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleLeave = async (groupId: string) => {
        if (!user) return;
        // setGroups(groups.map(g => {
        //     if (g.id === groupId) {
        //         return { ...g, members: g.members.filter(id => id !== user.uid) };
        //     }
        //     return g;
        // }));
        alert("You have left the group.");
    };



    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <PremiumUpsellBanner featureName="Groups" />
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-montserrat font-bold text-primary-blue">Community Groups</h1>
                <p className="text-neutral-500 text-lg">
                    Life is better together. Find a group where you can grow, connect, and do life with others who share your season or interests.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map((group) => {
                    const isMember = user && group.members.includes(user.uid);

                    return (
                        <div key={group.id} className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden hover:shadow-xl transition-all group-card flex flex-col">
                            {/* Header Stripe */}
                            <div className="h-3 bg-gradient-to-r from-primary to-accent-teal" />

                            <div className="p-8 flex-grow space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {group.category}
                                    </span>
                                    {isMember && (
                                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
                                            <CheckCircle size={14} /> Member
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold text-primary-blue">{group.name}</h3>
                                <p className="text-neutral-600 leading-relaxed">{group.description}</p>

                                <div className="space-y-2 pt-4 border-t border-neutral-100 text-sm text-neutral-500">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-primary/60" />
                                        <span className="font-medium">{group.meetDay}s at {group.meetTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-primary/60" />
                                        <span className="font-medium">{group.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users size={18} className="text-primary/60" />
                                        <span className="font-medium">Leader: {group.leader}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-neutral-50 border-t border-neutral-100 mt-auto">
                                {!isMember ? (
                                    <button
                                        onClick={() => handleJoin(group.id)}
                                        className="w-full py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-btn"
                                    >
                                        Join Group <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        className="w-full py-3 bg-white border border-neutral-300 text-neutral-500 font-bold rounded-xl cursor-default opacity-70"
                                    >
                                        Joined
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

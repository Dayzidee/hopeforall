import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { collection, getDocs, doc, updateDoc, setDoc, arrayUnion, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Users, MapPin, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';
import { useNotification } from '../context/NotificationContext';

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

const DEFAULT_GROUPS: Group[] = [
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
];

export default function CommunityGroups() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Fetch real data (which might contain only members for now)
                const snapshot = await getDocs(collection(db, COLLECTIONS.GROUPS));
                const firestoreGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Partial<Group>[];

                // Merge Firestore data (members) with Default Static Data (details)
                const mergedGroups = DEFAULT_GROUPS.map(def => {
                    const real = firestoreGroups.find(g => g.id === def.id);
                    return {
                        ...def,
                        ...real, // Override with real data if exists (e.g., members)
                        // If real data exists but name is missing (partial doc), keep default name
                        name: real?.name || def.name,
                        description: real?.description || def.description,
                        category: real?.category || def.category,
                        meetDay: real?.meetDay || def.meetDay,
                        meetTime: real?.meetTime || def.meetTime,
                        location: real?.location || def.location,
                        leader: real?.leader || def.leader,
                        members: real?.members || []
                    };
                });

                setGroups(mergedGroups);
            } catch (error) {
                console.error("Error fetching groups:", error);
                setGroups(DEFAULT_GROUPS); // Fallback
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.CONTENT),
            where('type', '==', 'group_announcement'),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, (snapshot) => {
            setAnnouncements(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    const { showToast, showConfirm } = useNotification();

    const handleJoin = async (groupId: string, category: string) => {
        if (!user) return;
        try {
            const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);
            const userRef = doc(db, COLLECTIONS.USERS, user.uid);

            await setDoc(groupRef, {
                members: arrayUnion(user.uid)
            }, { merge: true });

            const badgeId = `badge_${category.toLowerCase().replace(' ', '_')}`;
            await updateDoc(userRef, {
                badges: arrayUnion(badgeId)
            });

            setGroups(groups.map(g => {
                if (g.id === groupId) {
                    return { ...g, members: [...g.members, user.uid] };
                }
                return g;
            }));
            showToast("Welcome! You've successfully joined the group.", 'success');
        } catch (error) {
            console.error("Error joining group:", error);
            showToast("Failed to join group. Please try again.", 'error');
        }
    };

    const handleLeave = (groupId: string, category: string) => {
        if (!user) return;

        showConfirm("Are you sure you want to leave this group?", async () => {
            try {
                const groupRef = doc(db, COLLECTIONS.GROUPS, groupId);

                // Manual Remove from Group
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    const newMembers = group.members.filter(id => id !== user.uid);
                    await setDoc(groupRef, { members: newMembers }, { merge: true });
                }

                setGroups(groups.map(g => {
                    if (g.id === groupId) {
                        return { ...g, members: g.members.filter(id => id !== user.uid) };
                    }
                    return g;
                }));
                showToast("You have left the group.", 'info');

            } catch (error) {
                console.error("Error leaving group:", error);
                showToast("Failed to leave group.", 'error');
            }
        });
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

            {/* Announcements Section */}
            {announcements.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl shadow-sm mb-8">
                    <h2 className="font-bold text-lg text-yellow-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Group Announcements
                    </h2>
                    <div className="space-y-4">
                        {announcements
                            .filter(a => {
                                // Show if 'all' or if user is member of target group
                                if (a.groupId === 'all') return true;
                                const targetGroup = groups.find(g => g.id === a.groupId);
                                return targetGroup && user && targetGroup.members.includes(user.uid);
                            })
                            .map(announcement => (
                                <div key={announcement.id} className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-neutral-800">{announcement.title}</h3>
                                        <span className="text-xs text-neutral-400">{new Date(announcement.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-neutral-600 text-sm mt-1">{announcement.description}</p>
                                    {announcement.groupId !== 'all' && (
                                        <span className="inline-block mt-2 text-[10px] uppercase font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                            Group Only
                                        </span>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}

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
                                        onClick={() => handleJoin(group.id, group.category)}
                                        className="w-full py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-btn"
                                    >
                                        Join Group <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLeave(group.id, group.category)}
                                        className="w-full py-3 bg-white border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all"
                                    >
                                        Leave Group
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

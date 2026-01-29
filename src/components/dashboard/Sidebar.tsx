import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Video,
    MessageCircle,
    User,
    Crown,
    BookOpen,
    Sun,
    Library,
    Users,
    Gift,
    BarChart3,
    Calendar,
    Smile,
    LogOut
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const { logout, userProfile } = useAuth();
    const location = useLocation();

    // Check if user is a Golden Vessel
    const isGolden = userProfile?.tier === 'golden_vessel';

    const menuItems = [
        { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { title: 'Live Stream', path: '/dashboard/live', icon: <Video size={20} />, golden: true }, // Now premium? Or basic? Let's safeguard it in concept, but currently available to all but restricted offline. Plan says Gated.
        { title: 'Community Chat', path: '/dashboard/chat', icon: <MessageCircle size={20} />, golden: true },
        { title: 'Pastor Interaction', path: '/dashboard/pastor', icon: <User size={20} />, golden: true },

        // New Features
        { title: 'Prayer Wall', path: '/dashboard/prayer', icon: <MessageCircle size={20} /> },
        { title: 'Sermon Notes', path: '/dashboard/journal', icon: <BookOpen size={20} /> },
        { title: 'Daily Bread', path: '/dashboard/devotional', icon: <Sun size={20} /> },
        { title: 'The Armory', path: '/dashboard/library', icon: <Library size={20} />, golden: true },
        { title: 'Community Groups', path: '/dashboard/groups', icon: <Users size={20} />, golden: true },
        { title: 'Spiritual Gifts', path: '/dashboard/gifts', icon: <Gift size={20} />, golden: true },
        { title: 'Offering Analytics', path: '/dashboard/giving', icon: <BarChart3 size={20} /> },
        { title: 'Events', path: '/dashboard/events', icon: <Calendar size={20} /> },
        { title: 'Kids Kingdom', path: '/dashboard/kids', icon: <Smile size={20} /> },
        { title: 'My Profile', path: '/dashboard/profile', icon: <User size={20} /> },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed top-0 left-0 h-full bg-white z-50 w-72 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-neutral-200 overflow-y-auto`}>
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <span className="font-montserrat font-bold text-lg text-primary">The Chosen Vessel</span>
                    </Link>
                    <button className="md:hidden" onClick={() => setIsOpen(false)}>×</button>
                </div>

                {/* User Profile Summary */}
                <Link to="/dashboard/profile" className={`p-6 bg-gradient-to-br ${isGolden ? 'from-neutral-900 via-neutral-800 to-neutral-900 border-l-4 border-accent-gold' : 'from-neutral-100 to-neutral-50'} flex items-center gap-3 hover:bg-opacity-90 transition-opacity`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isGolden ? 'bg-gradient-to-r from-accent-gold to-yellow-600 text-white shadow-lg shadow-gold/20' : 'bg-neutral-200 text-neutral-600'}`}>
                        {userProfile?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className={`font-bold truncate ${isGolden ? 'text-white' : 'text-neutral-800'}`}>{userProfile?.displayName || 'Member'}</p>
                        <div className="flex items-center gap-1">
                            {isGolden && <Crown size={12} className="text-accent-gold" fill="currentColor" />}
                            <p className={`text-xs uppercase tracking-wider font-bold ${isGolden ? 'text-accent-gold' : 'text-neutral-500'}`}>
                                {isGolden ? 'Golden Vessel' : 'Vessel'}
                            </p>
                        </div>
                    </div>
                </Link>

                {/* CTA to upgrade if not golden */}
                {!isGolden && (
                    <div className="mx-4 mt-4 mb-2">
                        <Link to="/subscribe" className="block w-full py-3 bg-gradient-to-r from-accent-gold to-yellow-600 text-white text-center font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-sm flex items-center justify-center gap-2">
                            <Crown size={16} /> Upgrade Membership
                        </Link>
                    </div>
                )}

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all group ${location.pathname === item.path
                                ? 'bg-primary/5 text-primary font-bold'
                                : 'text-neutral-500 hover:bg-neutral-50 hover:text-primary'
                                }`}
                        >
                            <span className={location.pathname === item.path ? 'text-primary' : (item.golden ? 'text-accent-gold' : 'text-neutral-400 group-hover:text-primary')}>{item.icon}</span>
                            <span>{item.title}</span>
                            {item.golden && <Crown size={12} className="ml-auto text-accent-gold opacity-50" />}
                        </Link>
                    ))}

                    {/* Admin Link - Only visible to Admins */}
                    {userProfile?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-3 p-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md mt-4"
                        >
                            <LayoutDashboard size={20} />
                            <span>Admin Dashboard</span>
                        </Link>
                    )}

                    <div className="pt-4 mt-4 border-t border-neutral-100">
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 p-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all font-bold"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}

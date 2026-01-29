import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, MessageCircle, User, Bell, ChevronRight, LayoutDashboard, Calendar, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function MemberHome() {
  const { user, userProfile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    console.log("Current User Profile:", userProfile);
    console.log("Is Admin?", userProfile?.role === 'admin');

    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, COLLECTIONS.NOTIFICATIONS),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snapshot = await getDocs(q);
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoadingNotes(false);
      }
    };
    fetchNotifications();
  }, []);

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-primary-blue">
            Welcome back, {userProfile?.displayName || user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-500 mt-1">Here is what's happening in your spiritual home.</p>
        </div>
        {isAdmin && (
          <Link to="/admin" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center gap-2">
            <LayoutDashboard size={20} />
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Notifications Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Bell size={20} />
              </div>
              <h2 className="text-xl font-bold font-montserrat">Latest Announcements</h2>
            </div>

            <div className="space-y-4">
              {loadingNotes ? (
                <p className="text-gray-400 text-sm">Loading announcements...</p>
              ) : notifications.length > 0 ? (
                notifications.map(note => (
                  <div key={note.id} className={`p-4 rounded-xl border-l-4 ${note.type === 'alert' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800">{note.title}</h4>
                      <span className="text-xs text-gray-400">
                        {note.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{note.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                  <p>No new announcements at this time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/dashboard/live" className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 group-hover:border-red-500/20 group-hover:shadow-md transition-all h-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                    <Video size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-montserrat">Live Service</h3>
                </div>
                <p className="text-sm text-gray-500">Join our Sunday  & Wednesday streams.</p>
              </div>
            </Link>

            <Link to="/dashboard/chat" className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 group-hover:border-blue-500/20 group-hover:shadow-md transition-all h-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-montserrat">Community Chat</h3>
                </div>
                <p className="text-sm text-gray-500">Connect with the Vessel family.</p>
              </div>
            </Link>

            <Link to="/dashboard/events" className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 group-hover:border-green-500/20 group-hover:shadow-md transition-all h-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-montserrat">Upcoming Events</h3>
                </div>
                <p className="text-sm text-gray-500">See what's happening next.</p>
              </div>
            </Link>

            <Link to="/dashboard/gifts" className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 group-hover:border-purple-500/20 group-hover:shadow-md transition-all h-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Gift size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-montserrat">Spiritual Gifts</h3>
                </div>
                <p className="text-sm text-gray-500">Discover your unique purpose.</p>
              </div>
            </Link>
          </div>

        </div>

        {/* Sidebar/Right Column */}
        <div className="space-y-6">
          {/* Weekly Scripture */}
          <div className="bg-gradient-to-br from-primary-blue to-accent-teal p-1 rounded-2xl shadow-lg">
            <div className="bg-white p-6 rounded-xl h-full">
              <h2 className="text-lg font-bold text-primary-blue mb-4 uppercase tracking-wider">Weekly Scripture</h2>
              <blockquote className="text-xl italic text-gray-700 font-serif leading-relaxed">
                "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
              </blockquote>
              <p className="mt-4 text-right font-bold text-accent-teal">- Jeremiah 29:11</p>
            </div>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-gray-500 mb-4">
              {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <h3 className="font-bold text-lg">{userProfile?.displayName || 'Member'}</h3>
            <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
            <Link to="/dashboard/profile" className="text-sm text-primary-blue font-bold hover:underline">
              Edit Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

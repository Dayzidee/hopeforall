import { Link } from 'react-router-dom';
import { Video, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MemberHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-montserrat font-bold text-primary-blue">
        Welcome back, {user?.email?.split('@')[0]}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/live" className="block group">
          <div className="bg-white-text p-6 rounded-xl shadow-lg border border-gray-100 group-hover:border-accent-teal transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <Video size={24} />
              </div>
              <h3 className="text-xl font-bold font-montserrat">Live Service</h3>
            </div>
            <p className="text-gray-600">Join our live broadcasts every Sunday and Wednesday.</p>
          </div>
        </Link>

        <Link to="/dashboard/chat" className="block group">
          <div className="bg-white-text p-6 rounded-xl shadow-lg border border-gray-100 group-hover:border-accent-teal transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-bold font-montserrat">Community Chat</h3>
            </div>
            <p className="text-gray-600">Connect with other members of the Vessel family.</p>
          </div>
        </Link>

        <Link to="/dashboard/pastor" className="block group">
          <div className="bg-white-text p-6 rounded-xl shadow-lg border border-gray-100 group-hover:border-accent-teal transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <User size={24} />
              </div>
              <h3 className="text-xl font-bold font-montserrat">Pastor Interaction</h3>
            </div>
            <p className="text-gray-600">Direct line to pastoral care and guidance.</p>
          </div>
        </Link>
      </div>

      <div className="mt-12 bg-light-background p-8 rounded-xl border border-primary-blue/10">
        <h2 className="text-2xl font-montserrat font-bold text-primary-blue mb-4">Weekly Scripture</h2>
        <blockquote className="text-xl italic text-gray-700 border-l-4 border-accent-teal pl-4">
          "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
        </blockquote>
        <p className="mt-4 text-right font-bold text-gray-600">- Jeremiah 29:11</p>
      </div>
    </div>
  );
}

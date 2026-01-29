import { useState } from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `font-montserrat font-bold hover:text-accent-teal transition-colors duration-300 ${location.pathname === path ? 'text-accent-teal' : 'text-white-text'}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary-blue/95 backdrop-blur-sm shadow-lg transition-all duration-300">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-montserrat font-bold text-2xl text-white-text">The Chosen Vessel</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            {!user && (
              <>
                <Link to="/#about" className="text-white-text font-montserrat font-bold hover:text-accent-teal transition-colors">About</Link>
                <Link to="/#leadership" className="text-white-text font-montserrat font-bold hover:text-accent-teal transition-colors">Leadership</Link>
                <Link to="/#ministries" className="text-white-text font-montserrat font-bold hover:text-accent-teal transition-colors">Ministries</Link>
                <Link to="/#outreach" className="text-white-text font-montserrat font-bold hover:text-accent-teal transition-colors">Outreach</Link>
                <Link to="/#donation" className="text-white-text font-montserrat font-bold hover:text-accent-teal transition-colors">Give</Link>
                <Link to="/login" className={navLinkClass('/login')}>Login</Link>
              </>
            )}
            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
                <button
                  onClick={() => logout()}
                  className="px-6 py-2 rounded-lg font-montserrat font-bold text-white-text bg-red-500 hover:bg-red-600 transition-all shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signup"
                className="px-6 py-2 rounded-lg font-montserrat font-bold text-white-text bg-accent-teal hover:bg-teal-600 hover:scale-105 transform transition-all shadow-md"
              >
                Join Us
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white-text focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <Link to="/" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Home</Link>
            {!user && (
              <>
                <Link to="/#about" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>About</Link>
                <Link to="/#leadership" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Leadership</Link>
                <Link to="/#ministries" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Ministries</Link>
                <Link to="/#outreach" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Outreach</Link>
                <Link to="/#donation" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Give</Link>
                <Link to="/login" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Login</Link>
              </>
            )}
            {user ? (
              <>
                <Link to="/dashboard" className="text-white-text font-montserrat font-bold" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/dashboard/live" className="text-white-text pl-4" onClick={() => setIsOpen(false)}>Live Stream</Link>
                <Link to="/dashboard/chat" className="text-white-text pl-4" onClick={() => setIsOpen(false)}>Chat</Link>
                <Link to="/dashboard/pastor" className="text-white-text pl-4" onClick={() => setIsOpen(false)}>Pastor</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-red-400 font-montserrat font-bold pt-2 border-t border-white/10">Logout</button>
              </>
            ) : (
              <Link to="/signup" className="text-accent-teal font-montserrat font-bold" onClick={() => setIsOpen(false)}>Join Us</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-lato">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="p-6 bg-dark-text text-white-text text-center flex flex-col gap-2">
        <p>© 2025 The Chosen Vessel Church. All rights reserved.</p>
        <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors underline">Terms and Conditions</Link>
      </footer>
    </div>
  );
};

export const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col font-lato">
      <Navbar />
      <div className="flex flex-grow pt-24">
        <aside className="w-64 bg-gray-100 hidden md:block p-4 fixed h-full overflow-y-auto">
          <h3 className="font-bold mb-4">Member Menu</h3>
          <ul className="space-y-2">
            <li><Link to="/dashboard" className="block p-2 hover:bg-gray-200 rounded">Dashboard</Link></li>
            <li><Link to="/dashboard/live" className="block p-2 hover:bg-gray-200 rounded">Live Stream</Link></li>
            <li><Link to="/dashboard/chat" className="block p-2 hover:bg-gray-200 rounded">Community Chat</Link></li>
            <li><Link to="/dashboard/pastor" className="block p-2 hover:bg-gray-200 rounded">Pastor Interaction</Link></li>
          </ul>
        </aside>
        <main className="flex-grow p-4 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex flex-col font-lato">
      <nav className="p-4 bg-red-800 text-white-text flex justify-between items-center">
        <Link to="/admin" className="text-xl font-bold">Vessel Admin</Link>
        <Link to="/dashboard">Exit Admin</Link>
      </nav>
      <div className="flex flex-grow">
        <aside className="w-64 bg-gray-100 p-4">
          <h3 className="font-bold mb-4">Admin Menu</h3>
          <ul className="space-y-2">
            <li><Link to="/admin" className="block p-2 hover:bg-gray-200 rounded">Dashboard Home</Link></li>
            <li><Link to="/admin/users" className="block p-2 hover:bg-gray-200 rounded">User Management</Link></li>
            <li><Link to="/admin/content" className="block p-2 hover:bg-gray-200 rounded">Content CMS</Link></li>
            <li><Link to="/admin/prayers" className="block p-2 hover:bg-gray-200 rounded">Prayer Requests</Link></li>
            <li><Link to="/admin/chat" className="block p-2 hover:bg-gray-200 rounded">Chat Messages</Link></li>
            <li><Link to="/admin/notifications" className="block p-2 hover:bg-gray-200 rounded">Global Notifications</Link></li>
          </ul>
        </aside>
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

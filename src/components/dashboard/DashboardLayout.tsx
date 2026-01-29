import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout() {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
                    <span className="font-montserrat font-bold text-lg text-primary">The Chosen Vessel</span>
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="text-primary" />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

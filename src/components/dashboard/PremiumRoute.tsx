import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PremiumRoute({ children }: { children: React.ReactNode }) {
    const { userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If user is NOT a Golden Vessel, show the paywall
    if (userProfile?.tier !== 'golden_vessel') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl shadow-sm border border-neutral-100 animate-fade-in">
                <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-50 rounded-full flex items-center justify-center shadow-inner">
                        <Crown className="w-12 h-12 text-yellow-600" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                        <Lock className="w-6 h-6 text-neutral-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-montserrat font-bold text-gray-800 mb-3">Golden Vessel Exclusivity</h2>
                <p className="text-gray-500 max-w-lg mb-8 text-lg leading-relaxed">
                    This feature is reserved for our Covenant Partners. Unlock the full spiritual experience including the Prayer Wall, Live Stream, and Pastor's Study Notes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/subscribe" className="px-8 py-4 bg-gradient-to-r from-accent-gold to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center gap-2">
                        <Crown size={20} />
                        Become a Golden Vessel
                    </Link>
                    <Link to="/dashboard" className="px-8 py-4 bg-white text-neutral-600 font-bold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all">
                        Maybe Later
                    </Link>
                </div>

            </div>
        );
    }

    // If authorized, render the protected content
    return <>{children}</>;
}

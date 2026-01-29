import { Link } from 'react-router-dom';
import { Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    featureName?: string;
}

export default function PremiumUpsellBanner({ featureName }: Props) {
    const { userProfile } = useAuth();

    // If already premium, don't show the upsell
    if (userProfile?.tier === 'golden_vessel') return null;

    return (
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mb-8 border border-white/10 relative overflow-hidden group">
            {/* Shimmer Effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shimmer" />

            <div className="flex items-center gap-5 relative z-10 text-center md:text-left">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-gold to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-900/20 shrink-0 mx-auto md:mx-0">
                    <Crown className="text-white fill-white/20" size={28} />
                </div>
                <div>
                    <h3 className="font-bold text-lg font-montserrat flex items-center justify-center md:justify-start gap-2">
                        Unlock the Full Experience <Sparkles size={16} className="text-accent-gold" />
                    </h3>
                    <p className="text-neutral-400 text-sm max-w-lg mt-1">
                        Get deeper with God. Golden Vessels unlimited access to {featureName ? `features like ${featureName} Plus,` : ''} Audio Devotionals, Kids Kingdom, and Direct Q&A with Bishop Sapp.
                    </p>
                </div>
            </div>
            <Link to="/dashboard/subscribe" className="relative z-10 px-8 py-3 bg-gradient-to-r from-accent-gold to-yellow-600 text-white font-bold rounded-xl whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-wider">
                Upgrade to Golden Vessel
            </Link>
        </div>
    );
}

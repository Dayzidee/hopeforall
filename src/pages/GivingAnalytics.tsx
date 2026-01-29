import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { DollarSign, TrendingUp, PieChart, Download, Calendar } from 'lucide-react';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';

interface Donation {
    id: string;
    amount: number;
    type: string; // Tithe, Offering, Building Fund
    date: any; // Timestamp
    status: string;
}

export default function GivingAnalytics() {
    const { user } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // In a real app, integrate with Stripe/Payment Provider webhooks saving to Firestore
        const q = query(
            collection(db, COLLECTIONS.DONATIONS),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donation[];
                setDonations(fetched);
            } else {
                // Mock Data for Demo Visualization
                setDonations([
                    { id: '1', amount: 150.00, type: 'Tithe', date: { seconds: Date.now() / 1000 - 86400 * 2 }, status: 'completed' },
                    { id: '2', amount: 50.00, type: 'Offering', date: { seconds: Date.now() / 1000 - 86400 * 9 }, status: 'completed' },
                    { id: '3', amount: 150.00, type: 'Tithe', date: { seconds: Date.now() / 1000 - 86400 * 16 }, status: 'completed' },
                    { id: '4', amount: 200.00, type: 'Building Fund', date: { seconds: Date.now() / 1000 - 86400 * 23 }, status: 'completed' },
                    { id: '5', amount: 150.00, type: 'Tithe', date: { seconds: Date.now() / 1000 - 86400 * 30 }, status: 'completed' },
                ]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Analytics Calculations
    const totalGiven = donations.reduce((acc, curr) => acc + curr.amount, 0);
    const averageGiving = donations.length > 0 ? totalGiven / donations.length : 0;

    // Group by Type for Pie Chart approximation
    const byType = donations.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);



    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
            <PremiumUpsellBanner featureName="Giving" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-montserrat font-bold text-primary-blue">Giving History</h1>
                    <p className="text-neutral-500 mt-1">Track your faithfulness and seed sown into the Kingdom.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.href = '/dashboard/giving'} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-blue flex items-center gap-2">
                        <DollarSign size={18} /> Give Now
                    </button>
                    <button className="px-6 py-3 bg-white border border-neutral-200 text-neutral-600 font-bold rounded-xl shadow-sm hover:bg-neutral-50 flex items-center gap-2">
                        <Download size={18} /> Statement
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign size={100} />
                    </div>
                    <p className="text-blue-200 font-medium mb-1">Total Giving (YTD)</p>
                    <h3 className="text-4xl font-bold font-montserrat">${totalGiven.toFixed(2)}</h3>
                    <div className="mt-4 flex items-center text-sm text-blue-200 bg-white/10 w-fit px-3 py-1 rounded-full">
                        <TrendingUp size={14} className="mr-1" /> Top 10% Contributor
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <Calendar size={20} />
                        </div>
                        <span className="text-xs font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded">Last 30 Days</span>
                    </div>
                    <p className="text-neutral-500 font-medium mb-1">Average Donation</p>
                    <h3 className="text-3xl font-bold text-neutral-800">${averageGiving.toFixed(2)}</h3>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                            <PieChart size={20} />
                        </div>
                    </div>
                    <p className="text-neutral-500 font-medium mb-1">Most Frequent</p>
                    <h3 className="text-2xl font-bold text-neutral-800">Tithe</h3>
                    <p className="text-xs text-neutral-400 mt-1">Consistent giver</p>
                </div>
            </div>

            {/* Charts & List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visuals */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                    <h3 className="font-bold text-lg text-neutral-800 mb-6">Distribution</h3>
                    {/* CSS Bar Chart */}
                    <div className="space-y-6">
                        {Object.entries(byType).map(([type, amount]) => {
                            const percentage = (amount / totalGiven) * 100;
                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span className="text-neutral-600">{type}</span>
                                        <span className="text-primary">${amount.toFixed(2)} ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent-teal rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 flex flex-col">
                    <div className="p-6 border-b border-neutral-100">
                        <h3 className="font-bold text-lg text-neutral-800">Recent Transactions</h3>
                    </div>
                    <div className="flex-grow overflow-auto max-h-[400px]">
                        {donations.map((donation) => (
                            <div key={donation.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                                        $
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-800">{donation.type}</p>
                                        <p className="text-xs text-neutral-400">
                                            {new Date(donation.date.seconds * 1000).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-neutral-700">${donation.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-neutral-100 text-center">
                        <button className="text-primary font-bold text-sm hover:underline">View All History</button>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-accent-gold to-yellow-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-2xl font-bold font-montserrat mb-2">Set up Recurring Giving</h3>
                    <p className="text-white/90">Automate your tithe and never miss a Seed Sunday. Consistency brings breakthrough.</p>
                </div>
                <button className="px-8 py-3 bg-white text-yellow-700 font-bold rounded-xl shadow-lg hover:bg-neutral-50 transition-all whitespace-nowrap">
                    Configure Auto-Give
                </button>
            </div>
        </div>
    );
}

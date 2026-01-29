import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { DollarSign, Heart, Gift, Building } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function GivingPage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [amount, setAmount] = useState('50.00');
    const [type, setType] = useState('Tithe');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const urlAmount = searchParams.get('amount');
        const urlType = searchParams.get('type');

        if (urlAmount) setAmount(urlAmount);
        if (urlType) {
            // Capitalize first letter to match buttons if needed, or loosely match
            const formattedType = urlType.charAt(0).toUpperCase() + urlType.slice(1);
            if (['Tithe', 'Offering', 'Donation'].includes(formattedType)) {
                // Map 'Donation' to 'Offering' or keep as is? App uses "Building Fund", "Missions", "Tithe", "Offering".
                // DonationPortal uses 'offering', 'tithe', 'donation'.
                // Let's map 'donation' to 'Offering' generically or 'Missions' 
                if (formattedType === 'Donation') setType('Offering');
                else setType(formattedType);
            }
        }
    }, [searchParams]);

    const handleSuccess = async (details: any) => {
        try {
            await addDoc(collection(db, COLLECTIONS.DONATIONS), {
                userId: user?.uid || 'anonymous',
                amount: parseFloat(amount),
                type: type,
                transactionId: details.id,
                status: 'completed',
                payerParams: {
                    email_address: details.payer.email_address,
                    name: details.payer.name
                },
                createdAt: serverTimestamp()
            });
            setSuccessMsg(`Thank you! Your ${type} of $${amount} has been received.`);
        } catch (err) {
            console.error("Error saving donation:", err);
            setErrorMsg("Payment successful, but failed to save record. Please contact support.");
        }
    };

    return (
        <PayPalScriptProvider options={{ "clientId": "test", components: "buttons", currency: "USD" }}>
            <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-montserrat font-bold text-primary-blue mb-2">Giving</h1>
                    <p className="text-neutral-500">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-100">
                    {successMsg ? (
                        <div className="text-center py-12 space-y-4 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart size={40} fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-700">Thank You for Your Generosity!</h2>
                            <p className="text-neutral-600">{successMsg}</p>
                            <button onClick={() => setSuccessMsg('')} className="mt-6 px-6 py-2 bg-neutral-100 font-bold rounded-lg hover:bg-neutral-200">
                                Give Again
                            </button>
                            <div className="mt-4">
                                <a href="/dashboard/giving/history" className="text-sm text-primary font-bold hover:underline">View Giving History</a>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Amount Selector */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">I want to give</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-12 p-4 text-2xl font-bold border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {['20.00', '50.00', '100.00', '500.00'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${amount === val ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type Selector */}
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Fund</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'Tithe', icon: <DollarSign size={16} /> },
                                        { id: 'Offering', icon: <Gift size={16} /> },
                                        { id: 'Building Fund', icon: <Building size={16} /> },
                                        { id: 'Missions', icon: <Heart size={16} /> }
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setType(item.id)}
                                            className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${type === item.id
                                                ? 'border-primary bg-blue-50 text-primary shadow-sm'
                                                : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                                                }`}
                                        >
                                            {item.icon} {item.id}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100">
                                <label className="block text-sm font-bold text-neutral-700 mb-4">Payment Method</label>
                                <PayPalButtons
                                    style={{ layout: "vertical", shape: "rect", label: "donate" }}
                                    forceReRender={[amount, type]}
                                    createOrder={(_data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    description: `Donation: ${type}`,
                                                    amount: {
                                                        currency_code: "USD",
                                                        value: amount,
                                                    },
                                                },
                                            ],
                                            intent: "CAPTURE"
                                        });
                                    }}
                                    onApprove={async (_data, actions) => {
                                        if (actions.order) {
                                            const details = await actions.order.capture();
                                            handleSuccess(details);
                                        }
                                    }}
                                    onError={(err) => {
                                        console.error("PayPal Error:", err);
                                        setErrorMsg("Payment could not be processed.");
                                    }}
                                />
                                {errorMsg && <p className="text-red-500 text-center text-sm font-bold mt-2">{errorMsg}</p>}
                            </div>

                            <p className="text-center text-xs text-neutral-400">
                                Secure payments processed by PayPal. All donations are tax-deductible.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PayPalScriptProvider>
    );
}

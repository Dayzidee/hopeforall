import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '../services/db';
import { Crown, Check } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function SubscriptionPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Payment

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: user?.email || '',
        type: 'Local Member' as 'Local Member' | 'Virtual/Online Member',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubscribe = async (details: any) => {
        if (!user) return;

        try {
            // 1. Update User Profile with new Golden Vessel status & contact info
            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            await updateDoc(userRef, {
                tier: 'golden_vessel',
                badges: ['new_member', 'golden_vessel'],
                subscriptionDate: serverTimestamp(),
                subscriptionId: details.id,
                contactInfo: {
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    type: formData.type === 'Local Member' ? 'local' : 'virtual'
                }
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error("Subscription Error:", error);
            alert("Failed to process subscription. Please contact support.");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-accent-gold to-yellow-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                    <Crown className="w-12 h-12 mx-auto mb-4 text-white drop-shadow-md" />
                    <h2 className="text-3xl font-montserrat font-bold">Become a Golden Vessel</h2>
                    <p className="mt-2 text-yellow-50 font-medium">Get Connected To A Progressive Ministry</p>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        // --- STEP 1: CONTACT FORM ---
                        <form onSubmit={handleNext} className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 leading-relaxed mb-6">
                                <p className="font-bold mb-2">Are you looking for a community of Faith and Support?</p>
                                <p>
                                    Church membership is open to any Christian believer who desires to learn more of and draw closer to the Lord.
                                    When you decide to become a member of our church family, you will be asked to complete this form and live out your membership vows.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">First Name</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Last Name</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Phone</label>
                                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" placeholder="(555) 123-4567" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Member Type *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-lg p-4 flex items-center justify-center gap-2 transition-all ${formData.type === 'Local Member' ? 'border-accent-gold bg-yellow-50 text-accent-gold font-bold shadow-sm' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                        <input type="radio" name="type" value="Local Member" checked={formData.type === 'Local Member'} onChange={handleChange} className="hidden" />
                                        <span>Local Member</span>
                                    </label>
                                    <label className={`cursor-pointer border rounded-lg p-4 flex items-center justify-center gap-2 transition-all ${formData.type === 'Virtual/Online Member' ? 'border-accent-gold bg-yellow-50 text-accent-gold font-bold shadow-sm' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                        <input type="radio" name="type" value="Virtual/Online Member" checked={formData.type === 'Virtual/Online Member'} onChange={handleChange} className="hidden" />
                                        <span>Virtual Member</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Street Address</label>
                                <input required name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" placeholder="123 Faith Lane" />
                            </div>

                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-3">
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">City</label>
                                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">State</label>
                                    <input required name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Zip</label>
                                    <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:scale-[1.02]">
                                Continue to Payment
                            </button>
                        </form>
                    ) : (
                        // --- STEP 2: PAYMENT MOCK ---
                        <div className="space-y-8 animate-fade-in">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-neutral-800 mb-2">Complete Subscription</h3>
                                <p className="text-neutral-500">Secure your spot as a Golden Vessel</p>
                            </div>

                            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-200">
                                    <span className="font-bold text-neutral-600">Golden Vessel Membership</span>
                                    <span className="font-bold text-xl text-primary">$20.00 <span className="text-sm font-normal text-neutral-400">/mo</span></span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-neutral-600">
                                        <Check className="w-4 h-4 text-green-500" /> Exclusive Live Stream Access
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-neutral-600">
                                        <Check className="w-4 h-4 text-green-500" /> Prayer Wall Direct Line
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-neutral-600">
                                        <Check className="w-4 h-4 text-green-500" /> Golden Vessel Badge
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <PayPalScriptProvider options={{ "clientId": "test", components: "buttons", currency: "USD" }}>
                                    <PayPalButtons
                                        style={{ layout: "vertical", shape: "rect", label: "subscribe" }}
                                        createOrder={(_data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        description: "Golden Vessel Membership (Monthly)",
                                                        amount: {
                                                            currency_code: "USD",
                                                            value: "20.00",
                                                        },
                                                    },
                                                ],
                                                intent: "CAPTURE"
                                            });
                                        }}
                                        onApprove={async (_data, actions) => {
                                            if (actions.order) {
                                                const details = await actions.order.capture();
                                                handleSubscribe(details);
                                            }
                                        }}
                                    />
                                </PayPalScriptProvider>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 text-neutral-500 font-bold hover:bg-neutral-100 rounded-xl transition-colors">
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

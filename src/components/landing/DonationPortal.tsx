import { useState } from "react";
import { CreditCard, Heart, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DonationPortal() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'offering' | 'tithe' | 'donation'>('offering');
    const [amount, setAmount] = useState<string>('');
    const [customAmount, setCustomAmount] = useState<string>('');

    const handleAmountSelect = (val: string) => {
        setAmount(val);
        setCustomAmount('');
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
        setAmount(e.target.value);
    };

    const handleGive = () => {
        const finalAmount = customAmount || amount;
        if (!finalAmount) {
            alert("Please select or enter an amount.");
            return;
        }
        // Redirect to main Giving Page with params
        navigate(`/give?amount=${finalAmount}&type=${activeTab}`);
    };

    const activeColor = activeTab === 'tithe' ? 'bg-accent-gold' : activeTab === 'donation' ? 'bg-primary' : 'bg-accent-teal';

    return (
        <section id="donation" className="py-24 relative overflow-hidden bg-white scroll-mt-28">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-neutral-50 skew-x-12 transform translate-x-20 z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Side: Message */}
                    <div className="lg:w-1/2 pt-10">
                        <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-primary mb-6">
                            Empower the Kingdom
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                            Your generosity fuels the mission of The Chosen Vessel. Whether it's your tithe, a freewill offering, or a donation to a specific cause, every seed sown makes a difference.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold mt-1">
                                    <Gift className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary text-lg">Secure & Simple</h4>
                                    <p className="text-neutral-500">Encrypted transactions for your peace of mind.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal mt-1">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary text-lg">Tax Deductible</h4>
                                    <p className="text-neutral-500">Receive annual giving statements for your records.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Donation Widget */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">

                            {/* Tabs */}
                            <div className="flex border-b border-neutral-100">
                                <button
                                    onClick={() => setActiveTab('offering')}
                                    className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'offering' ? 'bg-accent-teal text-white' : 'hover:bg-neutral-50 text-neutral-500'}`}
                                >
                                    OFFERING
                                </button>
                                <button
                                    onClick={() => setActiveTab('tithe')}
                                    className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'tithe' ? 'bg-accent-gold text-white' : 'hover:bg-neutral-50 text-neutral-500'}`}
                                >
                                    TITHE
                                </button>
                                <button
                                    onClick={() => setActiveTab('donation')}
                                    className={`flex-1 py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === 'donation' ? 'bg-primary text-white' : 'hover:bg-neutral-50 text-neutral-500'}`}
                                >
                                    DONATION
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8">
                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-neutral-700 mb-4 uppercase tracking-wider">Select Amount</label>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {['25', '50', '100', '250', '500'].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => handleAmountSelect(val)}
                                                className={`py-3 rounded-lg border font-bold transition-all ${amount === val && customAmount === '' ? `${activeColor} text-white border-transparent shadow-lg` : 'border-neutral-200 text-neutral-600 hover:border-accent-teal'}`}
                                            >
                                                ${val}
                                            </button>
                                        ))}
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                placeholder="Other"
                                                value={customAmount}
                                                onChange={handleCustomChange}
                                                className={`w-full h-full pl-7 pr-3 rounded-lg border font-bold outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${customAmount ? 'border-primary ring-primary' : 'border-neutral-200 focus:border-accent-teal focus:ring-accent-teal'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleGive}
                                        className={`w-full py-4 ${activeColor} text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2`}
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Give {amount ? `$${amount}` : 'Now'}
                                    </button>
                                    <p className="text-xs text-center text-neutral-400">
                                        By giving, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

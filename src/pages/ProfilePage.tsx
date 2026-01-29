import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { User, Mail, Phone, Save, Loader } from 'lucide-react';

interface UserProfileData {
    displayName?: string;
    bio?: string;
    contactInfo?: {
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
        type?: string;
    };
    tier?: string;
    createdAt?: {
        toDate(): Date;
    };
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Form State
    const [formData, setFormData] = useState({
        displayName: '',
        phoneNumber: '',
        bio: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const [profileData, setProfileData] = useState<UserProfileData | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, COLLECTIONS.USERS, user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserProfileData;
                    setProfileData(data);
                    setFormData({
                        displayName: data.displayName || '',
                        phoneNumber: data.contactInfo?.phone || '',
                        bio: data.bio || '',
                        address: data.contactInfo?.address || '',
                        city: data.contactInfo?.city || '',
                        state: data.contactInfo?.state || '',
                        zip: data.contactInfo?.zip || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: '', text: '' });

        try {
            const userRef = doc(db, COLLECTIONS.USERS, user!.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                bio: formData.bio,
                contactInfo: {
                    phone: formData.phoneNumber,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    type: profileData?.contactInfo?.type || 'local'
                }
            });
            setMsg({ type: 'success', text: 'Profile updated successfully!' });

            // Update local profile data
            setProfileData((prev: UserProfileData | null) => ({
                ...prev,
                displayName: formData.displayName,
                bio: formData.bio,
                contactInfo: {
                    ...prev?.contactInfo,
                    phone: formData.phoneNumber,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                }
            }));

        } catch (error) {
            console.error("Error updating profile:", error);
            setMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold font-montserrat text-primary-blue">My Profile</h1>

            {/* Profile Header Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-primary-blue text-white flex items-center justify-center text-3xl font-bold">
                    {profileData?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{profileData?.displayName || 'Member'}</h2>
                    <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                        <Mail size={16} /> {user?.email}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${profileData?.tier === 'golden_vessel' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {profileData?.tier === 'golden_vessel' ? 'Golden Vessel' : 'Vessel Member'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide">
                            Joined {profileData?.createdAt?.toDate().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Edit Details</h3>
                    {msg.text && (
                        <span className={`text-sm font-bold ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {msg.text}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Bio / About Me</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all resize-none"
                            placeholder="Tell us a little about yourself..."
                        />
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-2 md:col-span-2">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-2 border-b pb-2">Location Info</h4>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Street Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all"
                            placeholder="1234 Grace Lane"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all"
                            placeholder="Cityville"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all"
                                placeholder="ST"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Zip</label>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all"
                                placeholder="12345"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

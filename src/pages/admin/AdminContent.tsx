import { useState, useEffect } from 'react';
import { db, COLLECTIONS, storage } from '../../services/db';
import { collection, addDoc, serverTimestamp, setDoc, doc, deleteDoc, updateDoc, onSnapshot, query, orderBy, getDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Video, Calendar, Sun, Smile, BookOpen, Trash2, Edit, Save, X, UploadCloud, Users } from 'lucide-react';

type ContentType = 'sermon' | 'event' | 'devotional' | 'kid' | 'resource' | 'stream' | 'group_announcement';

export default function AdminContent() {
    const [activeTab, setActiveTab] = useState<ContentType>('sermon');
    const [formData, setFormData] = useState<any>({});
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
    const [contentList, setContentList] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Fetch Content
    useEffect(() => {
        if (activeTab === 'stream') return;

        let col = '';
        switch (activeTab) {
            case 'sermon': col = COLLECTIONS.CONTENT; break;
            case 'event': col = COLLECTIONS.EVENTS; break;
            case 'devotional': col = COLLECTIONS.DEVOTIONALS; break;
            case 'kid': col = COLLECTIONS.KIDS_CONTENT; break;
            case 'resource': col = COLLECTIONS.RESOURCES; break;
            case 'group_announcement': col = COLLECTIONS.CONTENT; break;
        }

        if (!col) return;

        let q;
        if (activeTab === 'group_announcement') {
            q = query(collection(db, col), where('type', '==', 'group_announcement'), orderBy('createdAt', 'desc'));
        } else if (activeTab === 'sermon') {
            q = query(collection(db, col), where('type', '==', 'sermon'), orderBy('createdAt', 'desc'));
        } else {
            q = query(collection(db, col), orderBy('createdAt', 'desc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContentList(list);
        });

        return () => unsubscribe();
    }, [activeTab]);

    // Check Stream Config
    useEffect(() => {
        if (activeTab === 'stream') {
            getDoc(doc(db, "config", "livestream")).then(docSnap => {
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                }
            });
            setViewMode('create'); // Stream is always a single form
        } else {
            setViewMode('list'); // Default to list for others
        }
    }, [activeTab]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'stream') {
                await setDoc(doc(db, "config", "livestream"), {
                    videoId: formData.videoId,
                    isLive: !!formData.isLive,
                    updatedAt: serverTimestamp()
                }, { merge: true });
                alert("Live Stream Config Updated!");
                return;
            }

            let fileUrl = '';
            if (file) {
                setUploading(true);
                try {
                    const storageRef = ref(storage, `uploads/${activeTab}/${Date.now()}_${file.name}`);
                    await uploadBytes(storageRef, file);
                    fileUrl = await getDownloadURL(storageRef);
                } catch (err) {
                    console.error("Upload failed", err);
                    alert("File upload failed");
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            const dataToSave = { ...formData };
            if (fileUrl) {
                if (activeTab === 'resource' || activeTab === 'kid') dataToSave.url = fileUrl;
                if (activeTab === 'sermon') dataToSave.videoUrl = fileUrl; // Override if file uploaded
                if (activeTab === 'devotional') dataToSave.audioUrl = fileUrl;
                if (activeTab === 'event') dataToSave.imageUrl = fileUrl;
            }

            let col = '';
            switch (activeTab) {
                case 'sermon': col = COLLECTIONS.CONTENT; break;
                case 'event': col = COLLECTIONS.EVENTS; break;
                case 'devotional': col = COLLECTIONS.DEVOTIONALS; break;
                case 'kid': col = COLLECTIONS.KIDS_CONTENT; break;
                case 'resource': col = COLLECTIONS.RESOURCES; break;
                case 'group_announcement': col = COLLECTIONS.CONTENT; break;
            }

            if (!col) return;

            if (viewMode === 'edit' && editingId) {
                // Update
                await updateDoc(doc(db, col, editingId), {
                    ...dataToSave,
                    updatedAt: serverTimestamp()
                });
                alert("Updated successfully!");
                setViewMode('list');
            } else {
                // Create
                await addDoc(collection(db, col), {
                    ...dataToSave,
                    type: activeTab,
                    createdAt: serverTimestamp()
                });
                alert("Created successfully!");
                setViewMode('list');
            }

            setFormData({});
            setFile(null);
            setEditingId(null);

        } catch (error) {
            console.error("Error saving content", error);
            alert("Failed to save content.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this content?")) return;

        let col = '';
        switch (activeTab) {
            case 'sermon': col = COLLECTIONS.CONTENT; break;
            case 'event': col = COLLECTIONS.EVENTS; break;
            case 'devotional': col = COLLECTIONS.DEVOTIONALS; break;
            case 'kid': col = COLLECTIONS.KIDS_CONTENT; break;
            case 'resource': col = COLLECTIONS.RESOURCES; break;
            case 'group_announcement': col = COLLECTIONS.CONTENT; break;
        }
        if (!col) return;

        await deleteDoc(doc(db, col, id));
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setEditingId(item.id);
        setViewMode('edit');
    };

    const handleInput = (key: string, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    const renderForm = () => {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{viewMode === 'create' ? 'Create New' : 'Edit Content'}</h2>
                    {activeTab !== 'stream' && (
                        <button type="button" onClick={() => { setViewMode('list'); setFormData({}); }} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Common Fields */}
                <div>
                    <label className="block text-sm font-bold mb-1">Title</label>
                    <input
                        className="w-full p-3 border rounded-lg"
                        value={formData.title || ''}
                        onChange={e => handleInput('title', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Description / Content</label>
                    <textarea
                        className="w-full p-3 border rounded-lg"
                        rows={4}
                        value={formData.description || ''}
                        onChange={e => handleInput('description', e.target.value)}
                        required
                    />
                </div>

                {/* Specific Fields */}
                {activeTab === 'event' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Date</label>
                            <input type="date" value={formData.date || ''} className="w-full p-3 border rounded-lg" onChange={e => handleInput('date', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Time</label>
                            <input type="time" value={formData.time || ''} className="w-full p-3 border rounded-lg" onChange={e => handleInput('time', e.target.value)} required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Location</label>
                            <input className="w-full p-3 border rounded-lg" value={formData.location || ''} onChange={e => handleInput('location', e.target.value)} required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Category</label>
                            <select className="w-full p-3 border rounded-lg" value={formData.category || ''} onChange={e => handleInput('category', e.target.value)} required>
                                <option value="">Select Category</option>
                                <option value="Worship">Worship</option>
                                <option value="Conference">Conference</option>
                                <option value="Outreach">Outreach</option>
                                <option value="Family">Family</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'sermon' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-1">Video URL (YouTube/Vimeo)</label>
                            <input className="w-full p-3 border rounded-lg" value={formData.videoUrl || ''} onChange={e => handleInput('videoUrl', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Preacher / Speaker</label>
                            <input className="w-full p-3 border rounded-lg" value={formData.author || ''} onChange={e => handleInput('author', e.target.value)} />
                        </div>
                    </>
                )}

                {activeTab === 'devotional' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-1">Scripture Reference</label>
                            <input className="w-full p-3 border rounded-lg" value={formData.scriptureReference || ''} onChange={e => handleInput('scriptureReference', e.target.value)} required placeholder="e.g. John 3:16" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Scripture Text</label>
                            <textarea
                                className="w-full p-3 border rounded-lg"
                                rows={2}
                                value={formData.scriptureText || ''}
                                onChange={e => handleInput('scriptureText', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Audio URL (Optional)</label>
                            <input className="w-full p-3 border rounded-lg" value={formData.audioUrl || ''} onChange={e => handleInput('audioUrl', e.target.value)} />
                        </div>
                    </>
                )}

                {activeTab === 'kid' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Type</label>
                            <select className="w-full p-3 border rounded-lg" value={formData.contentType || ''} onChange={e => handleInput('contentType', e.target.value)} required>
                                <option value="video">Video</option>
                                <option value="worksheet">Worksheet</option>
                                <option value="song">Song</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Age Group</label>
                            <select className="w-full p-3 border rounded-lg" value={formData.ageGroup || ''} onChange={e => handleInput('ageGroup', e.target.value)} required>
                                <option value="Preschool">Preschool</option>
                                <option value="Elementary">Elementary</option>
                                <option value="Pre-Teen">Pre-Teen</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Resource URL</label>
                            <input className="w-full p-3 border rounded-lg" value={formData.url || ''} onChange={e => handleInput('url', e.target.value)} required />
                        </div>
                    </div>
                )}

                {activeTab === 'group_announcement' && (
                    <div>
                        <label className="block text-sm font-bold mb-1">Target Group</label>
                        <select className="w-full p-3 border rounded-lg" value={formData.groupId || ''} onChange={e => handleInput('groupId', e.target.value)} required>
                            <option value="">Select Group...</option>
                            <option value="1">Men of Valor</option>
                            <option value="2">Women of Destiny</option>
                            <option value="3">Young Adults (The Bridge)</option>
                            <option value="4">Kingdom Marriage</option>
                            <option value="all">All Groups</option>
                        </select>
                    </div>
                )}
                {activeTab === 'stream' && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
                            Update the Live Stream configuration. This controls what users see on the "Live Stream" page.
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">YouTube Video ID</label>
                            <input
                                className="w-full p-3 border rounded-lg"
                                placeholder="e.g. jNQXAC9IVRw"
                                value={formData.videoId || ''}
                                onChange={e => handleInput('videoId', e.target.value)}
                                required
                            />
                            <p className="text-xs text-neutral-500 mt-1">Found in the URL: youtube.com/watch?v=<b>VIDEO_ID</b></p>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5"
                                    checked={!!formData.isLive}
                                    onChange={e => handleInput('isLive', e.target.checked)}
                                />
                                <span className="font-bold text-neutral-700">Service is Currently Live</span>
                            </label>
                        </div>
                    </div>
                )}

                {(activeTab === 'resource' || activeTab === 'sermon' || activeTab === 'devotional' || activeTab === 'kid' || activeTab === 'event') && (
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mt-4">
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                            <UploadCloud size={18} /> Upload Media
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full text-sm text-neutral-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                            Uploading a file will automatically fill the URL field. Supported: Video, Audio, PDF, Images.
                            {activeTab === 'sermon' && ' (Overrides Video URL)'}
                        </p>
                    </div>
                )}

                <button disabled={uploading} type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-blue transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                    {uploading ? 'Uploading...' : (viewMode === 'create' ? <Plus size={20} /> : <Save size={20} />)}
                    {uploading ? 'Please Wait' : (viewMode === 'create' ? 'Publish Content' : 'Update Content')}
                </button>
            </div>
        );
    };

    const renderList = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage {activeTab.toUpperCase()}S</h2>
                <button onClick={() => { setViewMode('create'); setFormData({}); }} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800">
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Title</th>
                            {activeTab === 'event' && <th className="p-4">Date</th>}
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {contentList.map(item => (
                            <tr key={item.id} className="hover:bg-neutral-50">
                                <td className="p-4 font-bold">{item.title}</td>
                                {activeTab === 'event' && <td className="p-4 text-sm text-neutral-600">{item.date}</td>}
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {contentList.length === 0 && <div className="p-8 text-center text-neutral-400">No content found.</div>}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <h1 className="text-3xl font-bold text-neutral-800">Content Management System</h1>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'sermon', label: 'Sermons', icon: <Video size={18} /> },
                    { id: 'event', label: 'Events', icon: <Calendar size={18} /> },
                    { id: 'devotional', label: 'Daily Bread', icon: <Sun size={18} /> },
                    { id: 'kid', label: 'Kids Kingdom', icon: <Smile size={18} /> },
                    { id: 'resource', label: 'Library', icon: <BookOpen size={18} /> },
                    { id: 'group_announcement', label: 'Group Update', icon: <Users size={18} /> },
                    { id: 'stream', label: 'Live Stream', icon: <Video size={18} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as ContentType); setFormData({}); setViewMode('list'); }}
                        className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white text-neutral-500 hover:bg-neutral-50'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Form or List Container */}
            {viewMode === 'list' && activeTab !== 'stream'
                ? renderList()
                : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                        <form onSubmit={handleSubmit}>
                            {renderForm()}
                        </form>
                    </div>
                )
            }
        </div>
    );
}

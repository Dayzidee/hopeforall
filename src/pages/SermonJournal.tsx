import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { BookOpen, Plus, Trash2, Save, X, Edit3 } from 'lucide-react';
import PremiumUpsellBanner from '../components/dashboard/PremiumUpsellBanner';

interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    sermonDate: string; // YYYY-MM-DD
    tags: string[];
    createdAt: any;
}

export default function SermonJournal() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState<Partial<Note>>({});
    const [loading, setLoading] = useState(true);

    // Fetch Notes
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, COLLECTIONS.NOTES),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Note[];
            setNotes(fetched);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !currentNote.title || !currentNote.content) return;

        try {
            if (currentNote.id) {
                // Update
                const noteRef = doc(db, COLLECTIONS.NOTES, currentNote.id);
                await updateDoc(noteRef, {
                    title: currentNote.title,
                    content: currentNote.content,
                    sermonDate: currentNote.sermonDate || new Date().toISOString().split('T')[0],
                    // tags: currentNote.tags
                });
            } else {
                // Create
                await addDoc(collection(db, COLLECTIONS.NOTES), {
                    userId: user.uid,
                    title: currentNote.title,
                    content: currentNote.content,
                    sermonDate: currentNote.sermonDate || new Date().toISOString().split('T')[0],
                    tags: [],
                    createdAt: serverTimestamp()
                });
            }
            setIsEditing(false);
            setCurrentNote({});
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save note");
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.NOTES, id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const openNote = (note: Note) => {
        setCurrentNote(note);
        setIsEditing(true);
    };



    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <PremiumUpsellBanner featureName="Journal" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-montserrat font-bold text-primary-blue flex items-center gap-3">
                        <BookOpen className="text-accent-teal" /> Sermon Journal
                    </h1>
                    <p className="text-neutral-500 mt-1">Capture revelation and track your spiritual growth.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => { setCurrentNote({}); setIsEditing(true); }}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} /> New Entry
                    </button>
                )}
            </div>

            {isEditing ? (
                // --- EDITOR MODE ---
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden animate-scale-in">
                    <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                        <h3 className="font-bold text-lg text-neutral-800">{currentNote.id ? 'Edit Entry' : 'New Sermon Entry'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-neutral-600">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSave} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Passage / Title</label>
                                <input
                                    required
                                    value={currentNote.title || ''}
                                    onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
                                    placeholder="e.g. Walking in Victory - Romans 8"
                                    className="w-full p-4 text-lg font-bold border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={currentNote.sermonDate || new Date().toISOString().split('T')[0]}
                                    onChange={e => setCurrentNote({ ...currentNote, sermonDate: e.target.value })}
                                    className="w-full p-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-1">Notes & Revelation</label>
                            <textarea
                                required
                                rows={12}
                                value={currentNote.content || ''}
                                onChange={e => setCurrentNote({ ...currentNote, content: e.target.value })}
                                placeholder="What is God speaking to you today?..."
                                className="w-full p-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed text-neutral-700 font-sans"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-8 py-3 bg-accent-teal text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <Save size={20} /> Save Entry
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // --- LIST MODE ---
                <>
                    {notes.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-neutral-200">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-700 mb-2">No notes yet</h3>
                            <p className="text-neutral-500 mb-6">Start documenting your spiritual journey today.</p>
                            <button
                                onClick={() => { setCurrentNote({}); setIsEditing(true); }}
                                className="text-primary font-bold hover:underline"
                            >
                                Create your first entry
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => openNote(note)}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all group flex flex-col h-64 relative overflow-hidden"
                            >
                                {/* Decorative top border */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-teal opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-100">
                                        {note.sermonDate}
                                    </span>
                                    <button
                                        onClick={(e) => handleDelete(note.id, e)}
                                        className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <h3 className="font-bold text-lg text-primary-blue mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {note.title}
                                </h3>

                                <p className="text-neutral-500 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">
                                    {note.content}
                                </p>

                                <div className="mt-auto pt-4 flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    <Edit3 size={14} className="mr-1" /> Edit Note
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

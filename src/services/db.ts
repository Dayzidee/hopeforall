import {
    collection,
    doc,
    getDoc,
    setDoc,
    addDoc,
    query,
    getDocs,
    Timestamp,
    serverTimestamp
} from "firebase/firestore";
import { db, storage } from "../lib/firebase";
export { db, storage };

// Collection references
export const COLLECTIONS = {
    USERS: "users",
    DONATIONS: "donations",
    EVENTS: "events",
    PRAYER_REQUESTS: "prayer_requests",
    CONTENT: "content",
    NOTES: "sermon_notes",
    DEVOTIONALS: "devotionals",
    RESOURCES: "resources",
    GROUPS: "groups",
    ASSESSMENTS: "assessments",
    QUESTIONS: "questions",
    KIDS_CONTENT: "kids_content",
    NOTIFICATIONS: "notifications",
    MESSAGES: "community_messages",
    PRAYERS: "prayers",
    PASTOR_INTERACTIONS: "pastor_interactions"
};

// User Types
export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: "member" | "admin" | "pastor";
    tier: "vessel" | "golden_vessel";
    badges: string[];
    subscriptionDate?: any; // Timestamp
    contactInfo?: {
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        type: 'local' | 'virtual';
    };
    createdAt: Timestamp;
    lastLogin: Timestamp;
}

// --- User Services ---

export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await setDoc(userRef, {
        uid,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: "member", // default role
        tier: "vessel", // default tie
        badges: ["new_member"],
        ...data
    }, { merge: true });
};

export const getUserProfile = async (uid: string) => {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() as UserProfile : null;
};

// --- Content Services ---

export const getEvents = async () => {
    const q = query(collection(db, COLLECTIONS.EVENTS));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Donation Services ---

export const createDonationRecord = async (userId: string, amount: number, type: string) => {
    return await addDoc(collection(db, COLLECTIONS.DONATIONS), {
        userId,
        amount,
        type, // 'tithe', 'offering', 'seed'
        status: 'pending',
        createdAt: serverTimestamp()
    });
};

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from "firebase/auth";
import { auth } from "../lib/firebase";

import { getUserProfile, type UserProfile, db, COLLECTIONS } from "../services/db";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if auth is initialized correctly (env vars might be missing)
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Check your environment variables.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch User Profile
        try {
          const profile = await getUserProfile(currentUser.uid);

          if (profile) {
            setUserProfile(profile);
            setIsAdmin(profile.role === 'admin' || currentUser.email?.includes("admin") || false);
          } else {
            console.warn("User profile missing. Auto-creating...");
            // Auto-create missing profile
            const newProfile: any = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || '',
              role: 'member',
              tier: 'vessel',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              badges: ['recovered']
            };

            await setDoc(doc(db, COLLECTIONS.USERS, currentUser.uid), newProfile);
            setUserProfile(newProfile);
            setIsAdmin(false);
          }

        } catch (err) {
          console.error("Error fetching user profile:", err);
          // Fallback
          setIsAdmin(currentUser.email?.includes("admin") || false);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Auth Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign In failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, logout, signInWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

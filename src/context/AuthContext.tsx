import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // In a real app with valid config, this listener works.
    // If config is invalid, this might log errors to console but won't crash app immediately unless called.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Here you would typically check a custom claim or a firestore document for admin role
        // For now we will mock it based on email or just set false
        // const tokenResult = await currentUser.getIdTokenResult();
        // setIsAdmin(!!tokenResult.claims.admin);

        // Mock admin check for demo purposes (replace with real logic)
        setIsAdmin(currentUser.email?.includes("admin") || false);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    }, (error) => {
      console.warn("Firebase Auth Error (likely due to placeholder config):", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
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

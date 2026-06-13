import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  loginAsSandboxUser: (role: 'student' | 'professional', email?: string, name?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
  loginAsSandboxUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sandboxSession, setSandboxSession] = useState<any | null>(() => {
    try {
      const stored = localStorage.getItem('sandbox_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginAsSandboxUser = (role: 'student' | 'professional', email = 'testuser@sandbox.com', name = 'Demo Sandbox User') => {
    const sandboxUser = {
      uid: `sandbox_${role}_${Date.now()}`,
      email,
      displayName: name,
      photoURL: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200',
      isSandbox: true,
    };
    const sandboxProfile = {
      uid: sandboxUser.uid,
      email,
      displayName: name,
      role,
      profileImage: sandboxUser.photoURL,
      isSandbox: true,
    };
    const session = { user: sandboxUser, profile: sandboxProfile };
    setSandboxSession(session);
    try {
      localStorage.setItem('sandbox_session', JSON.stringify(session));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    if (sandboxSession) {
      setSandboxSession(null);
      try {
        localStorage.removeItem('sandbox_session');
      } catch (err) {
        console.error(err);
      }
    }
    await signOut(auth);
  };

  useEffect(() => {
    if (sandboxSession) {
      setUser(sandboxSession.user);
      setProfile(sandboxSession.profile);
      setIsAdmin(sandboxSession.profile.role === 'admin');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile(data);
          setIsAdmin(data.role === 'admin');
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sandboxSession]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, logout, loginAsSandboxUser }}>
      {children}
    </AuthContext.Provider>
  );
};

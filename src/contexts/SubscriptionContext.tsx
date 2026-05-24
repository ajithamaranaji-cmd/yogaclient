import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestore';
import { doc, onSnapshot, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { addDays, isAfter } from 'date-fns';

interface SubscriptionData {
  isActive: boolean;
  expiresAt: string | null;
  credits: number;
  unlockedProfiles: string[];
  savedProfiles: string[];
}

interface SubscriptionContextType {
  subscription: SubscriptionData;
  isPremium: boolean;
  isLoading: boolean;
  unlockProfileContact: (profileId: string) => Promise<boolean>;
  saveProfile: (profileId: string) => Promise<void>;
  removeSavedProfile: (profileId: string) => Promise<void>;
  purchasePremium: () => Promise<void>;
  purchaseCredits: () => Promise<void>;
  verifyPremiumAccess: () => boolean;
  isSubscriptionActive: () => boolean;
  hasAvailableCredits: () => boolean;
  canAccessPremiumContent: () => boolean;
  paymentVerification: (paymentId: string) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    isActive: false,
    expiresAt: null,
    credits: 0,
    unlockedProfiles: [],
    savedProfiles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription({
        isActive: false,
        expiresAt: null,
        credits: 0,
        unlockedProfiles: [],
        savedProfiles: [],
      });
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const expiresAt = data.subscriptionExpiresAt;
        const isActive = expiresAt ? isAfter(new Date(expiresAt), new Date()) : false;

        setSubscription({
          isActive,
          expiresAt: expiresAt || null,
          credits: data.credits || 0,
          unlockedProfiles: data.unlockedProfiles || [],
          savedProfiles: data.savedProfiles || [],
        });
      } else {
        setSubscription({
          isActive: false,
          expiresAt: null,
          credits: 0,
          unlockedProfiles: [],
          savedProfiles: [],
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isSubscriptionActive = () => {
    if (!subscription.expiresAt) return false;
    return isAfter(new Date(subscription.expiresAt), new Date());
  };

  const hasAvailableCredits = () => {
    return subscription.credits > 0;
  };

  const verifyPremiumAccess = () => {
    return user !== null && isSubscriptionActive() && hasAvailableCredits();
  };

  const canAccessPremiumContent = () => {
    return user !== null && isSubscriptionActive();
  };

  const isPremium = isSubscriptionActive();

  const paymentVerification = async (paymentId: string) => {
    // This would normally call a backend API to verify the transaction
    console.log('Verifying payment:', paymentId);
    return true; // Mock success
  };

  const unlockProfileContact = async (profileId: string) => {
    if (!user) return false;
    
    // Strict Backend-like validation logic
    if (!verifyPremiumAccess()) {
      console.error('Premium access validation failed');
      return false;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        credits: increment(-1),
        unlockedProfiles: arrayUnion(profileId),
      });
      return true;
    } catch (error) {
      console.error('Error unlocking profile:', error);
      return false;
    }
  };

  const saveProfile = async (profileId: string) => {
    if (!user || !isPremium) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedProfiles: arrayUnion(profileId),
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const removeSavedProfile = async (profileId: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedProfiles: arrayRemove(profileId),
      });
    } catch (error) {
      console.error('Error removing saved profile:', error);
    }
  };

  const purchasePremium = async () => {
    if (!user) return;
    
    const verified = await paymentVerification('mock_sub_id');
    if (!verified) return;

    const expiry = addDays(new Date(), 28).toISOString();
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        subscriptionExpiresAt: expiry,
        credits: 30, // Reset to 30 as per rules
      });
    } catch (error) {
      console.error('Error purchasing premium:', error);
    }
  };

  const purchaseCredits = async () => {
    if (!user || !isPremium) return;

    const verified = await paymentVerification('mock_credit_id');
    if (!verified) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        credits: increment(10),
      });
    } catch (error) {
      console.error('Error purchasing credits:', error);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      subscription, 
      isPremium, 
      isLoading,
      unlockProfileContact,
      saveProfile,
      removeSavedProfile,
      purchasePremium,
      purchaseCredits,
      verifyPremiumAccess,
      isSubscriptionActive,
      hasAvailableCredits,
      canAccessPremiumContent,
      paymentVerification
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

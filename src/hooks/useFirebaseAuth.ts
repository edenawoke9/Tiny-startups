import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getUser, ensureUserDocument } from '@/lib/firestore';
import { User } from '@/lib/types';

// Extended user type that merges Firebase User with our custom User properties
type ExtendedUser = FirebaseUser & Partial<User>;

export function useFirebaseAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
   
      if (firebaseUser) {
        // Ensure user document exists in Firestore
        try {
          await ensureUserDocument(firebaseUser);
          const dbUser = await getUser(firebaseUser.uid);
          setUser({ ...firebaseUser, ...dbUser } as ExtendedUser);
        } catch (err) {
          console.error('Error ensuring user document:', err);
          setUser(firebaseUser as ExtendedUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      setError(`${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      setError(`${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      console.error('Sign-out error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  };
} 
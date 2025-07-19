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

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null); // allow merged user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
   
      if (firebaseUser) {
        // Ensure user document exists in Firestore
        try {
          await ensureUserDocument(firebaseUser);
          const dbUser = await getUser(firebaseUser.uid);
          setUser({ ...firebaseUser, ...dbUser });
        } catch (err) {
          console.error('Error ensuring user document:', err);
          setUser(firebaseUser);
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
      console.log('Attempting Google sign-in...');
      console.log('Current domain:', window.location.origin);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful:', result.user);
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      console.error('Error code:', (err as Error).code);
      console.error('Error message:', (err as Error).message);
      setError(`${(err as Error).code}: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log('Attempting GitHub sign-in...');
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('GitHub sign-in successful:', result.user);
    } catch (err: unknown) {
      console.error('GitHub sign-in error:', err);
      console.error('Error code:', (err as Error).code);
      console.error('Error message:', (err as Error).message);
      setError(`${(err as Error).code}: ${(err as Error).message}`);
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
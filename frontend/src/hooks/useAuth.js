import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Realtime Database
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          
          if (!snapshot.exists()) {
            // Initialize user data if it doesn't exist
            const userData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              createdAt: new Date().toISOString(),
              goals: [],
              preferences: {}
            };
            await set(userRef, userData);
            setUser({ ...userData, uid: firebaseUser.uid });
          } else {
            // Combine Firebase user data with database data
            setUser({
              ...snapshot.val(),
              uid: firebaseUser.uid,
              email: firebaseUser.email
            });
          }
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}; 
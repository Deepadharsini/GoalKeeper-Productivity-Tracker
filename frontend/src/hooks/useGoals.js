import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from './useAuth'; // Assuming you have an auth hook

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const goalsRef = ref(db, `goals/${user.uid}`);
    
    // Set up real-time listener
    const unsubscribe = onValue(goalsRef, (snapshot) => {
      try {
        setLoading(true);
        if (!snapshot.exists()) {
          setGoals([]);
        } else {
          const goalsData = snapshot.val();
          const goalsArray = Object.entries(goalsData).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setGoals(goalsArray);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      off(goalsRef);
    };
  }, [user]);

  return { goals, loading, error };
};

// Hook for single goal
export const useGoal = (goalId) => {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !goalId) {
      setGoal(null);
      setLoading(false);
      return;
    }

    const goalRef = ref(db, `goals/${user.uid}/${goalId}`);
    
    const unsubscribe = onValue(goalRef, (snapshot) => {
      try {
        setLoading(true);
        if (!snapshot.exists()) {
          setGoal(null);
        } else {
          setGoal({
            id: snapshot.key,
            ...snapshot.val()
          });
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching goal:', err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => {
      off(goalRef);
    };
  }, [user, goalId]);

  return { goal, loading, error };
}; 
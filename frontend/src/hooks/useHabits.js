import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return;
      
      try {
        const habitsRef = collection(firestore, 'habits');
        const q = query(habitsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const habitsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setHabits(habitsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user]);

  return { habits, loading, error };
}; 
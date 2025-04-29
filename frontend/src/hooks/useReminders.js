import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const useReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return;
      
      try {
        const remindersRef = collection(firestore, 'reminders');
        const q = query(remindersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const remindersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setReminders(remindersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReminders();
  }, [user]);

  return { reminders, loading, error };
}; 
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const useLoginStats = () => {
  const [monthlyCounts, setMonthlyCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const statsRef = doc(firestore, 'loginStats', user.uid);
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setMonthlyCounts(statsSnap.data());
        } else {
          setMonthlyCounts({});
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return { monthlyCounts, loading, error };
}; 
export const calculateStreak = (lastDate) => {
    if (!lastDate) return 1;
  
    const last = new Date(lastDate);
    const today = new Date();
  
    const diff = (today - last) / (1000 * 60 * 60 * 24);
  
    if (diff < 1) return 1;        // same day
    if (diff < 2) return 2;        // next day – streak continues
    return 1;                      // streak reset
  };
  
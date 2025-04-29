const goalsCompleted = goals.filter(goal => goal.status === 'completed').length;
const habitsCompleted = habits.reduce((count, habit) => {
  return count + (habit.completedDates?.length || 0);
}, 0);

setStats({
  goalsCompleted,
  habitsCompleted,
  loading: false,
  error: null
});

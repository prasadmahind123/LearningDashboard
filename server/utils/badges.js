export const calculateBadges = (learner) => {
  const badges = [];

  if (learner.currentStreak >= 7)
    badges.push({ title: "7-Day Streak", icon: "🔥" });

  if (learner.currentStreak >= 14)
    badges.push({ title: "14-Day Streak", icon: "🔥🔥" });

  if (learner.totalLearningHours >= 100)
    badges.push({ title: "100+ Hours", icon: "⏱️" });

  const nightActivity = learner.learningActivity?.some(a => {
    const hour = new Date(a.date).getHours();
    return hour >= 22 || hour <= 5;
  });

  if (nightActivity)
    badges.push({ title: "Night Owl", icon: "🌙" });

  return badges;
};

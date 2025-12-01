import dayjs from "dayjs";
import Learner from "../models/learner.js";

export const updateLearnerStats = async (learnerId) => {
  const learner = await Learner.findById(learnerId);
  if (!learner) return;

  const now = dayjs();
  const yesterday = now.subtract(1, "day").startOf("day");
  const weekStart = now.startOf("week");
  const monthStart = now.startOf("month");

  // 1. Recalculate Total Hours
  learner.totalLearningHours = learner.learningActivity.reduce(
    (sum, entry) => sum + entry.hoursSpent,
    0
  );

  // 2. Calculate stats for Dashboard cards
  learner.progressStats.yesterdayHours = learner.learningActivity
    .filter((entry) => dayjs(entry.date).isSame(yesterday, "day"))
    .reduce((sum, entry) => sum + entry.hoursSpent, 0);

  learner.progressStats.weekHours = learner.learningActivity
    .filter((entry) =>
      dayjs(entry.date).isAfter(weekStart) || dayjs(entry.date).isSame(weekStart)
    )
    .reduce((sum, entry) => sum + entry.hoursSpent, 0);

  learner.progressStats.monthHours = learner.learningActivity
    .filter((entry) =>
      dayjs(entry.date).isAfter(monthStart) || dayjs(entry.date).isSame(monthStart)
    )
    .reduce((sum, entry) => sum + entry.hoursSpent, 0);

  // 3. Calculate Streak
  learner.currentStreak = calculateStreak(learner.learningActivity);

  learner.totalCoursesEnrolled = learner.enrolledPaths.length;

  await learner.save();
  return learner;
};

// Helper: Calculate daily streak
const calculateStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;

  // Get all unique dates where activity occurred
  const activityDates = [
    ...new Set(
      activities.map((a) => dayjs(a.date).format("YYYY-MM-DD"))
    ),
  ].sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)

  if (activityDates.length === 0) return 0;

  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  // If no activity today or yesterday, streak is broken
  if (activityDates[0] !== today && activityDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1; // Start with 1 since we confirmed activity today/yesterday

  // Iterate backwards to check consecutiveness
  // Start comparing index 0 vs index 1, index 1 vs index 2...
  for (let i = 0; i < activityDates.length - 1; i++) {
    const current = dayjs(activityDates[i]);
    const previous = dayjs(activityDates[i + 1]);

    const diff = current.diff(previous, "day");

    if (diff === 1) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
};

// Helper: Aggregate activity for charts
export const getAggregatedActivity = (activities) => {
  const grouped = {};

  activities.forEach((act) => {
    const dateKey = dayjs(act.date).format("YYYY-MM-DD");
    if (!grouped[dateKey]) {
      grouped[dateKey] = 0;
    }
    grouped[dateKey] += act.hoursSpent;
  });

  // Convert to array
  return Object.entries(grouped).map(([date, hours]) => ({
    date,
    hoursSpent: hours,
  }));
};
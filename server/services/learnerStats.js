// import dayjs from "dayjs";
// import Learner from "../models/learner.js";

// export const updateLearnerStats = async (learnerId) => {
//   const learner = await Learner.findById(learnerId);
//   if (!learner) return;

//   const now = dayjs();
//   const yesterday = now.subtract(1, "day").startOf("day");
//   const weekStart = now.startOf("week");
//   const monthStart = now.startOf("month");

//   // 1. Recalculate Total Hours
//   learner.totalLearningHours = learner.learningActivity.reduce(
//     (sum, entry) => sum + entry.hoursSpent,
//     0
//   );

//   // 2. Calculate stats for Dashboard cards
//   learner.progressStats.yesterdayHours = learner.learningActivity
//     .filter((entry) => dayjs(entry.date).isSame(yesterday, "day"))
//     .reduce((sum, entry) => sum + entry.hoursSpent, 0);

//   learner.progressStats.weekHours = learner.learningActivity
//     .filter((entry) =>
//       dayjs(entry.date).isAfter(weekStart) || dayjs(entry.date).isSame(weekStart)
//     )
//     .reduce((sum, entry) => sum + entry.hoursSpent, 0);

//   learner.progressStats.monthHours = learner.learningActivity
//     .filter((entry) =>
//       dayjs(entry.date).isAfter(monthStart) || dayjs(entry.date).isSame(monthStart)
//     )
//     .reduce((sum, entry) => sum + entry.hoursSpent, 0);

//   // 3. Calculate Streak
//   learner.currentStreak = calculateCurrentStreak(learner.learningActivity);

//   learner.totalCoursesEnrolled = learner.enrolledPaths.length;

//   await learner.save();
//   return learner;
// };

// // Helper: Calculate daily streak
// // const calculateStreak = (activities) => {
// //   if (!activities || activities.length === 0) return 0;

// //   // Get all unique dates where activity occurred
// //   const activityDates = [
// //     ...new Set(
// //       activities.map((a) => dayjs(a.date).format("YYYY-MM-DD"))
// //     ),
// //   ].sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)

// //   if (activityDates.length === 0) return 0;

// //   const today = dayjs().format("YYYY-MM-DD");
// //   const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

// //   // If no activity today or yesterday, streak is broken
// //   if (activityDates[0] !== today && activityDates[0] !== yesterday) {
// //     return 0;
// //   }

// //   let streak = 1; // Start with 1 since we confirmed activity today/yesterday

// //   // Iterate backwards to check consecutiveness
// //   // Start comparing index 0 vs index 1, index 1 vs index 2...
// //   for (let i = 0; i < activityDates.length - 1; i++) {
// //     const current = dayjs(activityDates[i]);
// //     const previous = dayjs(activityDates[i + 1]);

// //     const diff = current.diff(previous, "day");

// //     if (diff === 1) {
// //       streak++;
// //     } else {
// //       break; // Streak broken
// //     }
// //   }

// //   return streak;
// // };

// // Helper: Aggregate activity for charts
// export const getAggregatedActivity = (activities) => {
//   const grouped = {};

//   activities.forEach((act) => {
//     const dateKey = dayjs(act.date).format("YYYY-MM-DD");
//     if (!grouped[dateKey]) {
//       grouped[dateKey] = 0;
//     }
//     grouped[dateKey] += act.hoursSpent;
//   });

//   // Convert to array
//   return Object.entries(grouped).map(([date, hours]) => ({
//     date,
//     hoursSpent: hours,
//   }));
// };

// const calculateCurrentStreak = (learningActivity = []) => {
//   if (learningActivity.length === 0) return 0;

//   // 1️⃣ Extract unique dates (YYYY-MM-DD)
//   const uniqueDays = [
//     ...new Set(
//       learningActivity.map(a =>
//         new Date(a.date).toISOString().split("T")[0]
//       )
//     )
//   ];

//   // 2️⃣ Sort days descending (latest first)
//   uniqueDays.sort((a, b) => new Date(b) - new Date(a));

//   let streak = 0;
//   let expectedDate = new Date();

//   // Normalize expectedDate to YYYY-MM-DD
//   expectedDate = expectedDate.toISOString().split("T")[0];

//   for (const day of uniqueDays) {
//     if (day === expectedDate) {
//       streak++;
//       // move expected date back by 1 day
//       const d = new Date(expectedDate);
//       d.setDate(d.getDate() - 1);
//       expectedDate = d.toISOString().split("T")[0];
//     } else {
//       break; // streak broken
//     }
//   }

//   return streak;
// };


import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import Learner from "../models/learner.js";

dayjs.extend(isSameOrAfter);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Given an array of learningActivity entries, group by calendar day and
 * return a sorted array of { date: "YYYY-MM-DD", hoursSpent: number }.
 * This is used by charts that need one value per day.
 */
export const getAggregatedActivity = (activities = []) => {
  const grouped = {};

  for (const act of activities) {
    const key = dayjs(act.date).format("YYYY-MM-DD");
    grouped[key] = (grouped[key] ?? 0) + act.hoursSpent;
  }

  return Object.entries(grouped)
    .map(([date, hoursSpent]) => ({ date, hoursSpent }))
    .sort((a, b) => (a.date < b.date ? -1 : 1)); // ascending chronological
};

/**
 * Count how many consecutive calendar days (ending today or yesterday)
 * appear in the activity log.
 *
 * Rules:
 *  - A streak is active if the learner studied today OR yesterday.
 *  - Gaps of more than one day break the streak.
 */
const calculateCurrentStreak = (learningActivity = []) => {
  if (!learningActivity.length) return 0;

  // Unique calendar days that have activity
  const uniqueDays = [
    ...new Set(learningActivity.map((a) => dayjs(a.date).format("YYYY-MM-DD"))),
  ].sort((a, b) => (a > b ? -1 : 1)); // descending (newest first)

  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  // Streak is only active if learner studied today or yesterday
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 0;
  let expected = uniqueDays[0]; // start from the most recent active day

  for (const day of uniqueDays) {
    if (day === expected) {
      streak++;
      expected = dayjs(expected).subtract(1, "day").format("YYYY-MM-DD");
    } else {
      break; // gap found — streak is over
    }
  }

  return streak;
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SERVICE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recompute and persist all aggregate stats for a learner.
 * Call this after any mutation to learningActivity or enrolledPaths.
 *
 * @param {string|ObjectId} learnerId
 * @returns {Promise<import('../models/learner.js').default | null>}
 */
export const updateLearnerStats = async (learnerId) => {
  const learner = await Learner.findById(learnerId);
  if (!learner) return null;

  const activity = learner.learningActivity;

  // 1. Recalculate total lifetime hours
  learner.totalLearningHours = activity.reduce((sum, e) => sum + e.hoursSpent, 0);

  // 2. Dashboard snapshot values
  const todayStart     = dayjs().startOf("day");
  const yesterdayStart = dayjs().subtract(1, "day").startOf("day");
  const weekStart      = dayjs().startOf("week");
  const monthStart     = dayjs().startOf("month");

  const hoursIn = (from, to) =>
    activity
      .filter((e) => {
        const d = dayjs(e.date);
        return d.isSameOrAfter(from) && (to ? d.isBefore(to) : true);
      })
      .reduce((sum, e) => sum + e.hoursSpent, 0);

  learner.progressStats.yesterdayHours = hoursIn(yesterdayStart, todayStart);
  learner.progressStats.weekHours      = hoursIn(weekStart);
  learner.progressStats.monthHours     = hoursIn(monthStart);

  // 3. Streaks
  const streak = calculateCurrentStreak(activity);
  learner.currentStreak = streak;
  learner.longestStreak = Math.max(learner.longestStreak ?? 0, streak);

  // 4. Enrolled course count (kept in sync with actual array length)
  learner.totalCoursesEnrolled = learner.enrolledPaths.length;

  await learner.save();
  return learner;
};

/**
 * Return the last `n` calendar days of aggregated activity, padding
 * missing days with 0 hours.  Useful for "last 7 days" bar charts.
 *
 * @param {Array}  activities - learner.learningActivity
 * @param {number} days       - how many past days to include (default 7)
 * @returns {{ date: string, hoursSpent: number, label: string }[]}
 */
export const getRecentActivity = (activities = [], days = 7) => {
  const aggregated = getAggregatedActivity(activities);
  const lookup = Object.fromEntries(aggregated.map((e) => [e.date, e.hoursSpent]));

  return Array.from({ length: days }, (_, i) => {
    const d = dayjs().subtract(days - 1 - i, "day");
    const key = d.format("YYYY-MM-DD");
    return {
      date: key,
      hoursSpent: lookup[key] ?? 0,
      label: d.format("ddd"), // "Mon", "Tue", …
    };
  });
};
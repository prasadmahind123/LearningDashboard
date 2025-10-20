import dayjs from "dayjs";
import Learner from "../models/learner.js";

export const updateLearnerStats = async (learnerId) => {
  const learner = await Learner.findById(learnerId);
  console.log(learnerId)
  if (!learner) return;

  const yesterday = dayjs().subtract(1, "day").startOf("day");
  const weekStart = dayjs().startOf("week");
  const monthStart = dayjs().startOf("month");

  learner.totalLearningHours = learner.learningActivity.reduce(
    (sum, entry) => sum + entry.hoursSpent,
    0
  );

  learner.progressStats.yesterdayHours = learner.learningActivity
    .filter(entry => dayjs(entry.date).isSame(yesterday, "day"))
    .reduce((sum, entry) => sum + entry.hoursSpent, 0);

  learner.progressStats.weekHours = learner.learningActivity
    .filter(entry => dayjs(entry.date).isAfter(weekStart) || dayjs(entry.date).isSame(weekStart))
    .reduce((sum, entry) => sum + entry.hoursSpent, 0);

  learner.progressStats.monthHours = learner.learningActivity
    .filter(entry => dayjs(entry.date).isAfter(monthStart) || dayjs(entry.date).isSame(monthStart))
    .reduce((sum, entry) => sum + entry.hoursSpent, 0);

  learner.totalCoursesEnrolled = learner.enrolledPaths.length;

  await learner.save();
};

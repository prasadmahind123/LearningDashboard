
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen, Clock, Target, Play, Award, Sparkles,
  Zap, TrendingUp, CheckCircle2, Flame, BarChart2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "../context/AppContext.jsx"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts"

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { type: "spring", stiffness: 90, damping: 14 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Converts seconds → "Xh Ym" or just "Xh" */
const fmtHours = (secs) => {
  if (!secs || secs <= 0) return "0h"
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** Returns a greeting based on local hour */
const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

const progressColor = (pct) => {
  if (pct >= 100) return "bg-emerald-500"
  if (pct >= 60)  return "bg-blue-500"
  if (pct >= 30)  return "bg-amber-500"
  return "bg-slate-400"
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, sub, accent, bg }) => (
  <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.18 } }}>
    <Card className={`border-l-4 ${accent} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group bg-white dark:bg-slate-900`}>
      <div className="absolute top-0 right-0 p-3 opacity-[0.07] group-hover:opacity-[0.13] transition-opacity pointer-events-none">
        <Icon className="h-20 w-20 rotate-12 translate-x-3 -translate-y-3" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-5">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</CardTitle>
        <div className={`p-2 rounded-xl ${bg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-none mb-1">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">{sub}</p>
      </CardContent>
    </Card>
  </motion.div>
)

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { learner, paths, axios } = useAppContext()

  const [skillData,  setSkillData]  = useState([])
  const [statsData,  setStatsData]  = useState(null)

  // Page title
  useEffect(() => { document.title = "Dashboard · Learner Portal" }, [])

  // Fetch aggregated stats (streak, skill profile, activity)
  useEffect(() => {
    const learnerId = learner?._id ?? learner?.id
    if (!learnerId) return

    axios.get(`/api/learner/stats/${learnerId}`)
      .then(res => {
        setSkillData(res.data.skillProfile ?? [])
        setStatsData(res.data)
      })
      .catch(err => console.error("[Dashboard] stats fetch failed:", err))
  }, [learner, axios])

  // ── Merged learner + path data ────────────────────────────────────────────
  // Fixed: was comparing ObjectId object === string (always false).
  // Also moved from useEffect+setState to useMemo to avoid extra render cycle.
  const learnerPaths = useMemo(() => {
    if (!paths?.length || !learner?.enrolledPaths?.length) return []

    return learner.enrolledPaths.reduce((acc, enroll) => {
      const rawId  = enroll.pathId
      const pathId = typeof rawId === "object"
        ? (rawId?._id ?? rawId)?.toString()
        : rawId?.toString()

      const pathObj = paths.find(p => p._id?.toString() === pathId)
      if (pathObj) acc.push({ ...pathObj, enrollment: enroll })
      return acc
    }, [])
  }, [paths, learner?.enrolledPaths])

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total      = learnerPaths.length
    const completed  = learnerPaths.filter(c => (c.enrollment?.progressPercent ?? 0) >= 100).length
    const nearDone   = learnerPaths.filter(c => {
      const p = c.enrollment?.progressPercent ?? 0
      return p >= 90 && p < 100
    }).length
    const totalSecs  = learnerPaths.reduce((s, c) => s + (c.enrollment?.timeSpent ?? 0), 0)
    // Fall back to totalLearningHours (hours unit) from learner object if timeSpent is 0
    const hoursDisplay = totalSecs > 0
      ? fmtHours(totalSecs)
      : `${(learner?.totalLearningHours ?? 0).toFixed(1)}h`

    const avgProgress = total
      ? Math.round(learnerPaths.reduce((s, c) => s + (c.enrollment?.progressPercent ?? 0), 0) / total)
      : 0

    const streak = statsData?.currentStreak ?? learner?.currentStreak ?? 0
    const longestStreak = statsData?.longestStreak ?? learner?.longestStreak ?? 0

    // "Continue" = most recently accessed path
    const recentPath = [...learnerPaths].sort((a, b) => {
      return new Date(b.enrollment?.lastAccessed ?? 0) - new Date(a.enrollment?.lastAccessed ?? 0)
    })[0] ?? null

    return { total, completed, nearDone, hoursDisplay, avgProgress, streak, longestStreak, recentPath }
  }, [learnerPaths, statsData, learner])

  // Weekly goal: last 7 days activity for progress bar
  const weeklyHours = statsData?.progressStats?.weekHours ?? 0
  const weeklyGoal  = 10 // hours — could be user-configurable
  const weeklyPct   = Math.min(Math.round((weeklyHours / weeklyGoal) * 100), 100)

  // Top 3 in-progress paths for sidebar
  const topPaths = useMemo(() =>
    [...learnerPaths]
      .filter(c => (c.enrollment?.progressPercent ?? 0) < 100)
      .sort((a, b) => (b.enrollment?.progressPercent ?? 0) - (a.enrollment?.progressPercent ?? 0))
      .slice(0, 3),
    [learnerPaths]
  )

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 h-[90vh] overflow-y-auto bg-slate-50/50 dark:bg-slate-950 no-scrollbar ">
      <motion.main
        className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ── Header ── */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-extrabold mb-1.5 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3 flex-wrap">
            {greeting()},{" "}
            <span>{learner?.name ?? "Learner"}</span>
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block origin-bottom-right"
            >
              👋
            </motion.span>
          </h1>
          <p className="text-muted-foreground text-base">
            {learner?.email && <span className="mr-1">{learner.email} ·</span>}
            Let's make progress today.
          </p>
          {learner?.createdAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(learner.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          )}
        </motion.div>

        {/* ── 4 Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            icon={BookOpen}
            label="Learning Paths"
            value={stats.total}
            sub={
              stats.nearDone > 0
                ? <><Sparkles className="h-3 w-3 text-amber-500" />{stats.nearDone} near completion</>
                : `${stats.completed} completed`
            }
            accent="border-l-blue-500"
            bg="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          />
          <StatCard
            icon={Clock}
            label="Hours Invested"
            value={stats.hoursDisplay}
            sub="Total learning time"
            accent="border-l-purple-500"
            bg="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Progress"
            value={`${stats.avgProgress}%`}
            sub="Across all enrolled paths"
            accent="border-l-amber-500"
            bg="bg-amber-100 text-amber-600 dark:bg-amber-900/30"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${stats.streak} days`}
            sub={
              stats.longestStreak > 0
                ? <><Award className="h-3 w-3 text-yellow-500" />Best: {stats.longestStreak} days</>
                : "Keep learning daily!"
            }
            accent="border-l-emerald-500"
            bg="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
          />
        </div>

        {/* ── Pick up where you left off (if any) ── */}
        {stats.recentPath && (
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
                <Play className="h-32 w-32" />
              </div>
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-lg">
                  <img src={stats.recentPath.image || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-100 text-xs font-medium mb-0.5 uppercase tracking-wide">Continue learning</p>
                  <h3 className="font-bold text-lg text-white truncate">{stats.recentPath.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 max-w-[200px] h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${stats.recentPath.enrollment?.progressPercent ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-100 font-medium">
                      {Math.round(stats.recentPath.enrollment?.progressPercent ?? 0)}%
                    </span>
                  </div>
                </div>
                <Button
                  asChild
                  className="bg-white text-blue-700 hover:bg-blue-50 shrink-0 rounded-xl font-semibold shadow-md transition-all active:scale-95"
                >
                  <Link to={`/mycourses/${stats.recentPath._id}`}>
                    <Play className="h-4 w-4 mr-2 fill-current" /> Resume
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Main 2-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Left col — Learning Paths list */}
          <motion.div className="lg:col-span-2 space-y-4" variants={itemVariants}>
            <Card className="shadow-md border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4 text-amber-500" />
                    My Learning Paths
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">Continue where you left off</CardDescription>
                </div>
                {learnerPaths.length > 3 && (
                  <Button variant="ghost" size="sm" asChild className="text-blue-600 text-xs rounded-lg">
                    <Link to="/mycourses">View all →</Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {learnerPaths.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No enrolled paths yet.</p>
                    <p className="text-xs mt-1 opacity-70">Browse the catalog and enroll to get started.</p>
                  </div>
                ) : (
                  learnerPaths.slice(0, 5).map((course, i) => {
                    const pct       = Math.round(course.enrollment?.progressPercent ?? 0)
                    const completed = course.enrollment?.completedModules?.length ?? 0
                    const total     = course.enrollment?.totalModules?.length ?? course.content?.length ?? 0
                    const isComplete = pct >= 100

                    return (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md bg-white dark:bg-slate-900 transition-all duration-250"
                      >
                        {/* Thumbnail */}
                        <div className="w-full sm:w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {course.title}
                            </h3>
                            <Badge variant="secondary" className="text-[10px] font-normal shrink-0">
                              {course.level}
                            </Badge>
                            {isComplete && (
                              <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 shrink-0">
                                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Done
                              </Badge>
                            )}
                            {!isComplete && pct >= 90 && (
                              <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 shrink-0">
                                <Award className="h-2.5 w-2.5 mr-0.5" /> Almost there!
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${progressColor(pct)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.9, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground shrink-0 w-9 text-right">{pct}%</span>
                          </div>

                          <p className="text-[11px] text-muted-foreground mt-1">
                            {completed}/{total} modules
                          </p>
                        </div>

                        {/* CTA */}
                        <Link to={`/mycourses/${course._id}`} className="shrink-0">
                          <Button
                            size="sm"
                            className="rounded-lg bg-slate-900 hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-blue-500 dark:text-slate-900 dark:hover:text-white transition-all active:scale-95 text-xs px-3"
                          >
                            <Play className="h-3 w-3 mr-1.5 fill-current" />
                            {isComplete ? "Review" : "Continue"}
                          </Button>
                        </Link>
                      </motion.div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right col — Sidebar */}
          <motion.div className="space-y-5" variants={itemVariants}>

            {/* Weekly Goal */}
            <Card className="shadow-md border-0 bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart2 className="h-4 w-4 text-red-500" />
                  Weekly Goal
                </CardTitle>
                <CardDescription className="text-xs">
                  {weeklyHours.toFixed(1)}h of {weeklyGoal}h target this week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Animated goal bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{weeklyPct}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${weeklyPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {weeklyPct >= 100
                      ? "🎉 Weekly goal smashed! Keep going."
                      : weeklyPct >= 50
                      ? "Great momentum — keep it up!"
                      : "You've got this — stay consistent."}
                  </p>
                </div>

                {/* Top in-progress paths */}
                {topPaths.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Top Priorities</h4>
                    {topPaths.map((course) => {
                      const pct = Math.round(course.enrollment?.progressPercent ?? 0)
                      return (
                        <div key={course._id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="truncate w-3/4 text-slate-700 dark:text-slate-300 font-medium">{course.title}</span>
                            <span className="text-muted-foreground">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${progressColor(pct)}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skill Radar */}
            <Card className="shadow-md border-0 bg-white dark:bg-slate-900">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-blue-500" />
                  Skill Competency
                </CardTitle>
                <CardDescription className="text-xs">Your growth across domains</CardDescription>
              </CardHeader>
              <CardContent>
                {skillData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground text-center px-4">
                    Enroll in courses with skill tags to see your competency chart.
                  </div>
                ) : (
                  <>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={skillData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Tooltip
                            formatter={(v) => [`${v}pts`, "Earned"]}
                            labelFormatter={(l) => `Skill: ${l}`}
                            contentStyle={{ borderRadius: 8, fontSize: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                          />
                          <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="#6366f1"
                            fillOpacity={0.4}
                            isAnimationActive
                            animationDuration={1000}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center text-[11px] text-muted-foreground mt-1">
                      Based on course progress and quiz results.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}

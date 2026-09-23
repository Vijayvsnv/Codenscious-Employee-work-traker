import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";
import {
  ArrowLeft,
  LayoutDashboard,
  FileText,
  Calendar,
  ListTodo,
  TrendingUp,
  Flame,
  Smile,
  Frown,
  AlertTriangle,
  HandHelping,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Activity,
  Rocket,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Logo } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const MOOD_COLORS = { High: "#10b981", Medium: "#f59e0b", Low: "#ef4444" };
const TASK_COLORS = { completed: "#10b981", in_progress: "#8b5cf6", blocked: "#ef4444", unknown: "#94a3b8" };
const MOOD_ICON = { High: Flame, Medium: Smile, Low: Frown };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2">
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: <span className="text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function StatCard({ title, value, sub, icon: Icon, color, loading }) {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    success: "text-success bg-success/10 border-success/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    destructive: "text-destructive bg-destructive/10 border-destructive/20",
  };
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        {loading ? (
          <Skeleton className="h-7 w-20 mt-1.5" />
        ) : (
          <p className="text-2xl font-bold tracking-tight text-foreground mt-1">{value}</p>
        )}
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function EmployeeAnalytics() {
  const { state: user } = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [moodTrend, setMoodTrend] = useState([]);
  const [taskBreakdown, setTaskBreakdown] = useState([]);
  const [reports, setReports] = useState({ reports: [], total: 0, total_pages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && activeTab === "reports") fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, m, t] = await Promise.all([
        axios.get(`${API_BASE}/employee/${user.emp_id}/stats`),
        axios.get(`${API_BASE}/employee/${user.emp_id}/mood-trend?days=30`),
        axios.get(`${API_BASE}/employee/${user.emp_id}/task-breakdown?days=30`),
      ]);
      setStats(s.data);
      setMoodTrend(m.data);
      setTaskBreakdown(t.data);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/employee/${user.emp_id}/reports?page=${page}&limit=10`);
      setReports(res.data);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setReportsLoading(false);
    }
  };

  const openReport = async (report) => {
    setSelectedReport(report);
    setDetailLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/employee/${user.emp_id}/report/${report.id}`);
      setReportDetail(res.data);
    } catch {
      toast.error("Failed to load report detail");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeReport = () => {
    setSelectedReport(null);
    setReportDetail(null);
  };

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "there";
  const moodLabel = stats?.avg_mood_score >= 2.5 ? "Great" : stats?.avg_mood_score >= 1.5 ? "Okay" : "Needs Attention";

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard", { state: user })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo />
            <Badge variant="default" className="hidden sm:inline-flex ml-2">
              <Activity className="h-3 w-3" /> My Analytics
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">{user.emp_id}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Your Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Insights on your standups, tasks, and mood — last 30 days
            </p>
          </div>
          {stats && !stats.logged_today && (
            <Button variant="gradient" onClick={() => navigate("/chat", { state: user })}>
              <Rocket className="h-4 w-4" />
              Log Today's Standup
            </Button>
          )}
          {stats?.logged_today && (
            <Badge variant="success" className="h-9 px-3 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Standup logged for today
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-secondary rounded-lg w-fit">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={LayoutDashboard}
            label="Overview"
          />
          <TabButton
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            icon={FileText}
            label="Reports"
          />
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Current Streak" value={`${stats?.current_streak ?? 0} days`} sub="Consecutive standups" icon={Flame} color="warning" loading={loading} />
              <StatCard title="Total Standups" value={stats?.total_reports ?? 0} sub={`${stats?.reports_this_month ?? 0} this month`} icon={FileText} color="primary" loading={loading} />
              <StatCard title="Task Completion" value={`${stats?.task_completion_rate ?? 0}%`} sub={`${stats?.completed_tasks ?? 0}/${stats?.total_tasks ?? 0} tasks`} icon={CheckCircle2} color="success" loading={loading} />
              <StatCard title="Avg Mood" value={moodLabel} sub={`Score: ${stats?.avg_mood_score ?? 0}/3`} icon={Sparkles} color="accent" loading={loading} />
              <StatCard title="Blockers" value={stats?.blocker_count ?? 0} sub="Reported this month" icon={AlertTriangle} color="destructive" loading={loading} />
              <StatCard title="Help Requests" value={stats?.help_requests ?? 0} sub="Asked for help" icon={HandHelping} color="warning" loading={loading} />
              <StatCard title="Total Tasks" value={stats?.total_tasks ?? 0} sub="Last 30 days" icon={ListTodo} color="accent" loading={loading} />
              <StatCard title="Completed" value={stats?.completed_tasks ?? 0} sub="Done tasks" icon={Target} color="success" loading={loading} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Mood trend */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <CardTitle className="text-base">Mood Trend</CardTitle>
                      <CardDescription>Your mood over the last 30 days</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[240px] w-full" />
                  ) : moodTrend.length === 0 ? (
                    <EmptyState icon={TrendingUp} message="No mood data yet. Log your first standup!" />
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={moodTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} domain={[0, 3]} ticks={[0, 1, 2, 3]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="mood_score"
                          name="Mood"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.5}
                          dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Task breakdown */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-accent" />
                    <div>
                      <CardTitle className="text-base">Task Status Breakdown</CardTitle>
                      <CardDescription>Last 30 days</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[240px] w-full" />
                  ) : taskBreakdown.length === 0 ? (
                    <EmptyState icon={ListTodo} message="No tasks logged yet." />
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={taskBreakdown}
                            dataKey="count"
                            nameKey="status"
                            cx="50%" cy="50%"
                            outerRadius={75} innerRadius={40} paddingAngle={3}
                          >
                            {taskBreakdown.map((entry, i) => (
                              <Cell key={i} fill={TASK_COLORS[entry.status] || "#94a3b8"} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {taskBreakdown.map((entry, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: TASK_COLORS[entry.status] }} />
                            <span className="text-muted-foreground capitalize">{entry.status?.replace("_", " ")}:</span>
                            <strong className="text-foreground">{entry.count}</strong>
                            <span className="text-muted-foreground">({entry.hours}h)</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent activity summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <CardTitle className="text-base">Recent Mood Log</CardTitle>
                    <CardDescription>Last 10 standups — quick glance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : moodTrend.length === 0 ? (
                  <EmptyState icon={Clock} message="No recent activity" />
                ) : (
                  <div className="space-y-2">
                    {moodTrend.slice(-10).reverse().map((entry, i) => {
                      const MoodIcon = MOOD_ICON[entry.mood];
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{entry.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {entry.blocker_risk !== "None" && (
                              <Badge variant={entry.blocker_risk === "High" ? "destructive" : entry.blocker_risk === "Medium" ? "warning" : "success"}>
                                <AlertTriangle className="h-3 w-3" />
                                {entry.blocker_risk}
                              </Badge>
                            )}
                            {entry.mood && MoodIcon && (
                              <Badge variant={entry.mood === "High" ? "success" : entry.mood === "Medium" ? "warning" : "destructive"}>
                                <MoodIcon className="h-3 w-3" />
                                {entry.mood}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <CardTitle className="text-base">All Reports</CardTitle>
                    <CardDescription>{reports.total} total standups · Click any row for details</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-border bg-secondary/30">
                      {["Date", "Mood", "Blocker Risk", "Help", "Summary"].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportsLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-border">
                          {[...Array(5)].map((_, j) => (
                            <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                          ))}
                        </tr>
                      ))
                    ) : reports.reports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12">
                          <EmptyState icon={FileText} message="No reports yet. Start with your first standup!" />
                        </td>
                      </tr>
                    ) : (
                      reports.reports.map((r) => {
                        const MoodIcon = MOOD_ICON[r.mood];
                        return (
                          <tr
                            key={r.id}
                            onClick={() => openReport(r)}
                            className="border-b border-border hover:bg-secondary/40 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-sm text-foreground">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                {r.date}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {r.mood && MoodIcon && (
                                <Badge variant={r.mood === "High" ? "success" : r.mood === "Medium" ? "warning" : "destructive"}>
                                  <MoodIcon className="h-3 w-3" />
                                  {r.mood}
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={r.blocker_risk_level === "High" ? "destructive" : r.blocker_risk_level === "Medium" ? "warning" : "secondary"}>
                                {r.blocker_risk_level || "None"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {r.help_needed ? (
                                <Badge variant="warning"><HandHelping className="h-3 w-3" /> Yes</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 max-w-[300px]">
                              <p className="text-sm text-muted-foreground truncate">{r.day_summary || "—"}</p>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {reports.total_pages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Page {reports.page} of {reports.total_pages} · {reports.total} total
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(reports.total_pages, p + 1))}
                      disabled={page === reports.total_pages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detail Modal */}
        <Modal
          open={!!selectedReport}
          onClose={closeReport}
          title={selectedReport ? `Standup — ${selectedReport.date}` : ""}
          description={firstName + "'s report"}
          size="xl"
        >
          <div className="p-6 space-y-5">
            {detailLoading || !reportDetail ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                {/* Meta chips */}
                <div className="flex flex-wrap gap-2">
                  {reportDetail.report.mood && (
                    <Badge variant={reportDetail.report.mood === "High" ? "success" : reportDetail.report.mood === "Medium" ? "warning" : "destructive"}>
                      {MOOD_ICON[reportDetail.report.mood] &&
                        (() => { const I = MOOD_ICON[reportDetail.report.mood]; return <I className="h-3 w-3" />; })()}
                      Mood: {reportDetail.report.mood}
                    </Badge>
                  )}
                  <Badge variant={reportDetail.report.blocker_risk_level === "High" ? "destructive" : reportDetail.report.blocker_risk_level === "Medium" ? "warning" : "secondary"}>
                    Risk: {reportDetail.report.blocker_risk_level || "None"}
                  </Badge>
                  {reportDetail.report.help_needed && (
                    <Badge variant="warning"><HandHelping className="h-3 w-3" /> Help Requested</Badge>
                  )}
                </div>

                {/* Sections */}
                <DetailSection label="Day Summary" value={reportDetail.report.day_summary} icon={FileText} />
                <DetailSection label="Blockers" value={reportDetail.report.blockers} icon={AlertTriangle} accent="destructive" />
                <DetailSection label="Help From" value={reportDetail.report.help_from} icon={HandHelping} accent="warning" />
                <DetailSection label="Tomorrow's Plan" value={reportDetail.report.tomorrow_plan} icon={Target} />

                {/* Tasks */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ListTodo className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm text-foreground">
                      Tasks ({reportDetail.tasks.length})
                    </h4>
                  </div>
                  {reportDetail.tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No tasks logged</p>
                  ) : (
                    <div className="space-y-2">
                      {reportDetail.tasks.map((t) => (
                        <div key={t.id} className="p-3 rounded-lg border border-border bg-secondary/30">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <p className="font-medium text-sm text-foreground">{t.task_name || "Unnamed task"}</p>
                            <Badge variant={t.task_status === "completed" ? "success" : t.task_status === "blocked" ? "destructive" : "accent"}>
                              {t.task_status?.replace("_", " ") || "unknown"}
                            </Badge>
                          </div>
                          {t.task_details && <p className="text-xs text-muted-foreground mb-1.5">{t.task_details}</p>}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {t.time_spent_hours !== null && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t.time_spent_hours}h
                              </span>
                            )}
                            {t.expected_completion && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {t.expected_completion}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function DetailSection({ label, value, icon: Icon, accent }) {
  if (!value) return null;
  const accentClass = accent === "destructive" ? "text-destructive" : accent === "warning" ? "text-warning" : "text-foreground/90";
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn("text-sm leading-relaxed pl-5", accentClass)}>{value}</p>
    </div>
  );
}

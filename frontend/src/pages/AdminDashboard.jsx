import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  RefreshCw,
  FileText,
  Users,
  HandHelping,
  AlertTriangle,
  Send,
  Sparkles,
  Bot,
  Flame,
  Smile,
  Frown,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Logo } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const API_BASE = "http://127.0.0.1:8000";

const MOOD_COLORS = { High: "#10b981", Medium: "#f59e0b", Low: "#ef4444" };
const BLOCKER_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981", None: "#94a3b8" };
const TASK_COLORS = { completed: "#10b981", in_progress: "#8b5cf6", blocked: "#ef4444" };

const MOOD_ICON = { High: Flame, Medium: Smile, Low: Frown };

// ─── CHART TOOLTIP ────────────────────────────────
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

// ─── STAT CARD ────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, sub, onClick, loading }) {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    destructive: "text-destructive bg-destructive/10 border-destructive/20",
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center border", colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {onClick && (
            <Badge variant="outline" className="text-[10px]">
              Click for details
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-16 mt-2" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{value}</p>
        )}
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── DETAIL MODAL ────────────────────────────────
function DetailModal({ modal, onClose, loading }) {
  return (
    <Modal
      open={modal.open}
      onClose={onClose}
      title={modal.title}
      description={`${modal.data?.length || 0} record(s) found`}
      size="lg"
    >
      <div className="p-6 space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-border space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))
        ) : modal.data?.length === 0 ? (
          <div className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          modal.data.map((item, i) => {
            const MoodIcon = MOOD_ICON[item.mood];
            return (
              <div
                key={i}
                className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {item.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.emp_id} · {item.date}</p>
                  </div>
                  {item.mood && MoodIcon && (
                    <Badge
                      variant={item.mood === "High" ? "success" : item.mood === "Medium" ? "warning" : "destructive"}
                    >
                      <MoodIcon className="h-3 w-3" />
                      {item.mood}
                    </Badge>
                  )}
                  {item.blocker_risk_level && !item.mood && (
                    <Badge
                      variant={item.blocker_risk_level === "High" ? "destructive" : item.blocker_risk_level === "Medium" ? "warning" : "success"}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {item.blocker_risk_level}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-sm">
                  {item.day_summary && <DetailRow label="Summary" value={item.day_summary} />}
                  {item.blockers && <DetailRow label="Blocker" value={item.blockers} accent="destructive" />}
                  {item.help_from && <DetailRow label="Help From" value={item.help_from} accent="warning" />}
                  {item.tomorrow_plan && <DetailRow label="Tomorrow" value={item.tomorrow_plan} />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}

function DetailRow({ label, value, accent }) {
  const accentClass = accent === "destructive" ? "text-destructive" : accent === "warning" ? "text-warning" : "text-foreground/80";
  return (
    <div className="flex gap-3">
      <span className="text-xs text-muted-foreground font-medium min-w-[80px] pt-0.5">{label}</span>
      <span className={cn("text-sm leading-relaxed flex-1", accentClass)}>{value}</span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────
export default function AdminDashboard() {
  const { state: admin } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modal, setModal] = useState({ open: false, title: "", data: [], type: "" });
  const [modalLoading, setModalLoading] = useState(false);

  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your HR Analytics Assistant. Ask me anything about your employees — tasks, blockers, moods, performance." }
  ]);
  const [query, setQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!admin) { navigate("/"); return; }
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/dashboard`);
      setData(res.data);
      if (isRefresh) toast.success("Dashboard refreshed");
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openModal = async (type, title, param = "") => {
    setModal({ open: true, title, data: [], type });
    setModalLoading(true);
    try {
      let url = "";
      if (type === "today")   url = `${API_BASE}/admin/today-reports`;
      if (type === "help")    url = `${API_BASE}/admin/help-requests`;
      if (type === "blocker") url = `${API_BASE}/admin/blockers/${param}`;
      if (type === "mood")    url = `${API_BASE}/admin/mood/${param}`;
      const res = await axios.get(url);
      setModal(prev => ({ ...prev, data: res.data }));
    } catch {
      toast.error("Failed to load details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setModal({ open: false, title: "", data: [], type: "" });

  const sendQuery = async (text) => {
    const q = text || query.trim();
    if (!q || chatLoading) return;
    setMessages(prev => [...prev, { role: "admin", text: q }]);
    setQuery("");
    setChatLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/chat`, { query: q });
      setMessages(prev => [...prev, { role: "ai", text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error processing query. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const suggestions = [
    "Who had blockers today?",
    "What's the team mood this week?",
    "Whose work is pending?",
    "Show high risk issues",
    "Who needed help recently?",
  ];

  const handleLogout = () => {
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DetailModal modal={modal} onClose={closeModal} loading={modalLoading} />

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/40 sticky top-0 h-screen">
        <div className="p-6 border-b border-border">
          <Logo variant="admin" />
          <Badge variant="accent" className="mt-3">
            Admin Panel
          </Badge>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <SidebarLink
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <SidebarLink
            active={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
            icon={MessageSquare}
            label="Employee Query"
          />
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <nav className="lg:hidden sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo variant="admin" size="sm" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex border-t border-border">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "dashboard" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" /> Chat
            </button>
          </div>
        </nav>

        {/* Content */}
        {activeTab === "dashboard" && (
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                  Analytics Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Real-time employee standup insights
                </p>
              </div>
              <Button variant="outline" onClick={() => fetchDashboard(true)} loading={refreshing}>
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Today's Reports"
                value={data?.today_reports ?? 0}
                icon={FileText}
                color="primary"
                sub="Submitted today"
                loading={loading}
                onClick={() => openModal("today", "Today's Reports")}
              />
              <StatCard
                title="Total Employees"
                value={data?.total_employees ?? 0}
                icon={Users}
                color="accent"
                sub="All time"
                loading={loading}
              />
              <StatCard
                title="Help Requests"
                value={data?.help_needed_count ?? 0}
                icon={HandHelping}
                color="warning"
                sub="Last 30 days"
                loading={loading}
                onClick={() => openModal("help", "Help Requests")}
              />
              <StatCard
                title="High Risk Blockers"
                value={data?.blocker_risk?.find(b => b.level === "High")?.count || 0}
                icon={AlertTriangle}
                color="destructive"
                sub="Last 30 days"
                loading={loading}
                onClick={() => openModal("blocker", "High Risk Blockers", "High")}
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <CardTitle className="text-base">Daily Report Activity</CardTitle>
                      <CardDescription>Last 7 days</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[230px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={230}>
                      <LineChart data={data.daily_counts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone" dataKey="count" name="Reports"
                          stroke="hsl(var(--primary))" strokeWidth={2.5}
                          dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <div>
                      <CardTitle className="text-base">Mood Distribution</CardTitle>
                      <CardDescription>Last 30 days · Click slice for details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[230px] w-full" />
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={data.mood_distribution} dataKey="count" nameKey="mood"
                            cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}
                            onClick={(entry) => openModal("mood", `${entry.mood} Mood Employees`, entry.mood)}
                            style={{ cursor: "pointer" }}
                          >
                            {data.mood_distribution.map((entry, i) => (
                              <Cell key={i} fill={MOOD_COLORS[entry.mood] || "#94a3b8"} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-4 mt-2">
                        {data.mood_distribution.map((entry, i) => (
                          <button
                            key={i}
                            onClick={() => openModal("mood", `${entry.mood} Mood Employees`, entry.mood)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: MOOD_COLORS[entry.mood] }} />
                            {entry.mood}: <strong className="text-foreground">{entry.count}</strong>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <div>
                      <CardTitle className="text-base">Blocker Risk Levels</CardTitle>
                      <CardDescription>Last 30 days · Click bar for details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[230px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart data={data.blocker_risk} barSize={48}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="level" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="count" name="Count" radius={[8, 8, 0, 0]}
                          onClick={(entry) => openModal("blocker", `${entry.level} Risk Blockers`, entry.level)}
                          style={{ cursor: "pointer" }}
                        >
                          {data.blocker_risk.map((entry, i) => (
                            <Cell key={i} fill={BLOCKER_COLORS[entry.level] || "#94a3b8"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-accent" />
                    <div>
                      <CardTitle className="text-base">Task Status</CardTitle>
                      <CardDescription>Last 30 days</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[230px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart data={data.task_status} barSize={48}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
                          {data.task_status.map((entry, i) => (
                            <Cell key={i} fill={TASK_COLORS[entry.status] || "#8b5cf6"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <CardTitle className="text-base">Recent Reports</CardTitle>
                    <CardDescription>Latest 10 submissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-y border-border bg-secondary/30">
                        {["Employee", "Emp ID", "Date", "Mood", "Blocker Risk", "Summary"].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-border">
                            {[...Array(6)].map((_, j) => (
                              <td key={j} className="px-4 py-3">
                                <Skeleton className="h-4 w-full" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        data?.recent_reports?.map((r, i) => {
                          const MoodIcon = MOOD_ICON[r.mood];
                          return (
                            <tr key={i} className="border-b border-border hover:bg-secondary/30 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                    {r.name?.charAt(0)}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{r.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="default" className="font-mono text-[10px]">
                                  {r.emp_id}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
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
                              <td className="px-4 py-3 max-w-[240px]">
                                <p className="text-sm text-muted-foreground truncate">
                                  {r.day_summary || "—"}
                                </p>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 lg:px-6 min-h-0 animate-fade-in">
            <div className="py-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Employee Query Assistant</h2>
                  <p className="text-xs text-muted-foreground">
                    Powered by Vector DB + GPT — ask in natural language
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuery(sug)}
                    className="px-3 py-1.5 text-xs rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 animate-fade-in",
                    m.role === "admin" && "justify-end"
                  )}
                >
                  {m.role === "ai" && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "ai"
                        ? "bg-card border border-border text-foreground rounded-tl-sm"
                        : "bg-gradient-to-br from-accent to-indigo-600 text-white rounded-tr-sm shadow-sm"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border py-4">
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Ask anything about your employees..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendQuery();
                    }
                  }}
                  rows={1}
                  disabled={chatLoading}
                  className="min-h-[46px] max-h-32 py-3"
                />
                <Button
                  variant="default"
                  size="icon"
                  className="h-11 w-11 shrink-0 bg-accent hover:bg-accent/90"
                  onClick={() => sendQuery()}
                  disabled={chatLoading || !query.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarLink({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Users,
  BarChart3,
  MessageSquare,
  Sparkles,
  Rocket,
  X,
  Info,
  LayoutDashboard,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Logo } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { MarkdownContent } from "../components/MarkdownContent";
import { cn } from "../lib/utils";

// ─── DEMO DATA ─────────────────────────────────────
const DEMO_STATS = {
  today_reports: 12,
  total_employees: 24,
  help_needed_count: 4,
  high_risk_blockers: 2,
};

const DEMO_MOOD = [
  { mood: "High", count: 14 },
  { mood: "Medium", count: 8 },
  { mood: "Low", count: 2 },
];

const DEMO_ACTIVITY = [
  { date: "Mon", count: 22 },
  { date: "Tue", count: 24 },
  { date: "Wed", count: 20 },
  { date: "Thu", count: 23 },
  { date: "Fri", count: 21 },
  { date: "Sat", count: 8 },
  { date: "Sun", count: 5 },
];

const DEMO_REPORTS = [
  { name: "Vijay Sharma", emp_id: "EMP001", date: "Today", mood: "High", risk: "None", summary: "Shipped auth module, unblocked 2 teammates" },
  { name: "Priya Kapoor", emp_id: "EMP004", date: "Today", mood: "Medium", risk: "Low", summary: "Design review pending, waiting on feedback from Rahul" },
  { name: "Amit Verma", emp_id: "EMP007", date: "Today", mood: "High", risk: "None", summary: "Deployed staging environment, all tests passing" },
  { name: "Sneha Iyer", emp_id: "EMP012", date: "Today", mood: "Low", risk: "High", summary: "Blocked on API integration, need urgent help" },
];

const DEMO_CHAT = [
  { role: "ai", text: "Hey **Vijay**! How was your day today? Let's go through your tasks." },
  { role: "user", text: "Kaam accha raha! 3 tasks complete kiye:\n\n1. Frontend redesign\n2. API integration\n3. Bug fixes on production" },
  { role: "ai", text: "Great progress! Let me ask about each:\n\n- Frontend redesign: `100%` complete or pending review?\n- API integration: Any issues with authentication?" },
  { role: "user", text: "Redesign 100% done. API integration mein CORS issue thi but resolve ho gayi." },
  { role: "ai", text: "Perfect. Any **blockers** for tomorrow's work? Any timeline concerns?" },
];

const DEMO_RAG = [
  {
    role: "user",
    text: "Who had blockers today?",
  },
  {
    role: "ai",
    text: `Based on today's standups, **2 employees** reported blockers:

1. **Sneha Iyer (EMP012)** — High risk
   - Blocked on API integration
   - Requesting urgent help

2. **Priya Kapoor (EMP004)** — Low risk
   - Design review pending
   - Waiting on feedback from Rahul

Recommend: Ping Sneha's manager to unblock API issue.`,
  },
];

const MOOD_COLORS = { High: "#10b981", Medium: "#f59e0b", Low: "#ef4444" };

export default function Demo() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("admin"); // 'admin' | 'chat' | 'rag'
  const [banner, setBanner] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      {banner && (
        <div className="bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Play className="h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>You're in live demo mode.</strong> This is pre-populated sample data.{" "}
                <Link to="/register" className="underline font-medium">Sign up for real</Link>
              </span>
            </div>
            <button
              onClick={() => setBanner(false)}
              className="text-white/80 hover:text-white shrink-0"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <Badge variant="warning" className="hidden sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              DEMO
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/register">
              <Button variant="gradient" size="sm">
                Get Started Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* View selector */}
      <div className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <ViewTab
              active={activeView === "admin"}
              onClick={() => setActiveView("admin")}
              icon={LayoutDashboard}
              label="Admin Dashboard"
            />
            <ViewTab
              active={activeView === "chat"}
              onClick={() => setActiveView("chat")}
              icon={MessageSquare}
              label="Employee Standup"
            />
            <ViewTab
              active={activeView === "rag"}
              onClick={() => setActiveView("rag")}
              icon={Sparkles}
              label="RAG Assistant"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        {activeView === "admin" && <AdminView />}
        {activeView === "chat" && <ChatView />}
        {activeView === "rag" && <RAGView />}
      </main>

      {/* CTA */}
      <section className="py-16 bg-secondary/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-4">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Like what you see?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sign up in 30 seconds. Log your team's first real standup in 5 minutes.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="gradient" size="lg">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ViewTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
        active
          ? "bg-primary/10 border-primary/30 text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function AdminView() {
  return (
    <>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time employee standup insights</p>
        </div>
        <Badge variant="warning">
          <Info className="h-3 w-3" />
          Sample data
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Reports" value={DEMO_STATS.today_reports} icon={LayoutDashboard} color="primary" />
        <StatCard title="Total Employees" value={DEMO_STATS.total_employees} icon={Users} color="accent" />
        <StatCard title="Help Requests" value={DEMO_STATS.help_needed_count} icon={Search} color="warning" />
        <StatCard title="High Risk Blockers" value={DEMO_STATS.high_risk_blockers} icon={TrendingUp} color="destructive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Activity</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={DEMO_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone" dataKey="count" name="Reports"
                  stroke="hsl(var(--primary))" strokeWidth={2.5}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mood Distribution</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DEMO_MOOD} dataKey="count" nameKey="mood"
                  cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}
                >
                  {DEMO_MOOD.map((entry, i) => (
                    <Cell key={i} fill={MOOD_COLORS[entry.mood]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Reports</CardTitle>
          <CardDescription>Latest submissions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-border bg-secondary/30">
                  {["Employee", "Emp ID", "Date", "Mood", "Risk", "Summary"].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_REPORTS.map((r, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                          {r.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="font-mono text-[10px]">{r.emp_id}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.mood === "High" ? "success" : r.mood === "Medium" ? "warning" : "destructive"}>
                        {r.mood}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.risk === "High" ? "destructive" : r.risk === "Low" ? "success" : "secondary"}>
                        {r.risk}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="text-sm text-muted-foreground truncate">{r.summary}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    destructive: "text-destructive bg-destructive/10 border-destructive/20",
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border mb-3", colorMap[color])}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function ChatView() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Employee Standup Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">See what an employee experience looks like</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {DEMO_CHAT.map((m, i) => (
            <div key={i} className={cn("flex items-start gap-3", m.role === "user" && "justify-end")}>
              {m.role === "ai" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "ai"
                    ? "bg-secondary text-foreground rounded-tl-sm"
                    : "bg-gradient-to-br from-primary to-cyan-500 text-white rounded-tr-sm shadow-sm"
                )}
              >
                <MarkdownContent>{m.text}</MarkdownContent>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <span>
              This is a preview of an AI standup conversation. The AI adapts questions based on responses,
              detects blockers automatically, and produces a structured report.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RAGView() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">RAG Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask anything about your team in natural language
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {DEMO_RAG.map((m, i) => (
            <div key={i} className={cn("flex items-start gap-3", m.role === "user" && "justify-end")}>
              {m.role === "ai" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "ai"
                    ? "bg-secondary text-foreground rounded-tl-sm"
                    : "bg-gradient-to-br from-accent to-indigo-600 text-white rounded-tr-sm shadow-sm"
                )}
              >
                <MarkdownContent>{m.text}</MarkdownContent>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
            Try asking...
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "What's the team mood this week?",
              "Show me high-risk blockers",
              "Who needed help recently?",
              "Summarize Sneha's last 5 standups",
            ].map((q, i) => (
              <span key={i} className="px-3 py-1.5 text-xs rounded-full border border-border bg-card text-muted-foreground">
                {q}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

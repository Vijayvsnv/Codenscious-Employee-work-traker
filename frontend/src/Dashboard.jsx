import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "./authService";
import { toast } from "sonner";
import {
  LogOut,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  Target,
  Coffee,
  ArrowRight,
  BarChart3,
} from "lucide-react";

import { Button } from "./components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";
import { Logo } from "./components/ui/Logo";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { OnboardingTour } from "./components/OnboardingTour";

const EMPLOYEE_TOUR_STEPS = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to WorkPulse!",
    content: "Let's take a quick 30-second tour so you know how everything works.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="start-standup"]',
    title: "Log your daily standup",
    content: "Click here to start a 5-minute AI chat that logs your daily work, blockers, and tomorrow's plan.",
  },
  {
    target: '[data-tour="analytics"]',
    title: "Your personal analytics",
    content: "See your streak, mood trend, task completion rate, and full report history.",
  },
  {
    target: '[data-tour="guidelines"]',
    title: "Follow these guidelines",
    content: "Complete standups get better analytics. Cover tasks, time spent, blockers, and tomorrow's plan.",
  },
  {
    target: '[data-tour="theme-toggle"]',
    title: "Switch themes anytime",
    content: "Prefer light or dark? Toggle here. Your choice is saved automatically.",
  },
];

function Dashboard() {
  const { state: user } = useLocation();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const startStandup = () => navigate("/chat", { state: user });

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const guidelines = [
    { icon: ListTodo, text: "Clearly describe all tasks you worked on today" },
    { icon: Clock, text: "Mention time spent on each task (in hours)" },
    { icon: AlertTriangle, text: "Highlight any blockers or challenges you faced" },
    { icon: CheckCircle2, text: "Include completion percentage for ongoing tasks" },
    { icon: Target, text: "Provide a clear plan for the next working day" },
  ];

  const firstName = user.name?.split(" ")[0] || "there";
  const initials = user.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour tourKey="employee-dashboard" steps={EMPLOYEE_TOUR_STEPS} />
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Logo />

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-analytics", { state: user })}
              data-tour="analytics"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">My Analytics</span>
            </Button>
            <span data-tour="theme-toggle"><ThemeToggle /></span>
            <div className="hidden sm:flex items-center gap-2.5 pr-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">{user.emp_id}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Good day</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome, {firstName}
          </h1>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <Badge variant="default">ID: {user.emp_id}</Badge>
            <span className="text-sm text-muted-foreground">
              Ready to log today's standup?
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guidelines Card */}
          <Card className="lg:col-span-2" data-tour="guidelines">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ListTodo className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Standup Guidelines</CardTitle>
                  <CardDescription>
                    Follow these for a complete and accurate daily report
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {guidelines.map((g, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                      <g.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed pt-1">
                      {g.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-6">
            {/* Warning */}
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      Mandatory Compliance
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Incomplete responses may impact your performance review. All
                      inputs are recorded for analytics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start CTA */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
              <CardContent className="pt-6 relative">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Ready for your standup?
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  AI will guide you through a friendly 5–10 minute conversation.
                </p>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full mt-5"
                  onClick={startStandup}
                  data-tour="start-standup"
                >
                  Start Standup
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-2"
                  onClick={() => navigate("/my-analytics", { state: user })}
                >
                  <BarChart3 className="h-4 w-4" />
                  View My Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

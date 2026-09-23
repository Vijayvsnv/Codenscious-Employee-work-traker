import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageSquare,
  Bot,
  BarChart3,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  FileText,
  Activity,
  Flame,
  AlertTriangle,
  ShieldCheck,
  Sun,
  Moon,
  Zap,
  MessageCircle,
  Hash,
  Mail,
  Calendar,
  Users,
  FileDown,
  Lock,
  KeyRound,
  Server,
  Check,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ProBadge } from "../components/ui/ProBadge";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";

const FEATURE_SECTIONS = [
  {
    title: "AI Standup Engine",
    subtitle: "Replace the daily meeting with a 5-minute chat",
    icon: MessageSquare,
    plan: "free",
    features: [
      { icon: Bot, title: "Multi-phase conversation flow", desc: "6-node LangGraph: greeting → tasks → deep-dive → blockers → tomorrow → mood" },
      { icon: Sparkles, title: "Smart cross-questions", desc: "AI asks context-aware follow-ups. If you have one task, it digs deep. Multiple tasks, brief queries per task." },
      { icon: FileText, title: "Structured JSON extraction", desc: "Free-form conversation → structured report with tasks, blockers, risk levels, and hours" },
      { icon: MessageCircle, title: "Hinglish support", desc: "Chat in English, Hindi, or a mix. The AI understands and responds naturally." },
    ],
  },
  {
    title: "Analytics Dashboards",
    subtitle: "See your team's pulse in real-time",
    icon: BarChart3,
    plan: "free",
    features: [
      { icon: Activity, title: "Admin analytics dashboard", desc: "Team-wide stats: today's reports, mood distribution, blocker risk, task status", plan: "free" },
      { icon: TrendingUp, title: "Employee personal analytics", desc: "Individual streak, mood trend, task completion %, and full report history", plan: "free" },
      { icon: Flame, title: "Streak tracking", desc: "Consecutive-day streak with visual badges. Motivates consistent standups." },
      { icon: AlertTriangle, title: "Blocker risk levels", desc: "Auto-classified High / Medium / Low risk with click-through employee details" },
    ],
  },
  {
    title: "RAG-Powered AI Assistant",
    subtitle: "Ask your team's data anything, in natural language",
    icon: Sparkles,
    plan: "growth",
    features: [
      { icon: Sparkles, title: "Natural language queries", desc: "Ask 'Who had blockers today?' or 'What's the team mood this week?' — get instant, cited answers" },
      { icon: Search, title: "Vector-search backed", desc: "Every standup is embedded and indexed with OpenAI embeddings + ChromaDB" },
      { icon: FileText, title: "Source citations", desc: "Every AI answer shows which employees and dates the response came from" },
    ],
  },
  {
    title: "Search & Filters",
    subtitle: "Find any report in seconds",
    icon: Search,
    plan: "growth",
    features: [
      { icon: Search, title: "Full-text search", desc: "Search across employee names, IDs, summaries, and blocker text with debounced input" },
      { icon: Filter, title: "Advanced filters", desc: "Filter by mood, blocker risk, help requests, and date range — combine freely" },
      { icon: Calendar, title: "Date range picker", desc: "Native date inputs for start/end dates, works on any device" },
    ],
  },
  {
    title: "Employee Experience",
    subtitle: "Delightful UX that teams actually enjoy",
    icon: Users,
    plan: "free",
    features: [
      { icon: Zap, title: "Guided onboarding tour", desc: "First-time users get a 5-step tour highlighting key features. Auto-dismisses after completion." },
      { icon: Sun, title: "Light + dark mode", desc: "One-click theme toggle. Preference persists across sessions and devices." },
      { icon: MessageCircle, title: "Toast notifications", desc: "Non-intrusive feedback for all user actions using Sonner" },
      { icon: Moon, title: "Mobile-responsive", desc: "Works on phones, tablets, and desktops. Optimized for all screen sizes." },
    ],
  },
  {
    title: "Data Export & Reports",
    subtitle: "Take your data anywhere",
    icon: FileDown,
    plan: "growth",
    features: [
      { icon: FileDown, title: "CSV export", desc: "Download reports, tasks, or full team data as CSV for spreadsheet analysis", plan: "growth" },
      { icon: FileText, title: "PDF reports (coming)", desc: "Weekly and monthly summary PDFs for stakeholders", plan: "pro", soon: true },
      { icon: Calendar, title: "Scheduled email digests (coming)", desc: "Daily/weekly summary emails to admins and managers", plan: "pro", soon: true },
    ],
  },
  {
    title: "Integrations",
    subtitle: "Fits into your existing workflow",
    icon: Hash,
    plan: "pro",
    features: [
      { icon: Hash, title: "Slack integration (coming)", desc: "Standup reminders + submission via Slack DMs", plan: "pro", soon: true },
      { icon: MessageCircle, title: "WhatsApp Business API (coming)", desc: "Log standups by replying to a WhatsApp message", plan: "pro", soon: true },
      { icon: Mail, title: "Email reminders (coming)", desc: "Automatic daily reminders for missed standups", plan: "growth", soon: true },
    ],
  },
  {
    title: "Security & Privacy",
    subtitle: "Your team's data stays yours",
    icon: ShieldCheck,
    plan: "free",
    features: [
      { icon: Lock, title: "HTTPS everywhere", desc: "All traffic encrypted in transit with TLS" },
      { icon: KeyRound, title: "Firebase Authentication", desc: "Employee login backed by Firebase Auth with password hashing" },
      { icon: Server, title: "Self-host option (coming)", desc: "Deploy WorkPulse on your own infrastructure — full data control", plan: "enterprise", soon: true },
      { icon: ShieldCheck, title: "SSO / SAML (coming)", desc: "Single sign-on with Google Workspace, Microsoft, or Okta", plan: "enterprise", soon: true },
    ],
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-4">Features</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Everything WorkPulse<br />
            can do for you
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            A conversational AI, real-time analytics, and honest early-access pricing.
            Here's the full list of what's built, what's coming, and what tier you need.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        {FEATURE_SECTIONS.map((section, i) => {
          const SectionIcon = section.icon;
          return (
            <section key={i}>
              <div className="flex items-start gap-4 mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <SectionIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                      {section.title}
                    </h2>
                    <ProBadge plan={section.plan} />
                  </div>
                  <p className="text-muted-foreground">{section.subtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {section.features.map((f, j) => {
                  const FIcon = f.icon;
                  const plan = f.plan || section.plan;
                  return (
                    <Card key={j} className="p-5 border-border/60">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <FIcon className="h-4 w-4 text-foreground/70" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                            {f.soon ? (
                              <ProBadge plan="soon" />
                            ) : (
                              <ProBadge plan={plan} />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="py-20 border-t border-border bg-secondary/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            See it in action
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free — no credit card. Upgrade only when you need premium features.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

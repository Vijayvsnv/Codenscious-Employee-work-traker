import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Circle,
  Sparkles,
  MessageSquare,
  BarChart3,
  Search,
  ShieldCheck,
  Hash,
  CreditCard,
  Users,
  FileDown,
  Bot,
  Bell,
  Zap,
  Lock,
  Server,
  TrendingUp,
  ArrowRight,
  Vote,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { GithubIcon } from "../components/ui/BrandIcons";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";
import { cn } from "../lib/utils";

const SHIPPED = [
  { icon: MessageSquare, title: "AI Conversational Standups", desc: "6-phase LangGraph flow", quarter: "2026 Q2" },
  { icon: BarChart3, title: "Admin Analytics Dashboard", desc: "Mood, blockers, task status charts", quarter: "2026 Q2" },
  { icon: TrendingUp, title: "Employee Personal Analytics", desc: "Streak, mood trend, history", quarter: "2026 Q2" },
  { icon: Sparkles, title: "RAG Chat Assistant", desc: "Ask anything about your team", quarter: "2026 Q2" },
  { icon: Search, title: "Search + Advanced Filters", desc: "Debounced search, mood/risk/date filters", quarter: "2026 Q3" },
  { icon: Bot, title: "Guided Onboarding Tour", desc: "First-login walkthrough for admin + employees", quarter: "2026 Q3" },
  { icon: Users, title: "Landing + Marketing Site", desc: "Full public site with pricing, features, FAQ", quarter: "2026 Q3" },
];

const IN_PROGRESS = [
  { icon: FileDown, title: "CSV / PDF Export", desc: "Download reports for HR / offline analysis" },
  { icon: Bell, title: "Email Reminders", desc: "Daily reminders for missed standups (SendGrid)" },
  { icon: Users, title: "Team Hierarchy", desc: "Managers see only their team's data" },
  { icon: Sparkles, title: "AI Sentiment Analysis", desc: "Deeper mood detection from chat text" },
];

const PLANNED = [
  { icon: Users, title: "Multi-Tenancy (Organizations)", desc: "Real B2B foundation — one WorkPulse, multiple orgs", priority: "high" },
  { icon: Lock, title: "JWT Authentication", desc: "Proper backend auth beyond Firebase", priority: "high" },
  { icon: CreditCard, title: "Razorpay Subscriptions", desc: "Growth/Pro plans with auto-billing + GST invoices", priority: "high" },
  { icon: Hash, title: "Slack Integration", desc: "Log standups via Slack DMs", priority: "medium" },
  { icon: MessageSquare, title: "WhatsApp Business API", desc: "Reply to WhatsApp to log daily standup (India USP)", priority: "high" },
  { icon: Zap, title: "AI Attrition Risk Prediction", desc: "HR early warning: employees likely to churn", priority: "high" },
  { icon: Bell, title: "Weekly AI Team Pulse", desc: "Auto-generated Monday summary emails to admins", priority: "medium" },
  { icon: Vote, title: "Anonymous Feedback", desc: "Employees submit concerns without revealing identity", priority: "medium" },
  { icon: Server, title: "Self-Hosted Option", desc: "Docker + docker-compose for on-prem deploy", priority: "low" },
  { icon: ShieldCheck, title: "SSO / SAML", desc: "Google Workspace, Microsoft, Okta login", priority: "low" },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-20 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-4">
            <TrendingUp className="h-3 w-3" />
            Roadmap
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What we've shipped,<br />
            what we're building next
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Full transparency on our progress. Vote on planned features, or open a GitHub issue to request one.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/Vijayvsnv/Codenscious-Employee-work-traker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gradient" size="lg">
                <GithubIcon className="h-4 w-4" />
                Request a Feature
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Suggest Priority
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Shipped</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{SHIPPED.length}</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Loader2 className="h-4 w-4 text-warning" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">In Progress</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{IN_PROGRESS.length}</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Planned</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{PLANNED.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Columns */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipped */}
            <Column
              icon={CheckCircle2}
              iconColor="text-success"
              title="Shipped"
              subtitle="Live and in use"
              items={SHIPPED}
              itemBorder="border-success/30"
              status="shipped"
            />

            {/* In Progress */}
            <Column
              icon={Loader2}
              iconColor="text-warning"
              title="In Progress"
              subtitle="Actively being built"
              items={IN_PROGRESS}
              itemBorder="border-warning/30"
              status="in-progress"
            />

            {/* Planned */}
            <Column
              icon={Circle}
              iconColor="text-muted-foreground"
              title="Planned"
              subtitle="On our to-do list"
              items={PLANNED}
              itemBorder="border-border"
              status="planned"
            />
          </div>
        </div>
      </section>

      {/* Vote / Feedback */}
      <section className="py-16 bg-secondary/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
            <Vote className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Have a feature request?
          </h2>
          <p className="mt-3 text-muted-foreground">
            We ship what our users actually want. Tell us what to build next.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/Vijayvsnv/Codenscious-Employee-work-traker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="lg">
                <GithubIcon className="h-4 w-4" />
                Open GitHub Issue
              </Button>
            </a>
            <a href="mailto:hello@codenscious.com">
              <Button variant="outline" size="lg">
                Email Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Column({ icon: Icon, iconColor, title, subtitle, items, itemBorder, status }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-5 w-5", iconColor, status === "in-progress" && "animate-spin-slow")} />
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <Badge variant="outline" className="ml-auto">{items.length}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>

      <div className="space-y-3">
        {items.map((item, i) => (
          <Card
            key={i}
            className={cn(
              "p-4 border-2 transition-all hover:shadow-md",
              itemBorder,
              status === "shipped" && "bg-success/5",
              status === "in-progress" && "bg-warning/5",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  {item.priority && (
                    <Badge
                      variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "warning" : "secondary"}
                      className="text-[10px] shrink-0"
                    >
                      {item.priority}
                    </Badge>
                  )}
                  {item.quarter && (
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{item.quarter}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

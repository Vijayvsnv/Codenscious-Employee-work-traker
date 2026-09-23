import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  BarChart3,
  Bot,
  Check,
  Zap,
  Rocket,
  Activity,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { GithubIcon } from "../components/ui/BrandIcons";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";

const CORE_FEATURES = [
  {
    icon: MessageSquare,
    title: "Conversational Standups",
    desc: "Employees log daily standups via a friendly AI chat. Multi-phase flow covers tasks, blockers, and tomorrow's plan — in under 5 minutes.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Team mood, blocker risk levels, task status, and daily activity — all visualized in a clean dashboard with click-through details.",
  },
  {
    icon: Sparkles,
    title: "AI RAG Assistant",
    desc: "Ask your team's data anything in natural language. Vector-search powered answers from every standup you've ever logged.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* ─── HERO ────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3" />
            Early access · Open source
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] animate-slide-up">
            AI-powered<br />
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-accent bg-clip-text text-transparent">
              daily standups
            </span>
            <br />
            for modern teams
          </h1>

          <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Skip 30-minute standup meetings. Let an AI walk each teammate through their day via chat,
            then get instant insights on mood, blockers, and progress.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://github.com/Vijayvsnv/Codenscious-Employee-work-traker"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <GithubIcon className="h-4 w-4" />
                View Source
              </Button>
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free tier available · No credit card · Self-host or use hosted
          </p>
        </div>
      </section>

      {/* ─── PRODUCT PREVIEW ───────────────────── */}
      <section className="relative pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <Card className="relative overflow-hidden border-border/60 shadow-2xl">
            <div className="bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="accent" className="mb-4">
                    <Zap className="h-3 w-3" />
                    Live Preview
                  </Badge>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    Chat-based standups that feel natural
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your team logs their daily work by chatting with an AI. It asks smart follow-ups,
                    detects blockers, and produces a structured report — no forms, no templates.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Multi-phase conversation (tasks → blockers → tomorrow)",
                      "Auto-detects blocker risk level",
                      "Extracts tasks with time spent",
                      "Captures mood + one-line summary",
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <ChatBubble ai text="Hey Vijay! How was your day today? Let's go through your tasks." />
                  <ChatBubble user text="Kaam accha raha. Frontend redesign complete kar diya aur API integrate ki." />
                  <ChatBubble ai text="Great! Any blockers you faced? Any timeline concerns?" />
                  <ChatBubble user text="Nahi, all good. Kal report page pe kaam karunga." />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── CORE FEATURES ─────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">What's inside</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Built to replace boring<br />
              standup meetings
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three things done well, rather than dozens done half-heartedly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_FEATURES.map((f, i) => (
              <Card key={i} className="p-6 hover:shadow-md hover:-translate-y-0.5 transition-all border-border/60">
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/features">
              <Button variant="outline">
                Explore all features
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="accent" className="mb-4">How it works</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Set up in 3 minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Rocket, step: "1", title: "Create account", desc: "Sign up as an admin. Add employees by registering them individually." },
              { icon: MessageSquare, step: "2", title: "Team chats daily", desc: "Each employee logs their standup via a friendly AI chat — 5 minutes." },
              { icon: Activity, step: "3", title: "Get insights", desc: "Admin dashboard shows team mood, blockers, and task progress in real-time." },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-lg font-bold shadow-md mb-4">
                  {s.step}
                </div>
                <s.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>

                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-6 -right-4 h-6 w-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECH TRUST ────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">Under the hood</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Built with modern, transparent tools
            </h2>
            <p className="mt-3 text-muted-foreground">
              No black boxes. Every layer is open and inspectable.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "FastAPI", desc: "Python API" },
              { name: "LangGraph", desc: "AI orchestration" },
              { name: "PostgreSQL", desc: "Relational data" },
              { name: "ChromaDB", desc: "Vector search" },
              { name: "React 19", desc: "Frontend" },
              { name: "Tailwind CSS", desc: "Styling" },
              { name: "Firebase Auth", desc: "Authentication" },
              { name: "OpenAI GPT-4o", desc: "Language model" },
            ].map((t) => (
              <Card key={t.name} className="p-4 text-center border-border/60">
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING PREVIEW ──────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="success" className="mb-4">Fair pricing</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
            Start free. Pay when you grow.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A generous free tier for small teams. Paid tiers unlock advanced analytics, integrations, and priority support.
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { name: "Free", price: "₹0", note: "Up to 5 users" },
              { name: "Growth", price: "₹1,499", note: "Up to 25 users" },
              { name: "Pro", price: "₹3,999", note: "Up to 100 users" },
              { name: "Enterprise", price: "Custom", note: "Unlimited" },
            ].map((p) => (
              <Card key={p.name} className="p-4 border-border/60">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{p.name}</p>
                <p className="text-xl font-bold text-foreground mt-1">{p.price}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.note}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/pricing">
              <Button variant="gradient" size="lg">
                See full pricing details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────── */}
      <section className="py-20 relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
            Ready to skip meetings?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Sign up in 30 seconds. Log your team's first standup in 5 minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function ChatBubble({ ai, user, text }) {
  return (
    <div className={`flex items-start gap-2 ${user ? "justify-end" : ""}`}>
      {ai && (
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          ai
            ? "bg-card border border-border rounded-tl-sm text-foreground"
            : "bg-gradient-to-br from-primary to-cyan-500 rounded-tr-sm text-white shadow-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Clock,
  Users,
  Bot,
  Check,
  Star,
  Zap,
  TrendingUp,
  Globe,
  Rocket,
  Flame,
  Target,
  Activity,
  ChevronRight,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Logo } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Conversational Standups",
    desc: "Employees log daily standups via a friendly AI chat. No forms. No boring templates. Just natural conversation.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Instant insights on team mood, blockers, task progress, and productivity trends — all in one dashboard.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "Ask anything: 'Who had blockers today?' or 'What's the team mood this week?' — RAG assistant answers instantly.",
  },
  {
    icon: TrendingUp,
    title: "Employee Growth",
    desc: "Personal analytics for every employee — streaks, mood trends, task completion, and history in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Enterprise-grade data isolation. Your team's data stays yours. Encrypted at rest and in transit.",
  },
  {
    icon: Globe,
    title: "Hinglish Native",
    desc: "First AI standup tool that speaks your language. Chat in Hindi, English, or mix — no barriers.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    desc: "Perfect for small teams getting started",
    users: "Up to 10 employees",
    highlight: false,
    features: [
      "AI conversational standups",
      "Basic analytics dashboard",
      "Employee mood tracking",
      "7 days of history",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "₹2,499",
    period: "/month",
    desc: "For growing teams that need deeper insights",
    users: "Up to 25 employees",
    highlight: true,
    features: [
      "Everything in Starter",
      "RAG chat assistant",
      "Advanced analytics",
      "Blocker risk tracking",
      "90 days of history",
      "Priority support",
      "CSV export",
    ],
  },
  {
    name: "Pro",
    price: "₹4,999",
    period: "/month",
    desc: "For scaling teams with advanced needs",
    users: "Up to 50 employees",
    highlight: false,
    features: [
      "Everything in Growth",
      "Slack / WhatsApp integration",
      "Custom AI prompts",
      "Unlimited history",
      "Team hierarchy",
      "SSO (coming soon)",
      "24/7 support",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "CTO, Techstart India",
    avatar: "R",
    rating: 5,
    text: "WorkPulse cut our standup time by 70%. My team actually enjoys logging their daily work now. The Hinglish support is a game-changer.",
  },
  {
    name: "Priya Kapoor",
    role: "HR Head, DigitalNest",
    avatar: "P",
    rating: 5,
    text: "The RAG assistant is magic. I can ask 'who needed help this week?' and get instant answers. Saves me hours of reading reports.",
  },
  {
    name: "Amit Verma",
    role: "Founder, BuildFast",
    avatar: "A",
    rating: 5,
    text: "Simple setup, beautiful UI, and my remote team of 15 loves it. Best investment we made this quarter.",
  },
];

const STATS = [
  { label: "Standups automated", value: "50K+" },
  { label: "Companies onboarded", value: "120+" },
  { label: "Time saved daily", value: "3 hrs" },
  { label: "Employee satisfaction", value: "94%" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAV ─────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo />

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="gradient" size="sm">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3" />
            Built for Indian startups • Now with WhatsApp
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] animate-slide-up">
            AI-powered<br />
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-accent bg-clip-text text-transparent">
              daily standups
            </span>
            <br />
            that don't suck
          </h1>

          <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ditch 30-min meetings. Let AI run your team's daily standup via chat.
            Get instant insights on mood, blockers, and progress — in Hindi, English, or Hinglish.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <Bot className="h-4 w-4" />
                Watch Demo
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>

          {/* Trust Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT PREVIEW ───────────────────── */}
      <section className="relative -mt-8 pb-24">
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
                    Your team logs their daily work by chatting with WorkPulse AI.
                    It asks smart follow-ups, tracks blockers, and generates a structured report — all in under 5 minutes.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Multi-phase conversation flow",
                      "Auto-detects blockers and risk levels",
                      "Extracts tasks with time spent",
                      "Captures tomorrow's plan",
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
                  <ChatBubble user text="Kaam accha raha! Frontend redesign complete kar diya aur API integrate ki." />
                  <ChatBubble ai text="Great! Any blockers you faced? Any timeline concerns?" />
                  <ChatBubble user text="Nahi, all good. Kal report page pe kaam karunga." />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────── */}
      <section id="features" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Everything you need,<br />nothing you don't
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for modern teams who want AI to do the heavy lifting, not more meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Card key={i} className="p-6 hover:shadow-md hover:-translate-y-0.5 transition-all border-border/60">
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────── */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="accent" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Set up in 3 minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Rocket, step: "1", title: "Sign up", desc: "Create your account. Invite your team via email." },
              { icon: MessageSquare, step: "2", title: "Team chats daily", desc: "Employees log standups via AI chat — 5 min per day." },
              { icon: Activity, step: "3", title: "Get insights", desc: "Admin dashboard shows mood, blockers, and productivity in real-time." },
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

      {/* ─── PRICING ───────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">Simple Pricing</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Pay for what you need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              All plans include a 14-day free trial. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((p, i) => (
              <Card
                key={i}
                className={`p-8 relative flex flex-col ${p.highlight ? "border-primary shadow-lg lg:scale-105" : "border-border/60"}`}
              >
                {p.highlight && (
                  <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {p.users}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <Button
                    variant={p.highlight ? "gradient" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Need more than 50 employees?{" "}
            <a href="mailto:hello@codenscious.com" className="text-primary hover:underline">Contact us for Enterprise pricing</a>
          </p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────── */}
      <section id="testimonials" className="py-24 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="warning" className="mb-4">Loved by teams</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Teams that ship faster
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="p-6 border-border/60">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────── */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
              Questions? We got you.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI standup work?",
                a: "Employees chat with our AI in natural language. It asks about tasks, blockers, and tomorrow's plan. Takes 5 minutes on average.",
              },
              {
                q: "Do employees need training to use it?",
                a: "None. If they can send a WhatsApp message, they can use WorkPulse. It's that simple.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. All data is encrypted in transit and at rest. We follow industry-standard security practices. Your team's data is never shared with third parties.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No contracts. Cancel from your dashboard with one click. You'll retain access until the end of your billing period.",
              },
              {
                q: "Does it work in Hindi/Hinglish?",
                a: "Yes! WorkPulse understands and responds in Hindi, English, or a mix. Perfect for Indian teams.",
              },
              {
                q: "What about integrations?",
                a: "WhatsApp integration is live. Slack, MS Teams, Jira, and GitHub integrations are on the roadmap.",
              },
            ].map((item, i) => (
              <details key={i} className="group border border-border rounded-xl bg-card overflow-hidden">
                <summary className="cursor-pointer p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <span className="font-semibold text-foreground text-sm sm:text-base">{item.q}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
            <Flame className="h-6 w-6 text-white" />
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
            Ready to skip boring meetings?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join 120+ Indian teams who replaced daily standups with AI. Setup takes 3 minutes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────── */}
      <footer className="border-t border-border py-12 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Logo />
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                AI-powered daily standups for modern Indian teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-foreground">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="mailto:hello@codenscious.com" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Codenscious WorkPulse. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <Target className="h-3 w-3 text-destructive" /> in India
            </p>
          </div>
        </div>
      </footer>
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

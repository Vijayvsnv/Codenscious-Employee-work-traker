import { Link } from "react-router-dom";
import {
  Target,
  Compass,
  Heart,
  Code,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { GithubIcon } from "../components/ui/BrandIcons";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";

const VALUES = [
  {
    icon: Target,
    title: "Focus over features",
    desc: "We'd rather do three things well than thirty half-heartedly. Every feature is deliberate.",
  },
  {
    icon: Heart,
    title: "Honest early access",
    desc: "We're new. We say so. No fake stats, no fake testimonials. When we ship 100 real customers, we'll say 100.",
  },
  {
    icon: Globe,
    title: "Built for Indian teams",
    desc: "Hinglish first-class. UPI payments. GST invoices. Not a foreign tool bolted onto Indian workflows.",
  },
  {
    icon: Code,
    title: "Open under the hood",
    desc: "Source code is public. No black boxes. Self-host option coming for teams that need full data control.",
  },
];

const TIMELINE = [
  { year: "2025", title: "Idea", desc: "Frustration with 30-minute standup meetings led to the first prototype." },
  { year: "2026 Q1", title: "MVP", desc: "First working version with FastAPI + LangGraph + React." },
  { year: "2026 Q2", title: "Public beta", desc: "Early access opens. Feedback loop with first 10 pilot teams." },
  { year: "2026 Q3", title: "Paid plans", desc: "Razorpay billing, Growth/Pro tiers, and team hierarchy roll out." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Badge variant="accent" className="mb-4">About</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Standup meetings suck.<br />
            We're fixing that.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            WorkPulse is an AI-native replacement for the daily standup meeting.
            We believe async check-ins beat synchronous rituals — especially for distributed and remote teams.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center mb-4">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Our mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Give every team a way to stay aligned without wasting an hour a day in meetings.
                Turn daily updates into structured data that surfaces blockers, mood, and momentum — automatically.
              </p>
            </div>
            <Card className="p-6 border-border/60 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Why now?</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    LLMs make conversational data extraction reliable enough to replace forms.
                    Small teams in India can finally afford enterprise-grade AI tools.
                    The gap for a Hinglish-first, India-priced product is wide open.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-3">Values</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              What we care about
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <Card key={i} className="p-6 border-border/60">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-3">Journey</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Where we've been, where we're going
            </h2>
          </div>

          <div className="space-y-6">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">{t.year}</p>
                  <h3 className="font-semibold text-foreground mt-1">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open source */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg mb-6">
            <GithubIcon className="h-6 w-6" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Open source. Inspectable. Yours.
          </h2>
          <p className="mt-4 text-muted-foreground">
            WorkPulse's source code is public. Star the repo, submit issues, or fork it for your own use.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/Vijayvsnv/Codenscious-Employee-work-traker"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                <GithubIcon className="h-4 w-4" />
                View Source Code
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

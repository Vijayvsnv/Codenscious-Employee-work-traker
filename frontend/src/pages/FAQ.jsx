import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  HelpCircle,
  Rocket,
  CreditCard,
  ShieldCheck,
  Cog,
  MessageSquare,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";
import { cn } from "../lib/utils";

const CATEGORIES = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Rocket,
    faqs: [
      {
        q: "What is WorkPulse?",
        a: "WorkPulse is an AI-powered daily standup tool. Instead of a 30-minute daily meeting, each employee chats with an AI for 5 minutes to log their tasks, blockers, and tomorrow's plan. Admins get real-time analytics.",
      },
      {
        q: "How do I sign up?",
        a: "Go to /register, fill in your name, employee ID, phone, email, and password. That's it — no credit card required for the free tier.",
      },
      {
        q: "Is there a free tier?",
        a: "Yes. Free forever for up to 5 employees with core features: AI standups, basic dashboard, and personal analytics. Upgrade only when you need more users or advanced features.",
      },
      {
        q: "How long does setup take?",
        a: "About 3 minutes. Register as admin, invite employees, and you're ready. First standup can be logged immediately.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. WorkPulse runs in your browser. Works on desktop, tablet, and mobile. Native mobile apps are on the roadmap.",
      },
    ],
  },
  {
    id: "product",
    label: "Product Features",
    icon: MessageSquare,
    faqs: [
      {
        q: "How does the AI standup chat work?",
        a: "Our LangGraph-based AI takes each employee through 6 conversational phases: greeting → tasks → deep-dive follow-ups → blockers → tomorrow's plan → mood. The whole thing takes ~5 minutes.",
      },
      {
        q: "Does it work in Hindi/Hinglish?",
        a: "Yes! The AI understands and responds in Hindi, English, or a mix. Perfect for Indian teams where employees prefer their comfort language.",
      },
      {
        q: "What's the RAG chat assistant?",
        a: "It's an admin-only tool where you can ask natural language questions about your team ('Who had blockers today?', 'What's the team mood this week?') and get instant answers backed by vector search across all standups.",
      },
      {
        q: "Can I see my team's mood over time?",
        a: "Yes. The Admin Dashboard shows mood distribution charts. Each employee also has personal analytics showing their mood trend over the last 30 days.",
      },
      {
        q: "Can employees edit their standup after submitting?",
        a: "This is on our roadmap. For now, once a standup is submitted, it's locked. If you need to correct data, contact your admin.",
      },
      {
        q: "What if an employee forgets to log a standup?",
        a: "Their streak resets. Email reminders (Growth plan) and Slack/WhatsApp reminders (Pro plan) are coming soon to prevent this.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Billing",
    icon: CreditCard,
    faqs: [
      {
        q: "How does the 14-day trial work?",
        a: "Sign up for Growth or Pro and get 14 days of full access. No credit card required upfront. You'll receive a reminder before the trial ends.",
      },
      {
        q: "Can I switch plans?",
        a: "Yes. Upgrade instantly. Downgrade at the end of your billing cycle. No cancellation fees, ever.",
      },
      {
        q: "What payment methods do you accept?",
        a: "UPI, credit/debit cards, and net banking via Razorpay. International cards accepted. GST-compliant invoices are generated automatically.",
      },
      {
        q: "Do prices include GST?",
        a: "No. GST (18%) is added at checkout. You'll receive a proper GST invoice for compliance.",
      },
      {
        q: "What's your refund policy?",
        a: "Full refund within 7 days of your first paid month, no questions asked. After that, you can cancel anytime — no partial refunds for mid-cycle cancellations.",
      },
      {
        q: "Is there an annual discount?",
        a: "Yes. Annual billing saves 17% (roughly 2 months free). Toggle billing cycle on the Pricing page to see the yearly rate.",
      },
      {
        q: "Do you offer discounts for startups or nonprofits?",
        a: "Yes. We offer 50% off for early-stage startups (<₹1cr ARR) and 100% free for registered NGOs. Contact sales@codenscious.com.",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Privacy",
    icon: ShieldCheck,
    faqs: [
      {
        q: "Where is my data stored?",
        a: "Data is stored in PostgreSQL databases hosted on cloud infrastructure. Employee auth is handled by Firebase (Google). Vector embeddings are stored in ChromaDB. All connections use HTTPS/TLS.",
      },
      {
        q: "Do you use my data to train AI models?",
        a: "No. We do not send your data to model training pipelines. LLM calls to OpenAI use your data only to generate the response for you — with data-processing agreements in place.",
      },
      {
        q: "Is my data secure?",
        a: "All traffic is encrypted. Passwords are hashed via Firebase Auth. Database access is restricted. We do not sell data to third parties, ever.",
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You can delete your account from settings. Full deletion (including backups) takes up to 120 days. Contact privacy@codenscious.com to expedite.",
      },
      {
        q: "Are you GDPR / DPDP compliant?",
        a: "We follow the principles of both. Formal compliance certification is on our roadmap for Pro and Enterprise plans.",
      },
      {
        q: "Can I self-host WorkPulse?",
        a: "Self-hosting is coming as an Enterprise feature. The core code is open source on GitHub if you want to run it yourself today.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    icon: Cog,
    faqs: [
      {
        q: "What tech stack does WorkPulse use?",
        a: "Backend: FastAPI, PostgreSQL, LangGraph, LangChain, ChromaDB, OpenAI GPT-4o. Frontend: React 19, Vite, Tailwind CSS, Firebase Auth, Recharts.",
      },
      {
        q: "Do you have an API?",
        a: "The FastAPI backend exposes REST endpoints (see /docs when the backend is running). Public API access is a Pro-tier feature.",
      },
      {
        q: "How do integrations work?",
        a: "Slack, WhatsApp, and email integrations are on our roadmap. They'll work via webhooks — you connect them once from admin settings.",
      },
      {
        q: "Can I export my data?",
        a: "Yes. CSV export is available on Growth and above. PDF weekly digests are coming for Pro plans.",
      },
      {
        q: "What browsers are supported?",
        a: "Latest 2 versions of Chrome, Firefox, Safari, Edge, and Brave. Mobile browsers on iOS 15+ and Android 10+.",
      },
    ],
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const searchLower = searchTerm.toLowerCase().trim();

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter((f) => {
      if (!searchLower) return true;
      return (
        f.q.toLowerCase().includes(searchLower) ||
        f.a.toLowerCase().includes(searchLower)
      );
    }),
  })).filter((cat) => {
    if (activeCategory !== "all" && cat.id !== activeCategory) return false;
    return cat.faqs.length > 0;
  });

  const totalResults = filteredCategories.reduce((sum, c) => sum + c.faqs.length, 0);

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
            <HelpCircle className="h-3 w-3" />
            FAQ
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Answers to common questions. Can't find yours?{" "}
            <Link to="/contact" className="text-primary hover:underline font-medium">Contact us</Link>.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="border-b border-border sticky top-[65px] z-30 bg-background/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 -mb-px">
            <CategoryTab
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              icon={HelpCircle}
              label="All"
            />
            {CATEGORIES.map((cat) => (
              <CategoryTab
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                icon={cat.icon}
                label={cat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {searchTerm && (
            <p className="text-sm text-muted-foreground mb-6">
              {totalResults === 0
                ? `No results for "${searchTerm}"`
                : `${totalResults} result${totalResults === 1 ? "" : "s"} for "${searchTerm}"`}
            </p>
          )}

          {filteredCategories.length === 0 && !searchTerm && (
            <Card className="p-8 text-center border-border/60">
              <p className="text-sm text-muted-foreground">No FAQs in this category yet.</p>
            </Card>
          )}

          {filteredCategories.length === 0 && searchTerm && (
            <Card className="p-8 text-center border-border/60">
              <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No matches found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try different keywords, or{" "}
                <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
              </p>
            </Card>
          )}

          <div className="space-y-10">
            {filteredCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <CatIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">{cat.label}</h2>
                  </div>
                  <div className="space-y-2">
                    {cat.faqs.map((item, i) => (
                      <details key={i} className="group border border-border rounded-xl bg-card overflow-hidden">
                        <summary className="cursor-pointer p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                          <span className="font-semibold text-foreground text-sm pr-4">{item.q}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                        </summary>
                        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still have questions? */}
      <section className="py-16 bg-secondary/30 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Still have questions?
          </h2>
          <p className="mt-3 text-muted-foreground">
            We respond to every message. Usually within 24 hours.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact">
              <Button variant="gradient" size="lg">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://github.com/Vijayvsnv/Codenscious-Employee-work-traker/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                Open GitHub Issue
              </Button>
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function CategoryTab({ active, onClick, icon: Icon, label }) {
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

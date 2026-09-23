import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  X,
  Star,
  Users,
  Sparkles,
  Zap,
  Crown,
  HelpCircle,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";
import { cn } from "../lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    priceLabel: "₹0",
    period: "forever",
    desc: "For small teams testing the waters",
    users: "Up to 5 employees",
    icon: null,
    highlight: false,
    cta: "Start Free",
    ctaVariant: "outline",
    features: [
      "AI conversational standups",
      "Basic analytics dashboard",
      "Employee personal analytics",
      "Mood + streak tracking",
      "7 days report history",
      "Light + dark theme",
      "Community support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: { monthly: 1499, yearly: 14990 },
    priceLabel: "₹1,499",
    period: "/month",
    desc: "For growing teams that need deeper insights",
    users: "Up to 25 employees",
    icon: Zap,
    highlight: true,
    cta: "Start 14-day Trial",
    ctaVariant: "gradient",
    features: [
      "Everything in Free",
      "RAG chat assistant",
      "Full-text search + filters",
      "Advanced analytics",
      "Blocker risk classification",
      "90 days history",
      "CSV export",
      "Email reminders (coming)",
      "Priority email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 3999, yearly: 39990 },
    priceLabel: "₹3,999",
    period: "/month",
    desc: "For scaling teams with advanced needs",
    users: "Up to 100 employees",
    icon: Sparkles,
    highlight: false,
    cta: "Start 14-day Trial",
    ctaVariant: "outline",
    features: [
      "Everything in Growth",
      "Slack integration (coming)",
      "WhatsApp integration (coming)",
      "Custom AI prompts",
      "Team hierarchy",
      "Unlimited history",
      "PDF weekly digests (coming)",
      "API access",
      "Priority chat + phone support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: null, yearly: null },
    priceLabel: "Custom",
    period: "",
    desc: "For large orgs with security requirements",
    users: "Unlimited employees",
    icon: Crown,
    highlight: false,
    cta: "Contact Sales",
    ctaVariant: "outline",
    features: [
      "Everything in Pro",
      "SSO / SAML (coming)",
      "Self-hosted option (coming)",
      "Dedicated account manager",
      "SLA + uptime guarantee",
      "Custom data retention",
      "Audit logs",
      "Custom onboarding",
    ],
  },
];

const COMPARISON_ROWS = [
  { section: "AI Standups", items: [
    { name: "Conversational AI chat", free: true, growth: true, pro: true, enterprise: true },
    { name: "Multi-phase flow (tasks → blockers → tomorrow)", free: true, growth: true, pro: true, enterprise: true },
    { name: "Hinglish support", free: true, growth: true, pro: true, enterprise: true },
    { name: "Custom AI prompts", free: false, growth: false, pro: true, enterprise: true },
  ]},
  { section: "Analytics", items: [
    { name: "Basic admin dashboard", free: true, growth: true, pro: true, enterprise: true },
    { name: "Employee personal analytics", free: true, growth: true, pro: true, enterprise: true },
    { name: "Streak + mood tracking", free: true, growth: true, pro: true, enterprise: true },
    { name: "Advanced blocker risk analysis", free: false, growth: true, pro: true, enterprise: true },
    { name: "Team hierarchy view", free: false, growth: false, pro: true, enterprise: true },
    { name: "Custom dashboards", free: false, growth: false, pro: false, enterprise: true },
  ]},
  { section: "AI Assistant", items: [
    { name: "RAG chat assistant", free: false, growth: true, pro: true, enterprise: true },
    { name: "Vector search", free: false, growth: true, pro: true, enterprise: true },
    { name: "Custom prompts", free: false, growth: false, pro: true, enterprise: true },
  ]},
  { section: "Data & History", items: [
    { name: "Report history", free: "7 days", growth: "90 days", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Full-text search + filters", free: false, growth: true, pro: true, enterprise: true },
    { name: "CSV export", free: false, growth: true, pro: true, enterprise: true },
    { name: "PDF digests (coming)", free: false, growth: false, pro: true, enterprise: true },
    { name: "API access", free: false, growth: false, pro: true, enterprise: true },
  ]},
  { section: "Integrations (coming)", items: [
    { name: "Email reminders", free: false, growth: true, pro: true, enterprise: true },
    { name: "Slack integration", free: false, growth: false, pro: true, enterprise: true },
    { name: "WhatsApp Business", free: false, growth: false, pro: true, enterprise: true },
    { name: "Calendar sync", free: false, growth: false, pro: true, enterprise: true },
    { name: "Jira / GitHub sync", free: false, growth: false, pro: false, enterprise: true },
  ]},
  { section: "Security & Compliance", items: [
    { name: "HTTPS encryption", free: true, growth: true, pro: true, enterprise: true },
    { name: "Firebase authentication", free: true, growth: true, pro: true, enterprise: true },
    { name: "SSO / SAML (coming)", free: false, growth: false, pro: false, enterprise: true },
    { name: "Self-hosted option", free: false, growth: false, pro: false, enterprise: true },
    { name: "Audit logs", free: false, growth: false, pro: false, enterprise: true },
    { name: "GDPR / DPDP compliance", free: false, growth: false, pro: true, enterprise: true },
  ]},
  { section: "Support", items: [
    { name: "Community + GitHub issues", free: true, growth: true, pro: true, enterprise: true },
    { name: "Email support", free: false, growth: true, pro: true, enterprise: true },
    { name: "Priority chat + phone", free: false, growth: false, pro: true, enterprise: true },
    { name: "Dedicated account manager", free: false, growth: false, pro: false, enterprise: true },
    { name: "Custom onboarding", free: false, growth: false, pro: false, enterprise: true },
  ]},
  { section: "Limits", items: [
    { name: "Max employees", free: "5", growth: "25", pro: "100", enterprise: "Unlimited" },
    { name: "AI chats per month", free: "150", growth: "1,000", pro: "5,000", enterprise: "Unlimited" },
    { name: "Storage", free: "500 MB", growth: "5 GB", pro: "50 GB", enterprise: "Custom" },
  ]},
];

const FAQS = [
  { q: "Is there really a free tier?", a: "Yes. Free forever for up to 5 employees. No credit card required. If you outgrow it, upgrade anytime." },
  { q: "How does the 14-day trial work?", a: "Sign up for Growth or Pro and get 14 days of full access. No credit card upfront. You'll get a reminder before the trial ends." },
  { q: "Can I change plans anytime?", a: "Yes. Upgrade instantly. Downgrade at the end of your billing cycle. No cancellation fees, ever." },
  { q: "What payment methods do you accept?", a: "UPI, credit/debit cards, and net banking via Razorpay. International cards accepted. GST invoices provided." },
  { q: "Do prices include GST?", a: "No. GST (18%) is added at checkout. You'll receive a proper GST invoice for compliance." },
  { q: "What's your refund policy?", a: "Full refund within 7 days of your first paid month, no questions asked. See our Terms for details." },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const yearlyDiscount = 0.17; // ~2 months free

  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-24 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge variant="success" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Fair pricing.<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              No surprises.
            </span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you're ready. Cancel anytime. All prices in INR, GST extra.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                billingCycle === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                billingCycle === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Yearly
              <Badge variant="success" className="text-[10px]">Save 17%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p) => {
              const PIcon = p.icon;
              const priceDisplay = p.price.monthly === null
                ? "Custom"
                : billingCycle === "yearly" && p.price.monthly > 0
                  ? `₹${Math.round(p.price.monthly * 12 * (1 - yearlyDiscount)).toLocaleString('en-IN')}`
                  : p.priceLabel;
              const periodDisplay = p.price.monthly === null
                ? ""
                : p.price.monthly === 0
                  ? p.period
                  : billingCycle === "yearly" ? "/year" : p.period;

              return (
                <Card
                  key={p.id}
                  className={cn(
                    "p-6 relative flex flex-col",
                    p.highlight ? "border-primary shadow-lg" : "border-border/60"
                  )}
                >
                  {p.highlight && (
                    <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      {PIcon && <PIcon className="h-4 w-4 text-primary" />}
                      <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>

                  <div className="mb-5">
                    <span className="text-3xl font-bold text-foreground">{priceDisplay}</span>
                    {periodDisplay && (
                      <span className="text-sm text-muted-foreground ml-1">{periodDisplay}</span>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {p.users}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {p.id === "enterprise" ? (
                    <a href="mailto:hello@codenscious.com">
                      <Button variant={p.ctaVariant} size="lg" className="w-full">
                        {p.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link to="/register">
                      <Button variant={p.ctaVariant} size="lg" className="w-full">
                        {p.cta}
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Compare plans in detail
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every feature, spelled out. No fine print.
            </p>
          </div>

          <Card className="border-border/60 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="sticky top-0 bg-card z-10 border-b-2 border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground min-w-[280px]">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">Free</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-primary bg-primary/5">Growth</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-accent">Pro</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-warning">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((section, i) => (
                  <>
                    <tr key={`s${i}`} className="bg-secondary/40">
                      <td colSpan={5} className="px-6 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {section.section}
                      </td>
                    </tr>
                    {section.items.map((row, j) => (
                      <tr key={`${i}-${j}`} className="border-b border-border/50">
                        <td className="px-6 py-3 text-sm text-foreground">{row.name}</td>
                        <td className="px-4 py-3 text-center"><CellValue value={row.free} /></td>
                        <td className="px-4 py-3 text-center bg-primary/5"><CellValue value={row.growth} /></td>
                        <td className="px-4 py-3 text-center"><CellValue value={row.pro} /></td>
                        <td className="px-4 py-3 text-center"><CellValue value={row.enterprise} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* Payment info */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              How you pay
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5 border-border/60">
              <p className="font-semibold text-foreground text-sm mb-2">Accepted payments</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                UPI · Credit/Debit cards · Net banking · International cards. Powered by Razorpay.
              </p>
            </Card>
            <Card className="p-5 border-border/60">
              <p className="font-semibold text-foreground text-sm mb-2">Invoicing</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                GST-compliant invoices auto-generated. Downloadable from your billing dashboard.
              </p>
            </Card>
            <Card className="p-5 border-border/60">
              <p className="font-semibold text-foreground text-sm mb-2">Refund policy</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Full refund within 7 days of first paid month. Cancel anytime, prorated.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-3">
              <HelpCircle className="h-3 w-3" />
              Pricing FAQ
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Questions about pricing?
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <details key={i} className="group border border-border rounded-xl bg-card overflow-hidden">
                <summary className="cursor-pointer p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <span className="font-semibold text-foreground text-sm">{item.q}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Have another question?{" "}
            <Link to="/contact" className="text-primary hover:underline font-medium">Contact us</Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function CellValue({ value }) {
  if (value === true) {
    return <Check className="h-4 w-4 text-success mx-auto" />;
  }
  if (value === false) {
    return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span className="text-xs font-medium text-foreground">{value}</span>;
}

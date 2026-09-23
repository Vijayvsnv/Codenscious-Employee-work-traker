import { useState } from "react";
import {
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  Globe,
} from "lucide-react";
import { GithubIcon, LinkedInIcon } from "../components/ui/BrandIcons";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input, Label, Textarea } from "../components/ui/Input";
import { MarketingNavbar } from "../components/marketing/Navbar";
import { MarketingFooter } from "../components/marketing/Footer";

const CONTACT_OPTIONS = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@codenscious.com",
    href: "mailto:hello@codenscious.com",
    desc: "For general questions and support",
  },
  {
    icon: MessageSquare,
    label: "Sales inquiries",
    value: "sales@codenscious.com",
    href: "mailto:sales@codenscious.com",
    desc: "For enterprise pricing and demos",
  },
  {
    icon: GithubIcon,
    label: "GitHub Issues",
    value: "Report bugs & features",
    href: "https://github.com/Vijayvsnv/Codenscious-Employee-work-traker/issues",
    desc: "Best for technical issues",
  },
];

const SUBJECT_OPTIONS = [
  "General Question",
  "Sales / Enterprise",
  "Bug Report",
  "Feature Request",
  "Partnership",
  "Media / Press",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: SUBJECT_OPTIONS[0],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message");
      return;
    }
    setSubmitting(true);

    // Simple mailto approach — no backend needed for now
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0ACompany: ${form.company}%0D%0ASubject: ${form.subject}%0D%0A%0D%0A${form.message}`;
    window.location.href = `mailto:hello@codenscious.com?subject=[WorkPulse] ${encodeURIComponent(form.subject)}&body=${body}`;

    toast.success("Opening your email client...");
    setTimeout(() => setSubmitting(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-20 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-4">Contact</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Let's talk
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions, feedback, partnerships — we respond to every message.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact options — left col */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Get in touch
              </h2>

              {CONTACT_OPTIONS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  <Card className="p-5 border-border/60 hover:border-primary/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <c.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">{c.label}</p>
                        <p className="font-semibold text-foreground text-sm mt-0.5 truncate">
                          {c.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}

              <Card className="p-5 border-border/60">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Based in India</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Building for teams across South Asia and beyond
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Response time</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Usually within 24 hours on business days
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2 pt-2">
                <a
                  href="https://github.com/Vijayvsnv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://codenscious.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Contact form — right col */}
            <div className="lg:col-span-3">
              <Card className="p-6 lg:p-8 border-border/60">
                <h2 className="text-xl font-bold text-foreground mb-1">Send a message</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill this out and we'll get back to you at your email.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your name *</Label>
                      <Input
                        id="name"
                        placeholder="Vijay Sharma"
                        value={form.name}
                        onChange={handleChange("name")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={handleChange("email")}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        placeholder="Acme Inc."
                        value={form.company}
                        onChange={handleChange("company")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        value={form.subject}
                        onChange={handleChange("subject")}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={handleChange("message")}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to our{" "}
                      <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
                    </p>
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      loading={submitting}
                    >
                      Send Message
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

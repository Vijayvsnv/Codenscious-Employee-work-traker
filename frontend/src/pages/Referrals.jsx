import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  Gift,
  Copy,
  Check,
  Share2,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Logo } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function Referrals() {
  const { state: user } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Ensure a code exists
      await axios.post(`${API_BASE}/referral/my-code`, {
        emp_id: user.emp_id,
        name: user.name || "",
      });
      const res = await axios.get(`${API_BASE}/referral/stats/${user.emp_id}`);
      setStats(res.data);
    } catch {
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = stats?.referral_code
    ? `${window.location.origin}/register?ref=${stats.referral_code}`
    : "";

  const copyCode = async () => {
    if (!stats?.referral_code) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  const shareNative = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Try WorkPulse",
          text: `${user.name?.split(" ")[0] || "I"} recommends WorkPulse — AI-powered daily standups. Sign up with my link for a bonus:`,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyCode();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard", { state: user })}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo />
            <Badge variant="warning" className="hidden sm:inline-flex ml-2">
              <Gift className="h-3 w-3" />
              Refer & Earn
            </Badge>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-5 w-5 text-warning" />
            <span className="text-sm text-warning font-medium">Refer a Friend</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Get 1 month free for every referral
          </h1>
          <p className="mt-2 text-muted-foreground">
            Share your code. When someone signs up and upgrades, you both get rewarded.
          </p>
        </div>

        {/* Share card */}
        <Card className="mb-6 border-warning/30 bg-gradient-to-br from-warning/5 to-accent/5">
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Your Referral Code
                </p>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
                    <code className="font-mono font-bold text-lg text-foreground truncate">
                      {stats?.referral_code || "—"}
                    </code>
                  </div>
                  <Button variant="default" onClick={copyCode} className="shrink-0">
                    {copied ? (
                      <><Check className="h-4 w-4" />Copied!</>
                    ) : (
                      <><Copy className="h-4 w-4" />Copy Link</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={shareNative} className="shrink-0">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                {stats?.referral_code && (
                  <p className="mt-3 text-xs text-muted-foreground break-all">
                    Or share this link: <span className="text-foreground">{shareUrl}</span>
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Signups" value={stats?.total_signups ?? 0} icon={Users} color="primary" loading={loading} />
          <StatCard label="Paid Conversions" value={stats?.total_paid_conversions ?? 0} icon={TrendingUp} color="success" loading={loading} />
          <StatCard label="Months Earned" value={stats?.free_months_earned ?? 0} icon={Award} color="warning" loading={loading} />
          <StatCard label="Pending Reward" value={stats?.pending_reward ?? 0} icon={Gift} color="accent" loading={loading} />
        </div>

        {/* How it works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
            <CardDescription>Simple three-step reward flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { step: "1", title: "Share your code", desc: "Send your unique link to friends, colleagues, or founders" },
                { step: "2", title: "They sign up", desc: "Anyone who registers with your code gets counted" },
                { step: "3", title: "You earn 1 month free", desc: "Applied when they upgrade to a paid plan" },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-warning to-accent text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referrals list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Referrals</CardTitle>
            <CardDescription>People who signed up with your code</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : !stats?.referrals || stats.referrals.length === 0 ? (
              <div className="p-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">No referrals yet</p>
                <p className="text-xs text-muted-foreground mt-1">Share your code above to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-border bg-secondary/30">
                      {["Name", "Signed Up", "Status", "Reward"].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.referrals.map((r, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center text-white text-xs font-semibold">
                              {r.new_name?.charAt(0) || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{r.new_name || "—"}</p>
                              <p className="text-[11px] text-muted-foreground">{r.new_emp_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {r.signed_up_at ? new Date(r.signed_up_at).toLocaleDateString() : "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {r.converted_paid ? (
                            <Badge variant="success">
                              <CheckCircle2 className="h-3 w-3" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Free trial</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.reward_credited ? (
                            <Badge variant="warning">
                              <Award className="h-3 w-3" />
                              +1 month
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending upgrade</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, loading }) {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    success: "text-success bg-success/10 border-success/20",
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border mb-3", colorMap[color])}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-16 mt-1.5" />
        ) : (
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

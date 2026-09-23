import { Sparkles, Crown, Zap, Lock, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

const PLAN_STYLES = {
  free: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    icon: null,
  },
  growth: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
    icon: Zap,
  },
  pro: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/30",
    icon: Sparkles,
  },
  enterprise: {
    bg: "bg-gradient-to-r from-warning/10 to-orange-500/10",
    text: "text-warning",
    border: "border-warning/30",
    icon: Crown,
  },
  soon: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    icon: Clock,
  },
};

const PLAN_LABEL = {
  free: "Free",
  growth: "Growth",
  pro: "Pro",
  enterprise: "Enterprise",
  soon: "Coming Soon",
};

export function ProBadge({ plan = "pro", className, showLabel = true }) {
  const style = PLAN_STYLES[plan] || PLAN_STYLES.pro;
  const Icon = style.icon;
  const label = PLAN_LABEL[plan] || plan;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {Icon && <Icon className="h-2.5 w-2.5" />}
      {showLabel && label}
    </span>
  );
}

export function LockedFeature({ plan = "pro", label = "Upgrade to unlock", onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary transition-colors",
        className
      )}
    >
      <Lock className="h-3 w-3" />
      <span>{label}</span>
      <ProBadge plan={plan} showLabel={true} />
    </button>
  );
}

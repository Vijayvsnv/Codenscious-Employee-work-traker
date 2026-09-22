import { cn } from "../../lib/utils";

export function Logo({ size = "md", showText = true, variant = "primary", className }) {
  const sizes = {
    sm: { box: "h-7 w-7 text-xs", text: "text-sm" },
    md: { box: "h-9 w-9 text-base", text: "text-base" },
    lg: { box: "h-11 w-11 text-lg", text: "text-lg" },
  };

  const gradients = {
    primary: "from-primary to-cyan-500",
    admin: "from-accent to-indigo-600",
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg font-bold text-white shadow-md bg-gradient-to-br",
          gradients[variant],
          s.box
        )}
      >
        W
      </div>
      {showText && (
        <span className={cn("font-semibold tracking-tight text-foreground", s.text)}>
          WorkPulse
        </span>
      )}
    </div>
  );
}

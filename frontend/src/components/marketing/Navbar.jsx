import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowRight, Search } from "lucide-react";

import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "FAQ", to: "/faq" },
  { label: "About", to: "/about" },
];

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac/i.test(navigator.userAgent));
  }, []);

  const openPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="hidden lg:inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>
          <ThemeToggle />
          <Link to="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/register" className="hidden sm:inline-flex">
            <Button variant="gradient" size="sm">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block text-sm text-foreground/80 hover:text-foreground py-1.5"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Sign in</Button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <Button variant="gradient" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Users,
  FileText,
  DollarSign,
  Info,
  Mail,
  HelpCircle,
  TrendingUp,
  Sun,
  Moon,
  LogOut,
  ArrowRight,
  Rocket,
  Command,
  ChevronsRight,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

const NAV_COMMANDS = [
  // Public
  { section: "Marketing", label: "Home", icon: Home, action: (nav) => nav("/") },
  { section: "Marketing", label: "Features", icon: Rocket, action: (nav) => nav("/features") },
  { section: "Marketing", label: "Pricing", icon: DollarSign, action: (nav) => nav("/pricing") },
  { section: "Marketing", label: "Roadmap", icon: TrendingUp, action: (nav) => nav("/roadmap") },
  { section: "Marketing", label: "About", icon: Info, action: (nav) => nav("/about") },
  { section: "Marketing", label: "Contact", icon: Mail, action: (nav) => nav("/contact") },
  { section: "Marketing", label: "FAQ", icon: HelpCircle, action: (nav) => nav("/faq") },

  // Product
  { section: "Product", label: "Employee Dashboard", icon: LayoutDashboard, action: (nav, user) => nav("/dashboard", { state: user }), needsUser: true },
  { section: "Product", label: "Start Standup Chat", icon: MessageSquare, action: (nav, user) => nav("/chat", { state: user }), needsUser: true },
  { section: "Product", label: "My Analytics", icon: BarChart3, action: (nav, user) => nav("/my-analytics", { state: user }), needsUser: true },
  { section: "Product", label: "Admin Dashboard", icon: Users, action: (nav) => nav("/admin/dashboard") },

  // Auth
  { section: "Account", label: "Sign In", icon: LogOut, action: (nav) => nav("/login") },
  { section: "Account", label: "Register", icon: Users, action: (nav) => nav("/register") },
];

export function CommandPalette({ open, onClose, user }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const themeCommand = {
    section: "Appearance",
    label: theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode",
    icon: theme === "dark" ? Sun : Moon,
    action: () => toggleTheme(),
  };

  const allCommands = useMemo(() => [...NAV_COMMANDS, themeCommand], [theme]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allCommands;
    return allCommands.filter((c) =>
      c.label.toLowerCase().includes(q) || c.section.toLowerCase().includes(q)
    );
  }, [query, allCommands]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((cmd) => {
      if (!groups[cmd.section]) groups[cmd.section] = [];
      groups[cmd.section].push(cmd);
    });
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runCommand = (cmd) => {
    if (cmd.needsUser && !user) {
      navigate("/login");
    } else {
      cmd.action(navigate, user);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  };

  if (!open) return null;

  let runningIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results for "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([section, cmds]) => (
              <div key={section} className="pb-1">
                <p className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {section}
                </p>
                {cmds.map((cmd) => {
                  const idx = runningIdx++;
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={cmd.label}
                      onClick={() => runCommand(cmd)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors",
                        active && "bg-primary/10 text-primary"
                      )}
                    >
                      <cmd.icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1 text-left">{cmd.label}</span>
                      {active && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-muted-foreground bg-secondary/30">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">esc</kbd>
              close
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShortcutsHelpModal({ open, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const SHORTCUTS = [
    { section: "General", items: [
      { keys: ["Ctrl", "K"], label: "Open command palette", macKeys: ["⌘", "K"] },
      { keys: ["Ctrl", "/"], label: "Show shortcuts (this modal)", macKeys: ["⌘", "/"] },
      { keys: ["Esc"], label: "Close modal / cancel" },
    ]},
    { section: "Navigation (via palette)", items: [
      { keys: ["↑", "↓"], label: "Move between items" },
      { keys: ["↵"], label: "Select item" },
    ]},
    { section: "Chat / Standup", items: [
      { keys: ["↵"], label: "Send message" },
      { keys: ["Shift", "↵"], label: "New line" },
    ]},
  ];

  const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Command className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ESC
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {SHORTCUTS.map((sec, i) => (
            <div key={i}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {sec.section}
              </p>
              <div className="space-y-1.5">
                {sec.items.map((sc, j) => {
                  const keys = isMac && sc.macKeys ? sc.macKeys : sc.keys;
                  return (
                    <div key={j} className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-secondary/50">
                      <span className="text-foreground/90">{sc.label}</span>
                      <div className="flex items-center gap-1">
                        {keys.map((k, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            <kbd className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] font-mono text-foreground">
                              {k}
                            </kbd>
                            {idx < keys.length - 1 && <ChevronsRight className="h-3 w-3 text-muted-foreground" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function useKeyboardShortcuts() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;

      // Cmd+K or Ctrl+K -> palette
      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        setHelpOpen(false);
      }
      // Cmd+/ or Ctrl+/ -> help
      else if (cmdOrCtrl && e.key === "/") {
        e.preventDefault();
        setHelpOpen(true);
        setPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return {
    paletteOpen,
    setPaletteOpen,
    helpOpen,
    setHelpOpen,
  };
}

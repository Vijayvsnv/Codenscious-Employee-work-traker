import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Send,
  Sparkles,
  CheckCircle2,
  Flame,
  Smile,
  Frown,
  ArrowLeft,
  Bot,
} from "lucide-react";

import { Button } from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";
import { Textarea } from "./components/ui/Input";
import { Logo } from "./components/ui/Logo";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { cn } from "./lib/utils";

const API_BASE = "http://127.0.0.1:8000";

const PHASE_MAP = {
  greeting: { label: "Greeting", step: 1 },
  task: { label: "Tasks", step: 2 },
  cross_question: { label: "Deep Dive", step: 3 },
  blocker: { label: "Blockers", step: 4 },
  tomorrow: { label: "Tomorrow", step: 5 },
  mood: { label: "Wrap Up", step: 6 },
  done: { label: "Complete", step: 6 },
};

function Chat() {
  const { state: user } = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [phase, setPhase] = useState("greeting");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [mood, setMood] = useState(null);
  const [daySummary, setDaySummary] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, done]);

  const addAI = (text) => setMessages((prev) => [...prev, { role: "ai", text }]);
  const addUser = (text) => setMessages((prev) => [...prev, { role: "user", text }]);

  const startSession = async () => {
    try {
      const res = await axios.post(`${API_BASE}/chat/start`, {
        emp_id: user.emp_id,
        emp_name: user.name,
      });
      setSessionId(res.data.session_id);
      setPhase(res.data.phase);
      addAI(res.data.message);
    } catch {
      toast.error("Connection error. Please make sure the backend is running.");
    } finally {
      setInitializing(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !sessionId) return;

    addUser(text);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat/message`, {
        session_id: sessionId,
        message: text,
      });

      const newPhase = res.data.phase;
      setPhase(newPhase);
      if (res.data.message) addAI(res.data.message);
      if (newPhase === "done") setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubmitStandup = async () => {
    if (!mood) return toast.error("Please select your mood first");
    if (!daySummary.trim()) return toast.error("Please write a one-line summary");

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/chat/end`, {
        session_id: sessionId,
        mood,
        day_summary: daySummary.trim(),
      });
      toast.success("Standup saved successfully!");
      setSubmitted(true);
    } catch {
      toast.error("Failed to save report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "";
  const currentStep = PHASE_MAP[phase]?.step || 1;

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-10 text-center animate-fade-in">
          <div className="mx-auto h-16 w-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-5">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Standup Submitted!</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Your daily report has been saved. Great work today, {firstName}!
          </p>
          <Button
            variant="gradient"
            size="lg"
            className="mt-6 w-full"
            onClick={() => navigate("/dashboard", { state: user })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard", { state: user })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="hidden sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              {PHASE_MAP[phase]?.label || "In Progress"}
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto px-6 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {currentStep}/6
            </span>
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 min-h-0">
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {initializing && (
            <div className="flex items-start gap-3">
              <AIAvatar />
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <Dot />
                <Dot delay="0.15s" />
                <Dot delay="0.3s" />
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 animate-fade-in",
                m.role === "user" && "justify-end"
              )}
            >
              {m.role === "ai" && <AIAvatar />}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "ai"
                    ? "bg-card border border-border text-foreground rounded-tl-sm"
                    : "bg-gradient-to-br from-primary to-cyan-500 text-white rounded-tr-sm shadow-sm"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <AIAvatar />
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <Dot />
                <Dot delay="0.15s" />
                <Dot delay="0.3s" />
              </div>
            </div>
          )}

          {done && !submitted && (
            <Card className="animate-fade-in border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="mb-5">
                  <h3 className="font-semibold text-foreground">Almost done!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    How was your day overall?
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { value: "Low", icon: Frown, color: "destructive" },
                    { value: "Medium", icon: Smile, color: "warning" },
                    { value: "High", icon: Flame, color: "success" },
                  ].map((m) => {
                    const active = mood === m.value;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 py-4 rounded-lg border transition-all",
                          active
                            ? m.color === "success"
                              ? "border-success bg-success/10 text-success"
                              : m.color === "warning"
                              ? "border-warning bg-warning/10 text-warning"
                              : "border-destructive bg-destructive/10 text-destructive"
                            : "border-border bg-background hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        <m.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{m.value}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 mb-5">
                  <label className="text-sm font-medium text-foreground/90">
                    Describe your day in one line
                  </label>
                  <Textarea
                    placeholder="e.g. Productive day — shipped 2 features and unblocked a teammate"
                    value={daySummary}
                    onChange={(e) => setDaySummary(e.target.value)}
                    rows={2}
                  />
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmitStandup}
                  loading={submitting}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Standup
                </Button>
              </CardContent>
            </Card>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!done && (
          <div className="sticky bottom-0 bg-background border-t border-border py-4">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading || initializing}
                className="min-h-[46px] max-h-32 py-3"
              />
              <Button
                variant="gradient"
                size="icon"
                className="h-11 w-11 shrink-0"
                onClick={sendMessage}
                disabled={loading || !input.trim() || initializing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AIAvatar() {
  return (
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
      <Bot className="h-4 w-4" />
    </div>
  );
}

function Dot({ delay = "0s" }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot"
      style={{ animationDelay: delay }}
    />
  );
}

export default Chat;

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles, Lightbulb, Loader2, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { MarkdownContent } from "./MarkdownContent";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export function BlockerSuggestion({ blocker, empId, className }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchSuggestion = async () => {
    if (!blocker || !blocker.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/employee/blocker/suggest`, {
        blocker: blocker.trim(),
        emp_id: empId,
      });
      setResult(res.data);
      setExpanded(true);
    } catch {
      toast.error("Couldn't fetch AI suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`border-accent/30 bg-accent/5 ${className || ""}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Lightbulb className="h-4 w-4 text-accent" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground">AI Resolution Assistant</p>
              <Badge variant="accent" className="text-[10px]">
                <Sparkles className="h-2.5 w-2.5" />
                RAG
              </Badge>
            </div>

            {!result && (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  Get suggestions based on how your team resolved similar blockers before.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSuggestion}
                  disabled={loading || !blocker?.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Searching past blockers...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Get AI Suggestions
                    </>
                  )}
                </Button>
              </>
            )}

            {result && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <span>
                    Matched <strong className="text-foreground">{result.matched}</strong> similar past blocker(s)
                  </span>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-auto text-primary hover:underline flex items-center gap-1"
                  >
                    {expanded ? "Collapse" : "Expand"}
                    <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {expanded && (
                  <>
                    <div className="rounded-lg bg-card border border-border p-3 mb-3">
                      <MarkdownContent>{result.suggestion}</MarkdownContent>
                    </div>

                    {result.sources && result.sources.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.sources.map((s, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50 text-[11px] text-foreground/80 border border-border">
                              <strong>{s.emp_name}</strong>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-muted-foreground">{s.date}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

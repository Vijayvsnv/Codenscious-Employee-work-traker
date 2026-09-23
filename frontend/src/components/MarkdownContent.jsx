import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/utils";

export function MarkdownContent({ children, className, inline = false }) {
  if (!children) return null;

  if (inline) {
    return (
      <div className={cn("markdown-inline", className)}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <span>{children}</span>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-primary/40 hover:decoration-primary"
              >
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className="rounded bg-secondary/70 px-1 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            ),
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={cn("markdown-content space-y-2", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          h1: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1.5">{children}</h3>,
          h2: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5">{children}</h3>,
          h3: ({ children }) => <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-primary/40 hover:decoration-primary text-primary"
            >
              {children}
            </a>
          ),
          code: ({ inline, className, children }) => {
            if (inline) {
              return (
                <code className="rounded bg-secondary/70 px-1 py-0.5 font-mono text-[0.85em]">
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("block", className)}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="rounded-lg bg-secondary/70 p-3 overflow-x-auto text-xs font-mono border border-border my-2">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/50 pl-3 italic text-foreground/80 my-2">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border my-3" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="text-xs border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-2 py-1 bg-secondary/50 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-2 py-1">{children}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

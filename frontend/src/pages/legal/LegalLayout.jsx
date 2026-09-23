import { Link } from "react-router-dom";
import { MarketingNavbar } from "../../components/marketing/Navbar";
import { MarketingFooter } from "../../components/marketing/Footer";
import { Badge } from "../../components/ui/Badge";

export function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      <section className="py-16 border-b border-border">
        <div className="max-w-3xl mx-auto px-6">
          <Badge variant="default" className="mb-4">Legal</Badge>
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
        </div>
      </section>

      <article className="py-16">
        <div className="max-w-3xl mx-auto px-6 prose-legal">
          <div className="space-y-8">{children}</div>
        </div>
      </article>

      <div className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Questions?{" "}
          <Link to="/contact" className="text-primary hover:underline font-medium">
            Contact us
          </Link>
        </p>
      </div>

      <MarketingFooter />
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

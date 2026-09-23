import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Logo } from "../ui/Logo";
import { GithubIcon } from "../ui/BrandIcons";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              AI-powered daily standups for modern Indian teams. Built by Codenscious.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/Vijayvsnv/Codenscious-Employee-work-traker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@codenscious.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/roadmap" className="hover:text-foreground">Roadmap</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Codenscious WorkPulse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Currently in early access · Built in India
          </p>
        </div>
      </div>
    </footer>
  );
}

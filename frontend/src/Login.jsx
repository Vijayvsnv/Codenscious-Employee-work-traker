import { useState } from "react";
import { loginUser } from "./authService";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  User,
  Lock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  MessageSquare,
} from "lucide-react";

import { Button } from "./components/ui/Button";
import { Input, Label } from "./components/ui/Input";
import { Card } from "./components/ui/Card";
import { Modal } from "./components/ui/Modal";
import { Logo } from "./components/ui/Logo";
import { ThemeToggle } from "./components/ui/ThemeToggle";

const API_BASE = "http://127.0.0.1:8000";

function Login() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!empId.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const user = await loginUser(empId.trim(), password);
      toast.success(`Welcome back, ${user.name?.split(" ")[0] || ""}!`);
      navigate("/dashboard", { state: user });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminId.trim() || !adminPass.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setAdminLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, {
        admin_id: adminId.trim(),
        password: adminPass,
      });
      toast.success("Admin authenticated");
      setShowAdminModal(false);
      navigate("/admin/dashboard", { state: res.data });
    } catch {
      toast.error("Invalid Admin ID or Password");
    } finally {
      setAdminLoading(false);
    }
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminId("");
    setAdminPass("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 lg:p-6">
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdminModal(true)}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Button>
        </div>
      </div>

      {/* Left: Marketing side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-background to-accent/10 p-12 flex-col justify-between overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -left-20 h-72 w-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 h-96 w-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
              AI-powered<br />daily standups
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Automate team check-ins, track blockers, and get instant insights — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: MessageSquare, title: "Conversational AI", desc: "Natural chat-based standups" },
              { icon: BarChart3, title: "Real-time Analytics", desc: "Team mood, blockers & progress" },
              { icon: Sparkles, title: "Smart RAG Assistant", desc: "Ask anything about your team" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Codenscious WorkPulse. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md p-8 lg:p-10 border-border/60">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your employee account
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="empId">Employee ID</Label>
              <Input
                id="empId"
                icon={User}
                placeholder="e.g. EMP001"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button className="text-xs text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                icon={Lock}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleLogin}
              loading={loading}
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Admin Modal */}
      <Modal
        open={showAdminModal}
        onClose={closeAdminModal}
        title="Admin Access"
        description="Enter your admin credentials to continue"
        size="sm"
      >
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="adminId">Admin ID</Label>
            <Input
              id="adminId"
              icon={ShieldCheck}
              placeholder="e.g. ADMIN001"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPass">Password</Label>
            <Input
              id="adminPass"
              type="password"
              icon={Lock}
              placeholder="Enter admin password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={closeAdminModal}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-accent hover:bg-accent/90"
              onClick={handleAdminLogin}
              loading={adminLoading}
            >
              Login as Admin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Login;

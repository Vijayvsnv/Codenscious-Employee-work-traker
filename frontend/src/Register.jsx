import { useState, useEffect } from "react";
import { registerUser } from "./authService";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  Hash,
  ArrowRight,
  CheckCircle2,
  Gift,
} from "lucide-react";

import { Button } from "./components/ui/Button";
import { Input, Label } from "./components/ui/Input";
import { Card } from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";
import { Logo } from "./components/ui/Logo";
import { ThemeToggle } from "./components/ui/ThemeToggle";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function Register() {
  const [form, setForm] = useState({
    name: "",
    empId: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [refCode, setRefCode] = useState("");
  const [refValid, setRefValid] = useState(null); // null | true | false
  const [refOwner, setRefOwner] = useState("");
  const navigate = useNavigate();

  // Detect referral code from URL param (?ref=CODE)
  useEffect(() => {
    const code = searchParams.get("ref");
    if (code) {
      setRefCode(code.toUpperCase());
      // Validate
      axios.get(`${API_BASE}/referral/validate/${code.toUpperCase()}`)
        .then((res) => {
          if (res.data.valid) {
            setRefValid(true);
            setRefOwner(res.data.owner_name || "someone");
          } else {
            setRefValid(false);
          }
        })
        .catch(() => setRefValid(false));
    }
  }, [searchParams]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegister = async () => {
    const { name, empId, phone, email, password, confirm } = form;

    if (!name || !empId || !phone || !email || !password || !confirm) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(
        name.trim(),
        empId.trim(),
        phone.trim(),
        email.trim(),
        password
      );

      // Apply referral code if valid
      if (refCode && refValid) {
        try {
          await axios.post(`${API_BASE}/referral/use`, {
            referral_code: refCode,
            new_emp_id: empId.trim(),
            new_email: email.trim(),
            new_name: name.trim(),
          });
          toast.success(`Signed up with ${refOwner}'s referral!`);
        } catch {
          // Silent failure — user still gets account
        }
      }

      toast.success("Account created successfully!");
      navigate("/dashboard", { state: user });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Vijay Sharma", type: "text", icon: User },
    { key: "empId", label: "Employee ID", placeholder: "EMP001", type: "text", icon: Hash },
    { key: "phone", label: "Phone Number", placeholder: "9876543210", type: "tel", icon: Phone },
    { key: "email", label: "Email Address", placeholder: "vijay@company.com", type: "email", icon: Mail },
    { key: "password", label: "Password", placeholder: "Min. 6 characters", type: "password", icon: Lock },
    { key: "confirm", label: "Confirm Password", placeholder: "Re-enter password", type: "password", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-8 relative">
      {/* Top-right theme toggle */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
        <ThemeToggle />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg p-8 lg:p-10 border-border/60 relative animate-fade-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="md" className="mb-6" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register as a new employee to get started
          </p>
        </div>

        {refValid === true && (
          <div className="mb-4 p-3 rounded-lg border border-warning/30 bg-warning/5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Invited by {refOwner}
              </p>
              <p className="text-xs text-muted-foreground">
                Using code <Badge variant="warning" className="ml-1 text-[10px] font-mono">{refCode}</Badge>
              </p>
            </div>
          </div>
        )}
        {refValid === false && (
          <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-xs text-destructive">
            Invalid referral code — you can still sign up without one.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, placeholder, type, icon }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type}
                icon={icon}
                placeholder={placeholder}
                value={form[key]}
                onChange={handleChange(key)}
              />
            </div>
          ))}
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="w-full mt-6"
          onClick={handleRegister}
          loading={loading}
        >
          Create Account
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span>Your data is encrypted and secure</span>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;

import { Routes, Route } from "react-router-dom";
import { ShortcutsProvider } from "./components/ShortcutsProvider";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Roadmap from "./pages/Roadmap";
import Demo from "./pages/Demo";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeAnalytics from "./pages/EmployeeAnalytics";
import Referrals from "./pages/Referrals";

function App() {
  return (
    <>
      <ShortcutsProvider />
      <Routes>
      {/* Marketing */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Product */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/my-analytics" element={<EmployeeAnalytics />} />
      <Route path="/referrals" element={<Referrals />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;

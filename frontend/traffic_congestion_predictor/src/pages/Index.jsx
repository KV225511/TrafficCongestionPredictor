import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Radio,
  MapPin,
  Target,
  ArrowRight,
  Clock,
  Route,
  CheckCircle2,
  Timer,
  Smile,
  CalendarCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  { icon: Brain, title: "AI-Powered Predictions", desc: "Machine learning models trained on real Delhi traffic data for accurate forecasting." },
  { icon: Radio, title: "Real-Time Data", desc: "Live traffic speed and weather conditions integrated into every prediction." },
  { icon: MapPin, title: "Delhi Coverage", desc: "Comprehensive coverage of routes across Delhi NCR." },
  { icon: Target, title: "Accurate Forecasts", desc: "High-confidence predictions with transparent confidence scores." },
];

const steps = [
  { icon: MapPin, label: "Enter Locations", desc: "Type your start and destination" },
  { icon: Clock, label: "Select Time", desc: "Choose your departure date & time" },
  { icon: Route, label: "Get Prediction", desc: "Receive AI-powered traffic forecast" },
  { icon: CheckCircle2, label: "Plan Route", desc: "Make informed travel decisions" },
];

const benefits = [
  { icon: Timer, title: "Save Time", desc: "Avoid peak congestion by planning smarter departures." },
  { icon: Smile, title: "Reduce Stress", desc: "Know what to expect before you hit the road." },
  { icon: CalendarCheck, title: "Plan Better", desc: "Schedule meetings and commutes with confidence." },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Route className="h-6 w-6" />
            TrafficSense
          </Link>
          <nav className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild><Link to="/main">Dashboard</Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
                <Button asChild><Link to="/register">Register</Link></Button>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <Button asChild className="w-full"><Link to="/main">Dashboard</Link></Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full"><Link to="/login">Login</Link></Button>
                  <Button asChild className="w-full"><Link to="/register">Register</Link></Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-traffic-low/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center md:py-36">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Predict Traffic Congestion
            <br />
            <span className="text-primary">Before You Leave</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered traffic predictions for Delhi routes. Enter your start and end locations, pick a departure time, and get instant congestion forecasts with confidence scores.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to={isAuthenticated ? "/main" : "/register"}>
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-foreground">Why TrafficSense?</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Powered by machine learning and real-time data to keep your commute smooth.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <f.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-foreground">How It Works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Step {i + 1}</span>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{s.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-foreground">Benefits</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                <b.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-card-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span>&copy; {new Date().getFullYear()} TrafficSense. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-foreground">Login</Link>
            <Link to="/register" className="hover:text-foreground">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

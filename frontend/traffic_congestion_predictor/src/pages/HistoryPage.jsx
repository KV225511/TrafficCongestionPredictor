import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Route, MapPin, Navigation, ChevronDown, History, Trash2, LogOut, Loader2, Gauge, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const trafficColors = {
  Low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  High: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  "Very High": "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
};

const HistoryPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getHistory();
        // Backend returns a list of { "TrafficLevel": ["start", "end"] }; handle non-array (e.g. default {})
        const list = Array.isArray(data) ? data : [];
        setHistory([...list].reverse()); // newest first, avoid mutating original
      } catch (err) {
        console.error("Failed to load history", err);
        setError(err?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteAccount();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      toast({ title: "Account deleted" });
      window.location.href = "/";
    } catch (e) {
      toast({ title: "Could not delete account", description: e?.message, variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Route className="h-6 w-6" /> TrafficSense
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    Welcome, <span className="font-medium text-foreground">{user?.username}</span>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/main" className="flex cursor-pointer items-center gap-2">
                    <Gauge className="h-4 w-4" /> Prediction
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/history" className="flex cursor-pointer items-center gap-2">
                    <History className="h-4 w-4" /> History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex cursor-pointer items-center gap-2">
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                      </>
                    ) : (
                      "Yes, delete my account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
            {/* Page title */}
            <header className="mb-8 sm:mb-10 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                <History className="h-7 w-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Prediction History
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Your recent traffic predictions in one place
              </p>
            </header>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading your routes…</p>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="rounded-full bg-destructive/10 p-3 mb-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h2 className="font-semibold text-foreground">Couldn’t load history</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </Button>
                </CardContent>
              </Card>
            ) : history.length === 0 ? (
              <Card className="border-dashed bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h2 className="font-semibold text-foreground">No predictions yet</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    Make a prediction on the main page and it will show up here.
                  </p>
                  <Button asChild className="mt-6" size="lg">
                    <Link to="/main" className="gap-2">
                      <Gauge className="h-4 w-4" /> Make a prediction
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 animate-in fade-in-0 duration-500">
                {history.map((item, index) => {
                  const level = Object.keys(item)[0];
                  const route = item[level];
                  if (!level || !Array.isArray(route) || route.length < 2) return null;
                  const [start, end] = route;
                  const isLatest = index === 0;

                  return (
                    <Card
                      key={index}
                      className={cn(
                        "overflow-hidden border bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20",
                        isLatest && "ring-2 ring-primary/20"
                      )}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row sm:items-stretch">
                          {/* Traffic badge + route */}
                          <div className="flex-1 p-4 sm:p-5 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "font-medium border",
                                  trafficColors[level] || "bg-muted text-muted-foreground"
                                )}
                              >
                                {level}
                              </Badge>
                              {isLatest && (
                                <Badge variant="secondary" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <div className="flex shrink-0 items-start justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                                  <MapPin className="h-4 w-4 mt-1.5" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">From</p>
                                  <p className="text-sm font-medium text-foreground break-words">{start}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pl-2">
                                <div className="flex flex-col items-center">
                                  <div className="w-px min-h-[0.5rem] bg-border" />
                                  <Navigation className="h-3.5 w-3.5 text-muted-foreground rotate-[-90deg] shrink-0" />
                                  <div className="w-px min-h-[0.5rem] bg-border" />
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <div className="flex shrink-0 items-start justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                                  <Navigation className="h-4 w-4 mt-1.5" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">To</p>
                                  <p className="text-sm font-medium text-foreground break-words">{end}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && !error && history.length > 0 && (
              <div className="mt-8 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link to="/main" className="gap-2">
                    <Gauge className="h-4 w-4" /> Predict again
                  </Link>
                </Button>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;

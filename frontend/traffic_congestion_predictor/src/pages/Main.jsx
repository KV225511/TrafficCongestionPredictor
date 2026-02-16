import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import {
  Route,
  Loader2,
  CalendarIcon,
  MapPin,
  Navigation,
  Gauge,
  Wind,
  Ruler,
  Signpost,
  RotateCcw,
  ChevronDown,
  History,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  OctagonAlert
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const predictionSchema = z.object({
  start: z.string().min(1, "Start location is required"),
  end: z.string().min(1, "End location is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
});

const trafficColors = {
  Low: "bg-traffic-low text-traffic-low-foreground",
  Medium: "bg-traffic-medium text-traffic-medium-foreground",
  High: "bg-traffic-high text-traffic-high-foreground",
};

const DELHI_LOCATIONS =[
  { value: "AIIMS, New Delhi, Delhi, India", label: "AIIMS" },
  { value: "All India Institute of Medical Sciences, Ansari Nagar, New Delhi, Delhi 110029, India", label: "AIIMS - AIIMS Hospital" },
  { value: "AIIMS Metro Station, New Delhi, Delhi 110029, India", label: "AIIMS - Metro Station" },

  { value: "Chandni Chowk, Delhi, India", label: "Chandni Chowk" },
  { value: "Red Fort, Netaji Subhash Marg, Delhi 110006, India", label: "Chandni Chowk - Red Fort" },
  { value: "Jama Masjid, Chandni Chowk, Delhi 110006, India", label: "Chandni Chowk - Jama Masjid" },

  { value: "Civil Lines, Delhi, India", label: "Civil Lines" },
  { value: "Civil Lines Metro Station, Delhi 110054, India", label: "Civil Lines - Metro Station" },

  { value: "Connaught Place, New Delhi, Delhi, India", label: "Connaught Place" },
  { value: "Rajiv Chowk Metro Station, Connaught Place, New Delhi 110001, India", label: "Connaught Place - Rajiv Chowk Metro" },
  { value: "Palika Bazaar, Connaught Place, New Delhi 110001, India", label: "Connaught Place - Palika Bazaar" },

  { value: "Dwarka, New Delhi, Delhi, India", label: "Dwarka" },
  { value: "Dwarka Sector 21 Metro Station, New Delhi 110075, India", label: "Dwarka - Sector 21 Metro" },
  { value: "Vegas Mall, Dwarka, New Delhi 110075, India", label: "Dwarka - Vegas Mall" },

  { value: "Greater Kailash, New Delhi, Delhi, India", label: "Greater Kailash" },
  { value: "M Block Market, Greater Kailash I, New Delhi 110048, India", label: "Greater Kailash - M Block Market" },

  { value: "Hauz Khas, New Delhi, Delhi, India", label: "Hauz Khas" },
  { value: "Hauz Khas Village, New Delhi 110016, India", label: "Hauz Khas - Village" },
  { value: "IIT Delhi, Hauz Khas, New Delhi 110016, India", label: "Hauz Khas - IIT Delhi" },

  { value: "Indira Gandhi International Airport, New Delhi, Delhi, India", label: "IGI Airport" },
  { value: "Terminal 3, IGI Airport, New Delhi 110037, India", label: "IGI Airport - Terminal 3" },
  { value: "Aerocity Metro Station, New Delhi 110037, India", label: "IGI Airport - Aerocity Metro" },

  { value: "Janakpuri, New Delhi, Delhi, India", label: "Janakpuri" },
  { value: "Janakpuri West Metro Station, New Delhi 110058, India", label: "Janakpuri - West Metro" },

  { value: "Kalkaji, New Delhi, Delhi, India", label: "Kalkaji" },
  { value: "Kalkaji Mandir Metro Station, New Delhi 110019, India", label: "Kalkaji - Metro Station" },

  { value: "Karol Bagh, New Delhi, Delhi, India", label: "Karol Bagh" },
  { value: "Karol Bagh Metro Station, New Delhi 110005, India", label: "Karol Bagh - Metro Station" },
  { value: "Gaffar Market, Karol Bagh, New Delhi 110005, India", label: "Karol Bagh - Gaffar Market" },

  { value: "Lajpat Nagar, New Delhi, Delhi, India", label: "Lajpat Nagar" },
  { value: "Central Market, Lajpat Nagar II, New Delhi 110024, India", label: "Lajpat Nagar - Central Market" },

  { value: "Mayur Vihar, Delhi, India", label: "Mayur Vihar" },
  { value: "Mayur Vihar Phase 1 Metro Station, Delhi 110091, India", label: "Mayur Vihar - Metro Station" },

  { value: "Model Town, Delhi, India", label: "Model Town" },
  { value: "Model Town Metro Station, Delhi 110009, India", label: "Model Town - Metro Station" },

  { value: "Nehru Place, New Delhi, Delhi, India", label: "Nehru Place" },
  { value: "Nehru Place Metro Station, New Delhi 110019, India", label: "Nehru Place - Metro Station" },

  { value: "Noida Sector 18, Noida, Uttar Pradesh, India", label: "Noida Sector 18" },
  { value: "DLF Mall of India, Sector 18, Noida 201301, India", label: "Noida Sector 18 - DLF Mall" },

  { value: "Okhla, New Delhi, Delhi, India", label: "Okhla" },
  { value: "Okhla Industrial Area Phase I, New Delhi 110020, India", label: "Okhla - Industrial Area" },

  { value: "Pitampura, Delhi, India", label: "Pitampura" },
  { value: "Netaji Subhash Place, Pitampura, Delhi 110034, India", label: "Pitampura - NSP" },

  { value: "Preet Vihar, Delhi, India", label: "Preet Vihar" },
  { value: "Preet Vihar Metro Station, Delhi 110092, India", label: "Preet Vihar - Metro Station" },

  { value: "Punjabi Bagh, New Delhi, Delhi, India", label: "Punjabi Bagh" },
  { value: "Pacific Mall, Punjabi Bagh, New Delhi 110026, India", label: "Punjabi Bagh - Pacific Mall" },

  { value: "Rajouri Garden, New Delhi, Delhi, India", label: "Rajouri Garden" },
  { value: "Pacific Mall, Rajouri Garden, New Delhi 110027, India", label: "Rajouri Garden - Pacific Mall" },

  { value: "Rohini, Delhi, India", label: "Rohini" },
  { value: "Rithala Metro Station, Rohini, Delhi 110085, India", label: "Rohini - Rithala Metro" },

  { value: "Saket, New Delhi, Delhi, India", label: "Saket" },
  { value: "Select Citywalk Mall, Saket, New Delhi 110017, India", label: "Saket - Select Citywalk" },

  { value: "Shahdara, Delhi, India", label: "Shahdara" },
  { value: "Shahdara Metro Station, Delhi 110032, India", label: "Shahdara - Metro Station" },

  { value: "Vasant Kunj, New Delhi, Delhi, India", label: "Vasant Kunj" },
  { value: "DLF Promenade, Vasant Kunj, New Delhi 110070, India", label: "Vasant Kunj - DLF Promenade" },
];


const MainPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const now = new Date();
  const form = useForm({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      start: "",
      end: "",
      date: now,
      time: format(now, "HH:mm"),
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setResult(null);
    try {
      const dt = new Date(values.date);
      const [h, m] = values.time.split(":").map(Number);
      dt.setHours(h, m, 0, 0);

      // Compare at minute granularity (form only has hours:minutes, no seconds)
      const nowTruncated = new Date();
      nowTruncated.setSeconds(0, 0);
      if (dt.getTime() < nowTruncated.getTime()) {
        toast({ title: "Invalid time", description: "Departure time cannot be in the past.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const depart_at = format(dt, "yyyy-MM-dd'T'HH:mm:ss");
      const data = await api.predict(values.start, values.end, depart_at);
      setResult(data);
    } catch (e) {
      toast({ title: "Prediction failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    form.reset({ start: "", end: "", date: new Date(), time: format(new Date(), "HH:mm") });
  };

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
    <div className="min-h-screen bg-background">
      {/* Nav */}
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

      <main className="mx-auto max-w-5xl px-4 py-10 overflow-hidden">
        {!result ? (
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle className="text-center text-xl">Predict Traffic Congestion</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="pl-9">
                                <SelectValue placeholder="Select a start location" />
                              </SelectTrigger>
                              <SelectContent>
                                {DELHI_LOCATIONS.map((loc) => (
                                  <SelectItem key={loc.value} value={loc.value}>
                                    {loc.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="pl-9">
                                <SelectValue placeholder="Select an end location" />
                              </SelectTrigger>
                              <SelectContent>
                                {DELHI_LOCATIONS.map((loc) => (
                                  <SelectItem key={loc.value} value={loc.value}>
                                    {loc.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Departure Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Pick date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="time" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Predict Traffic
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Traffic Level */}
            <Card className={cn("mx-auto max-w-md overflow-hidden", trafficColors[result.predicted_traffic_level])}>
              <CardContent className="flex flex-col items-center py-6">
                <p className="text-sm font-medium uppercase tracking-wider opacity-80">Traffic Level</p>
                <h2 className="mt-2 text-5xl font-extrabold">{result.predicted_traffic_level}</h2>
                <div className="mt-4 flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  <span className="text-xl font-semibold">{result.confidence}% Confidence</span>
                </div>
              </CardContent>
            </Card>

            {/* Route Details */}
            <Card className="mx-auto max-w-md">
              <CardHeader><CardTitle className="text-lg">Route Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Detail icon={CheckCircle} label="Low" value={result.input_data.Low ?? 0} />
                <Detail icon={AlertCircle} label="Medium" value={result.input_data.Medium ?? 0} />
                <Detail icon={AlertTriangle} label="High" value={result.input_data.High ?? 0} />
                <Detail icon={OctagonAlert} label="Very High" value={result.input_data["Very High"] ?? 0} />
                <Detail icon={Navigation} label="Start" value={result.input_data.start} />
                <Detail icon={Navigation} label="End" value={result.input_data.end} />
                <Detail
                  icon={CalendarIcon}
                  label="Departure (IST)"
                  value={
                    result.input_data.depart_at && result.input_data.depart_at !== "current"
                      ? (() => {
                          const d = new Date(result.input_data.depart_at);
                          // Adjust by -5:30 so displayed time matches IST (backend may send UTC)
                          d.setMinutes(d.getMinutes() - (5 * 60 + 30));
                          return new Intl.DateTimeFormat("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }).format(d);
                        })()
                      : "Current time (IST)"
                  }
                />


                <Detail icon={Ruler} label="Distance" value={`${result.input_data.distance_km} km`} />
                <Detail icon={Gauge} label="Est. Speed" value={`${result.input_data.avg_speed} km/h`} />
                <Detail icon={Signpost} label="Road Type" value={result.input_data.road_type} />
                <Detail icon={Wind} label="Weather" value={result.input_data.weather_type} />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={reset} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-4 w-4" /> Predict Again
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    <div>
      <span className="font-medium text-foreground">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  </div>
);

export default MainPage;

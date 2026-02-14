import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";

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

const MainPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

      if (dt < new Date()) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Route className="h-6 w-6" /> TrafficSense
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Welcome, <span className="font-medium text-foreground">{user?.username}</span>
            </span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {!result ? (
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle className="text-center text-xl">Predict Traffic Congestion</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="start" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-9" placeholder="e.g. rameshwar building uttam nagar" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="end" render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-9" placeholder="e.g. shanti nursing home uttam nagar" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

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
              <CardContent className="flex flex-col items-center py-10">
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
                <Detail icon={MapPin} label="Start" value={result.input_data.start} />
                <Detail icon={Navigation} label="End" value={result.input_data.end} />
                <Detail icon={CalendarIcon} label="Departure" value={result.input_data.depart_at} />
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

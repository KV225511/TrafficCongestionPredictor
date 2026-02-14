import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Route, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";

const registerSchema = z
  .object({
    username: z.string().min(1, "Required").regex(/^[a-zA-Z0-9]+$/, "Alphanumeric only"),
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((v) => v, "You must accept the terms"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const getPasswordStrength = (pw) => {
  let s = 0;
  if (pw.length >= 6) s += 25;
  if (pw.length >= 10) s += 25;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s += 25;
  if (/[0-9!@#$%^&*]/.test(pw)) s += 25;
  return s;
};

const RegisterPage = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const watchedPw = form.watch("password");
  const strength = getPasswordStrength(watchedPw || "");

  if (isAuthenticated) return <Navigate to="/main" replace />;

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      await registerUser(values.username, values.email, values.password);
    } catch (e) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="fixed right-4 top-4"><ThemeToggle /></div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-2 flex items-center gap-2 text-xl font-bold text-primary">
            <Route className="h-6 w-6" /> TrafficSense
          </Link>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Sign up to start predicting traffic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
              )}
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="Username (alphanumeric)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" {...field} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  {watchedPw && (
                    <div className="space-y-1">
                      <Progress value={strength} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Strength: {strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"}
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl><Input type="password" placeholder="Re-enter password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="terms" render={({ field }) => (
                <FormItem className="flex items-start gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm font-normal leading-snug">
                    I agree to the Terms & Conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;

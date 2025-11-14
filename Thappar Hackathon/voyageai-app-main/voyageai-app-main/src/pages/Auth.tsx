import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

/**
 * Auth Page - Login & Signup
 * 
 * WHAT IT DOES:
 * - Provides authentication interface for users to login or create accounts
 * - Tabbed interface switches between login and signup forms
 * - Form validation and error handling
 * 
 * HOW IT WORKS:
 * - Local state manages form inputs (email, password, name)
 * - Form submission validates inputs and displays feedback via toasts
 * - On success, redirects to dashboard
 * 
 * BACKEND INTEGRATION (when Cloud enabled):
 * - Login: POST /auth/login with credentials → JWT token → store in localStorage
 * - Signup: POST /auth/signup → create user record → auto-login
 * - Password hashing on backend (bcrypt)
 * - Email verification optional
 */

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location?.state?.from?.pathname || "/feed";
  const { toast } = useToast();
  const { login, signup } = useAuth();
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      await login(loginEmail, loginPassword);
      toast({ title: "Welcome back!", description: "Successfully logged in" });
      navigate(redirectTo);
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupEmail || !signupPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    try {
      await signup(signupName, signupEmail, signupPassword, { interests: [] });
      toast({ title: "Account created!", description: "Welcome to TripAI" });
      navigate("/feed");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md p-8 animate-scale-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 rounded-lg gradient-hero">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold">TripAI</span>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-hero text-white">
                Log In
              </Button>
            </form>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-hero text-white">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition-smooth"
          >
            Back to home
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;

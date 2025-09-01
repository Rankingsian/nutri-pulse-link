import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Shield, Users, Activity, Stethoscope, Pill, MessageCircle, Loader2 } from "lucide-react";
import heroImage from "@/assets/healthcare-hero.jpg";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
  role: z.enum(["patient", "nurse"]),
  age: z.number().min(1, "Age must be at least 1").max(150, "Age must be less than 150"),
  gender: z.enum(["male", "female", "other"]),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
  medical_history: z.string().optional(),
  nutrition_needs: z.string().optional(),
}).refine((data) => {
  if (data.role === "nurse") {
    return data.specialization && data.specialization.length > 0 && data.hospital && data.hospital.length > 0;
  }
  return true;
}, {
  message: "Specialization and hospital are required for nurses",
  path: ["specialization"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const LandingPage = () => {
  const [loginType, setLoginType] = useState<"nurse" | "patient" | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "patient",
      age: 25,
      gender: "male",
      specialization: "",
      hospital: "",
      medical_history: "",
      nutrition_needs: "",
    },
    mode: "onChange"
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();

  const features = [
    {
      icon: Stethoscope,
      title: "Professional Care",
      description: "Connect with licensed healthcare professionals"
    },
    {
      icon: Pill,
      title: "Medication Tracking",
      description: "Never miss a dose with smart reminders"
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track vitals and symptoms in real-time"
    },
    {
      icon: MessageCircle,
      title: "Secure Communication",
      description: "HIPAA-compliant messaging with your care team"
    }
  ];

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      toast({
        title: "Success",
        description: "Login successful!",
      });
      navigate(loginType === "nurse" ? "/nurse-dashboard" : "/patient-dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        age: data.age,
        gender: data.gender,
        specialization: data.specialization,
        hospital: data.hospital,
        medical_history: data.medical_history,
        nutrition_needs: data.nutrition_needs,
      };
      await register(registerData);
      toast({
        title: "Success",
        description: "Registration successful!",
      });
      setIsRegisterOpen(false);
      setLoginType(data.role);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const LoginForm = ({ type }: { type: "nurse" | "patient" }) => (
    <Card className="w-full max-w-md mx-auto shadow-xl bg-gradient-to-br from-card to-muted/30 border-0">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
          {type === "nurse" ? (
            <Stethoscope className="w-8 h-8 text-white" />
          ) : (
            <Heart className="w-8 h-8 text-white" />
          )}
        </div>
        <CardTitle className="text-2xl text-foreground">
          {type === "nurse" ? "Nurse Portal" : "Patient Portal"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {type === "nurse" 
            ? "Access your professional dashboard"
            : "Manage your health journey"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLogin)} onReset={(e) => e.preventDefault()} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email"
                      className="border-border/50 focus:border-primary transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password"
                      className="border-border/50 focus:border-primary transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="w-full" 
              variant={type === "nurse" ? "nurse" : "healthcare"}
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <Button 
            variant="link" 
            className="text-sm text-muted-foreground"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RegisterForm = () => (
    <Card className="w-full max-w-md mx-auto shadow-xl bg-gradient-to-br from-card to-muted/30 border-0">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
          <Users className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-foreground">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Join our healthcare community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onRegister)} onReset={(e) => e.preventDefault()} className="space-y-4">
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe"
                      className="border-border/50 focus:border-primary transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@example.com"
                      className="border-border/50 focus:border-primary transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Create a secure password"
                      className="border-border/50 focus:border-primary transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={registerForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="25"
                        className="border-border/50 focus:border-primary transition-colors"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={registerForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {registerForm.watch("role") === "nurse" && (
              <>
                <FormField
                  control={registerForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Nutrition and Dietetics"
                          className="border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., City General Hospital"
                          className="border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {registerForm.watch("role") === "patient" && (
              <>
                <FormField
                  control={registerForm.control}
                  name="medical_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Any relevant medical history"
                          className="border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="nutrition_needs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nutrition Needs (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Any dietary requirements"
                          className="border-border/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button 
              type="submit"
              className="w-full" 
              variant="healthcare" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  if (loginType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setLoginType(null)}
              className="mb-4"
            >
              ← Back to Home
            </Button>
          </div>
          <LoginForm type={loginType} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">NutriPulse</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Caring for Your Health,
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Together</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect patients and nurses through intelligent care coordination, medication management, and real-time health monitoring.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="nurse" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setLoginType("nurse")}
              >
                <Stethoscope className="w-5 h-5" />
                Nurse Portal
              </Button>
              <Button 
                variant="patient" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setLoginType("patient")}
              >
                <Heart className="w-5 h-5" />
                Patient Portal
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/nurse-registration" className="flex-1">
                <Button 
                  variant="link" 
                  className="text-secondary text-lg w-full"
                >
                  New nurse? Register here →
                </Button>
              </Link>
            </div>

            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-primary text-lg">
                  New patient? Register here →
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Patient Registration</DialogTitle>
                  <DialogDescription>
                    Create your account to start your health journey
                  </DialogDescription>
                </DialogHeader>
                <RegisterForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={heroImage} 
                alt="Healthcare professional using digital technology with patient"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-secondary to-secondary-glow rounded-2xl flex items-center justify-center shadow-xl">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Comprehensive Healthcare Management
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for effective patient care and health management in one secure platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-muted/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 NutriPulse. Secure healthcare technology you can trust.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
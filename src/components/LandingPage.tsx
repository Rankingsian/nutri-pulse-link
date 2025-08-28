import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Shield, Users, Activity, Stethoscope, Pill, MessageCircle } from "lucide-react";
import heroImage from "@/assets/healthcare-hero.jpg";

const LandingPage = () => {
  const [loginType, setLoginType] = useState<"nurse" | "patient" | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email"
            className="border-border/50 focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            className="border-border/50 focus:border-primary transition-colors"
          />
        </div>
        <Button 
          className="w-full" 
          variant={type === "nurse" ? "nurse" : "healthcare"}
          size="lg"
          onClick={() => window.location.href = type === "nurse" ? "/nurse-dashboard" : "/patient-dashboard"}
        >
          Sign In
        </Button>
        <div className="text-center">
          <Button variant="link" className="text-sm text-muted-foreground">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="John"
              className="border-border/50 focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="Doe"
              className="border-border/50 focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerEmail">Email</Label>
          <Input 
            id="registerEmail" 
            type="email" 
            placeholder="john.doe@example.com"
            className="border-border/50 focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registerPassword">Password</Label>
          <Input 
            id="registerPassword" 
            type="password" 
            placeholder="Create a secure password"
            className="border-border/50 focus:border-primary transition-colors"
          />
        </div>
        <Button className="w-full" variant="secondary" size="lg">
          Create Account
        </Button>
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
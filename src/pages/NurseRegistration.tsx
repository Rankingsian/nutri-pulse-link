import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NurseRegistration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "female" as "male" | "female" | "other",
    specialization: "",
    hospital: "",
    yearsExperience: "",
    licenseNumber: "",
    phone: "",
    department: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  const specializations = [
    "General Nursing",
    "Emergency Medicine",
    "Intensive Care Unit (ICU)",
    "Pediatrics",
    "Oncology",
    "Cardiology",
    "Neurology",
    "Surgery",
    "Mental Health",
    "Geriatrics",
    "Maternity/Labor & Delivery",
    "Anesthesia",
    "Nutrition and Dietetics",
    "Other"
  ];

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof typeof form) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.password || !form.age || !form.specialization || !form.hospital) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (form.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "nurse" as const,
        age: parseInt(form.age),
        gender: form.gender,
        specialization: form.specialization,
        hospital: form.hospital,
        years_experience: form.yearsExperience ? parseInt(form.yearsExperience) : undefined,
        license_number: form.licenseNumber,
        phone: form.phone,
        department: form.department
      };

      await register(registerData);
      
      toast({
        title: "Registration Successful!",
        description: "Your nurse account has been created. You can now log in.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <Card className="shadow-xl bg-gradient-to-br from-card to-muted/30 border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-foreground">Join Our Nursing Team</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Create your professional account to start providing exceptional care
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange('name')}
                    className="border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={form.age}
                    onChange={handleChange('age')}
                    className="border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@hospital.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={form.gender} onValueChange={handleSelectChange('gender')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={handleChange('password')}
                    className="border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    className="border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select value={form.specialization} onValueChange={handleSelectChange('specialization')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Facility *</Label>
                  <Input
                    id="hospital"
                    placeholder="City General Hospital"
                    value={form.hospital}
                    onChange={handleChange('hospital')}
                    className="border-border/50 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Emergency Department"
                    value={form.department}
                    onChange={handleChange('department')}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    placeholder="5"
                    value={form.yearsExperience}
                    onChange={handleChange('yearsExperience')}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="RN123456"
                    value={form.licenseNumber}
                    onChange={handleChange('licenseNumber')}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="border-border/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="nurse"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-5 h-5 mr-2" />
                      Create Nurse Account
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="text-center mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseRegistration;
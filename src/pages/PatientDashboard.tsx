import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, HealthRecord, NutritionPlan } from "@/lib/api";
import { 
  Heart, 
  Pill, 
  Utensils, 
  Activity, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Home,
  TrendingUp,
  Calendar,
  LogOut,
  Loader2,
  Bot
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const { toast } = useToast();
  const { user, patientData, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [medications, setMedications] = useState([
    { id: 1, name: "Metformin", dosage: "500mg", time: "8:00 AM", taken: false, urgent: false },
    { id: 2, name: "Lisinopril", dosage: "10mg", time: "8:00 AM", taken: true, urgent: false },
    { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM", taken: false, urgent: true },
    { id: 4, name: "Aspirin", dosage: "81mg", time: "8:00 PM", taken: false, urgent: false },
  ]);

  const [mealData, setMealData] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: ""
  });

  const [vitals, setVitals] = useState({
    bloodPressure: "",
    bloodSugar: "",
    temperature: "",
    weight: "",
    notes: ""
  });

  const notifications = [
    { id: 1, type: "medication", message: "Atorvastatin due in 30 minutes", urgent: true },
    { id: 2, type: "appointment", message: "Nurse check-in scheduled for 2:00 PM", urgent: false },
    { id: 3, type: "message", message: "New message from Nurse Johnson", urgent: false },
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientData) return;
      
      try {
        setIsLoading(true);
        const [recordsResponse, plansResponse] = await Promise.all([
          api.getPatientRecords(patientData.id),
          api.getNutritionPlans(patientData.id)
        ]);
        
        setHealthRecords(recordsResponse.records);
        setNutritionPlans(plansResponse.plans);
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
        toast({
          title: "Error",
          description: "Failed to load your health data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientData, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const toggleMedication = (id: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
    toast({
      title: "Medication Updated",
      description: "Your medication status has been recorded.",
    });
  };

  const handleMealSubmit = () => {
    toast({
      title: "Meal Logged Successfully",
      description: "Your nutrition data has been saved.",
    });
    setMealData({ breakfast: "", lunch: "", dinner: "", snacks: "" });
  };

  const handleVitalsSubmit = () => {
    toast({
      title: "Vitals Recorded",
      description: "Your health data has been saved and shared with your care team.",
    });
    setVitals({ bloodPressure: "", bloodSugar: "", temperature: "", weight: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Patient Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/ai-assistant">
              <Button variant="default" size="sm">
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4" />
                Chat with Nurse
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{user?.name || 'Patient'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading your health data...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medication Reminders */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Today's Medications</CardTitle>
                    <CardDescription>Track your daily medication schedule</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={med.taken}
                        onCheckedChange={() => toggleMedication(med.id)}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${med.taken ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {med.name}
                          </span>
                          {med.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {med.dosage} • {med.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {med.taken ? (
                        <CheckCircle className="w-5 h-5 text-secondary" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meal Logging */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Meal Logging</CardTitle>
                    <CardDescription>Record your daily nutrition intake</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breakfast">Breakfast</Label>
                    <Select value={mealData.breakfast} onValueChange={(value) => setMealData(prev => ({ ...prev, breakfast: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select breakfast" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oatmeal">Oatmeal with berries</SelectItem>
                        <SelectItem value="eggs">Scrambled eggs & toast</SelectItem>
                        <SelectItem value="yogurt">Greek yogurt & granola</SelectItem>
                        <SelectItem value="cereal">Whole grain cereal</SelectItem>
                        <SelectItem value="smoothie">Protein smoothie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lunch">Lunch</Label>
                    <Select value={mealData.lunch} onValueChange={(value) => setMealData(prev => ({ ...prev, lunch: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lunch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salad">Garden salad</SelectItem>
                        <SelectItem value="sandwich">Turkey sandwich</SelectItem>
                        <SelectItem value="soup">Vegetable soup</SelectItem>
                        <SelectItem value="rice">Rice bowl</SelectItem>
                        <SelectItem value="pasta">Whole grain pasta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dinner">Dinner</Label>
                    <Select value={mealData.dinner} onValueChange={(value) => setMealData(prev => ({ ...prev, dinner: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dinner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chicken">Grilled chicken & vegetables</SelectItem>
                        <SelectItem value="fish">Baked salmon</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian stir-fry</SelectItem>
                        <SelectItem value="lean-meat">Lean beef & sweet potato</SelectItem>
                        <SelectItem value="tofu">Tofu curry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="snacks">Snacks</Label>
                    <Select value={mealData.snacks} onValueChange={(value) => setMealData(prev => ({ ...prev, snacks: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select snacks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nuts">Mixed nuts</SelectItem>
                        <SelectItem value="fruit">Fresh fruit</SelectItem>
                        <SelectItem value="vegetables">Raw vegetables</SelectItem>
                        <SelectItem value="crackers">Whole grain crackers</SelectItem>
                        <SelectItem value="none">No snacks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleMealSubmit} className="w-full" variant="secondary">
                  <Utensils className="w-4 h-4" />
                  Log Meals
                </Button>
              </CardContent>
            </Card>

            {/* Latest Vitals (Read-only) */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Latest Health Records</CardTitle>
                    <CardDescription>Your most recent health records from your nurse</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthRecords.length > 0 ? (
                  healthRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-foreground">
                          Checkup Notes
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-foreground mb-2">
                        {record.checkup_notes}
                      </div>
                      {record.prescriptions && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Prescriptions:</strong> {record.prescriptions}
                        </div>
                      )}
                      {record.nurse && (
                        <div className="text-xs text-muted-foreground mt-2">
                          By: {record.nurse.user?.name || 'Nurse'}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No health records available yet.</p>
                    <p className="text-sm">Your nurse will add records after checkups.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nutrition Plans */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Nutrition Plans</CardTitle>
                    <CardDescription>Your personalized nutrition recommendations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {nutritionPlans.length > 0 ? (
                  nutritionPlans.slice(0, 2).map((plan) => (
                    <div key={plan.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-foreground">
                          Diet Plan
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(plan.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-foreground">
                        {plan.diet_plan}
                      </div>
                      {plan.nurse && (
                        <div className="text-xs text-muted-foreground mt-2">
                          By: {plan.nurse.user?.name || 'Nurse'}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No nutrition plans available yet.</p>
                    <p className="text-sm">Your nurse will create personalized plans for you.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Medications</span>
                  <span className="font-medium">2/4 taken</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meals logged</span>
                  <span className="font-medium">1/3 meals</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last vitals</span>
                  <span className="font-medium">Yesterday</span>
                </div>
                <Separator />
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary font-medium">Health trend: Improving</span>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.urgent ? 'bg-destructive' : 'bg-primary'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.urgent ? 'Urgent' : 'Info'}
                      </p>
                    </div>
                    {notification.urgent && <AlertCircle className="w-4 h-4 text-destructive" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-lg">Upcoming</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Nurse Check-in</p>
                    <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Doctor Appointment</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { toast } = useToast();
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
            <Link to="/chat">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4" />
                Chat with Nurse
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">Sarah Chen</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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

            {/* Vitals & Symptoms */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle>Vitals & Symptoms</CardTitle>
                    <CardDescription>Record your health measurements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                    <Input
                      id="bloodSugar"
                      placeholder="100"
                      value={vitals.bloodSugar}
                      onChange={(e) => setVitals(prev => ({ ...prev, bloodSugar: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      placeholder="98.6"
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      placeholder="150"
                      value={vitals.weight}
                      onChange={(e) => setVitals(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Any symptoms or concerns..."
                    value={vitals.notes}
                    onChange={(e) => setVitals(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <Button onClick={handleVitalsSubmit} className="w-full" variant="healthcare">
                  <Activity className="w-4 h-4" />
                  Save Vitals
                </Button>
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
      </div>
    </div>
  );
};

export default PatientDashboard;
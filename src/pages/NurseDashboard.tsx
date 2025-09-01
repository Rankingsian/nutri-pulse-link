import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity, 
  Heart,
  MessageCircle,
  Home,
  TrendingUp,
  Pill,
  Utensils,
  Bell,
  Bot
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const NurseDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    {
      id: 1,
      name: "Sarah Chen",
      age: 34,
      status: "stable",
      lastCheckIn: "2 hours ago",
      medications: { taken: 2, total: 4 },
      vitals: { bp: "120/80", temp: "98.6°F", sugar: "95 mg/dL" },
      alerts: 1,
      adherence: 75
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 67,
      status: "critical",
      lastCheckIn: "15 minutes ago",
      medications: { taken: 1, total: 6 },
      vitals: { bp: "165/95", temp: "99.2°F", sugar: "180 mg/dL" },
      alerts: 3,
      adherence: 45
    },
    {
      id: 3,
      name: "Emma Thompson",
      age: 45,
      status: "stable",
      lastCheckIn: "1 hour ago",
      medications: { taken: 3, total: 3 },
      vitals: { bp: "118/75", temp: "98.4°F", sugar: "88 mg/dL" },
      alerts: 0,
      adherence: 95
    },
    {
      id: 4,
      name: "James Wilson",
      age: 58,
      status: "attention",
      lastCheckIn: "4 hours ago",
      medications: { taken: 2, total: 5 },
      vitals: { bp: "140/85", temp: "98.8°F", sugar: "125 mg/dL" },
      alerts: 2,
      adherence: 60
    }
  ];

  const notifications = [
    { id: 1, patient: "Michael Rodriguez", type: "critical", message: "Blood pressure elevated - immediate attention needed", time: "5 min ago" },
    { id: 2, patient: "James Wilson", type: "warning", message: "Missed evening medications", time: "1 hour ago" },
    { id: 3, patient: "Sarah Chen", type: "info", message: "Meal logging incomplete", time: "2 hours ago" },
  ];

  const healthTrends = [
    { day: 'Mon', adherence: 85, vitals: 92 },
    { day: 'Tue', adherence: 88, vitals: 89 },
    { day: 'Wed', adherence: 82, vitals: 95 },
    { day: 'Thu', adherence: 90, vitals: 88 },
    { day: 'Fri', adherence: 87, vitals: 93 },
    { day: 'Sat', adherence: 92, vitals: 90 },
    { day: 'Sun', adherence: 89, vitals: 94 }
  ];

  const medicationData = [
    { medication: 'Metformin', prescribed: 45, taken: 38 },
    { medication: 'Lisinopril', prescribed: 32, taken: 29 },
    { medication: 'Atorvastatin', prescribed: 28, taken: 22 },
    { medication: 'Aspirin', prescribed: 56, taken: 52 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "attention": return "bg-yellow-500 text-white";
      case "stable": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "attention": return <Clock className="w-4 h-4" />;
      case "stable": return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const PatientDetailModal = ({ patient }: { patient: any }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-primary" />
          <span>{patient.name} - Patient Details</span>
        </DialogTitle>
        <DialogDescription>
          Age {patient.age} • Last check-in: {patient.lastCheckIn}
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(patient.status)}>
                  {getStatusIcon(patient.status)}
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Medication Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{patient.adherence}%</div>
                <Progress value={patient.adherence} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{patient.alerts}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <Pill className="w-4 h-4 text-primary" />
                <span className="text-sm">Took morning medications</span>
                <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <Activity className="w-4 h-4 text-secondary" />
                <span className="text-sm">Recorded vital signs</span>
                <span className="text-xs text-muted-foreground ml-auto">3 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <Utensils className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm">Logged breakfast</span>
                <span className="text-xs text-muted-foreground ml-auto">4 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Daily medication schedule and adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Metformin 500mg", "Lisinopril 10mg", "Atorvastatin 20mg", "Aspirin 81mg"].map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <span className="font-medium">{med}</span>
                      <p className="text-sm text-muted-foreground">2x daily</p>
                    </div>
                    <Badge variant={index < 2 ? "default" : "outline"}>
                      {index < 2 ? "Taken" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Blood Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{patient.vitals.bp}</div>
                <p className="text-xs text-muted-foreground">Last reading</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{patient.vitals.temp}</div>
                <p className="text-xs text-muted-foreground">Normal range</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Blood Sugar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{patient.vitals.sugar}</div>
                <p className="text-xs text-muted-foreground">Fasting glucose</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Nutrition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10">
                <span>Breakfast</span>
                <Badge variant="default">Logged</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span>Lunch</span>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span>Dinner</span>
                <Badge variant="outline">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Nurse Dashboard</h1>
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
                Patient Messages
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">Nurse Johnson</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Patients</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-2">24</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="text-sm text-muted-foreground">Critical</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive mt-2">2</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Stable</span>
                  </div>
                  <div className="text-2xl font-bold text-secondary mt-2">18</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Avg Adherence</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-2">78%</div>
                </CardContent>
              </Card>
            </div>

            {/* Patient List */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle>Patient Overview</CardTitle>
                <CardDescription>Monitor your assigned patients and their health status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Medication</TableHead>
                        <TableHead>Last Check-in</TableHead>
                        <TableHead>Alerts</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-muted-foreground">Age {patient.age}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(patient.status)}>
                              {getStatusIcon(patient.status)}
                              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {patient.medications.taken}/{patient.medications.total} taken
                            </div>
                            <Progress value={(patient.medications.taken / patient.medications.total) * 100} className="mt-1 h-2" />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {patient.lastCheckIn}
                          </TableCell>
                          <TableCell>
                            {patient.alerts > 0 ? (
                              <Badge variant="destructive">{patient.alerts}</Badge>
                            ) : (
                              <Badge variant="outline">None</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedPatient(patient)}
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              {selectedPatient && <PatientDetailModal patient={selectedPatient} />}
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle>Weekly Health Trends</CardTitle>
                  <CardDescription>Patient adherence and vital signs trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="adherence" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="vitals" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle>Medication Adherence</CardTitle>
                  <CardDescription>Prescribed vs taken medications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={medicationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="medication" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="prescribed" fill="hsl(var(--muted))" />
                      <Bar dataKey="taken" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications Panel */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'critical' ? 'bg-destructive' : 
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-primary'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{notification.patient}</div>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Patient Vitals Entry */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Record Patient Vitals</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
                    <SelectItem value="james-miller">James Miller</SelectItem>
                    <SelectItem value="maria-lopez">Maria Lopez</SelectItem>
                    <SelectItem value="david-brown">David Brown</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Blood Pressure</Label>
                    <Input placeholder="120/80" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Blood Sugar</Label>
                    <Input placeholder="100 mg/dL" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Temperature</Label>
                    <Input placeholder="98.6°F" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Weight</Label>
                    <Input placeholder="150 lbs" className="h-8 text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Notes/Symptoms</Label>
                  <textarea 
                    className="w-full p-2 text-sm border border-input bg-background rounded-md resize-none"
                    rows={2}
                    placeholder="Patient observations..."
                  />
                </div>
                <Button className="w-full h-8 text-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  Save Vitals
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4" />
                  Add New Patient
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4" />
                  View All Vitals
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Pill className="w-4 h-4" />
                  Medication Report
                </Button>
                <Link to="/chat">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                    Patient Messages
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
                  <Clock className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Round 1</p>
                    <p className="text-xs text-muted-foreground">9:00 AM - 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
                  <MessageCircle className="w-4 h-4 text-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Patient Check-ins</p>
                    <p className="text-xs text-muted-foreground">1:00 PM - 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
                  <Activity className="w-4 h-4 text-accent-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Medication Review</p>
                    <p className="text-xs text-muted-foreground">4:00 PM - 5:00 PM</p>
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

export default NurseDashboard;
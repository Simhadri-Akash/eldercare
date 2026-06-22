import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Heart, Activity, Thermometer, Droplet, Footprints, Moon, Pill,
  Calendar, Clock, ShieldCheck, Stethoscope, FileText, Phone,ChevronLeft,
  Ambulance, AlertCircle, PhoneCall, ChevronRight, Menu, X, CheckCircle2,
  Syringe, Info, ArrowUp, ArrowDown, MapPin,Users,MessageCircle,Bell,CreditCard, ArrowLeft
} from "lucide-react";

import { format } from "date-fns";

import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const smartRingEnabled = false;
// Mock Data
const healthScoreTrend = [
  { month: "Jan", score: 75 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 76 },
  { month: "Apr", score: 80 },
  { month: "May", score: 81 },
  { month: "Jun", score: 82 }
];

const heartRateData = [
  { time: "00:00", value: 65 }, { time: "04:00", value: 62 },
  { time: "08:00", value: 70 }, { time: "12:00", value: 85 },
  { time: "16:00", value: 82 }, { time: "20:00", value: 75 },
  { time: "23:59", value: 68 }
];

const dailyVitals = [
  { id: 1, name: "Blood Pressure", value: "120/78", status: "Normal", time: "08:00 AM", icon: Activity },
  { id: 2, name: "Blood Glucose", value: "95 mg/dL", status: "Normal", time: "07:30 AM", icon: Droplet },
  { id: 3, name: "Weight", value: "62 kg", status: "Normal", time: "07:00 AM", icon: Activity },
  { id: 4, name: "Temperature", value: "98.4°F", status: "Normal", time: "08:00 AM", icon: Thermometer },
];

const appointments = [
  { id: 1, doc: "Dr. Emily Chen", spec: "Cardiologist", date: "Tomorrow, 10:00 AM", clinic: "Heart Care Center", type: "video" },
  { id: 2, doc: "Dr. James Wilson", spec: "General Physician", date: "Oct 15, 2:30 PM", clinic: "City Medical Hub", type: "in-person" }
];

const checkups = [
  { id: 1, name: "Annual Physical", status: "Due in 12 days" },
  { id: 2, name: "Eye Exam", status: "Overdue" },
  { id: 3, name: "Dental Cleaning", status: "Due in 2 months" },
  { id: 4, name: "Blood Panel", status: "Up to date" }
];

const vaccines = [
  { id: 1, name: "Flu Shot", status: "Up to date", color: "bg-emerald-500" },
  { id: 2, name: "COVID Booster", status: "Due next month", color: "bg-primary" },
  { id: 3, name: "Pneumococcal", status: "Overdue", color: "bg-destructive" },
  { id: 4, name: "Shingles", status: "Completed", color: "bg-emerald-500" }
];

const wellnessPlan = [
  { id: 1, name: "Morning Yoga", time: "7:00 AM", status: "done" },
  { id: 2, name: "Chair Exercises", time: "10:00 AM", status: "upcoming" },
  { id: 3, name: "Music Therapy", time: "2:00 PM", status: "upcoming" },
  { id: 4, name: "Evening Walk", time: "5:00 PM", status: "upcoming" }
];

export default function Dashboard() {
  const [sosOpen, setSosOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [meds, setMeds] = useState([
    { id: 1, name: "Lisinopril", dose: "10mg", time: "Morning", taken: true },
    { id: 2, name: "Atorvastatin", dose: "20mg", time: "Morning", taken: false },
    { id: 3, name: "Metformin", dose: "40mg", time: "Evening", taken: false },
  ]);
  const reports = [
    "Monthly Summary",
    "Blood Test (May)",
    "Medication Review",
    "ECG Report",
    "Lab Results"
  ];
  const toggleMed = (id: number) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const currentDate = format(new Date(), "EEEE, MMMM do");
  const [location] = useLocation();
  const navClass = (path: string) =>
    cn(
      `flex items-center h-11 rounded-xl text-sm font-medium transition-all`,
      sidebarOpen ? "gap-3 px-4" : "justify-center px-0",
      location === path
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );
    
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-background border-b flex items-center justify-between p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/befine-logo.jpeg" alt="Befine" className="h-8 object-contain" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <ChevronLeft />: <ChevronRight />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          bg-background border-r flex flex-col
          transition-all duration-300
          ${sidebarOpen ? "w-64" :"w-20"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="px-4 py-3 hidden md:flex items-center gap-2 border-b">
          <img src="/befine-logo.jpeg" alt="Befine" className={sidebarOpen ? "h-9" : "h-7"} />
        </div>
        
        <div
          className={`p-4 flex flex-col items-center border-b ${
            !sidebarOpen ? "py-6" : ""
          }`}
        >
          <Avatar className="w-16 h-16 mb-3 border-4 border-primary/10">
            <AvatarImage src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=250&auto=format&fit=crop" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <>
              <h2>Margaret Chen</h2>
              <p>Age 74</p>
            </>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-2 ">
          <Link
            href="/dashboard"
            className={navClass("/dashboard")}
          >
            <Activity className="w-5 h-5" /> {sidebarOpen && "Overview"}
          </Link>
          <Link href="/appointments" className={navClass("/appointments")}>
            <Calendar className="h-5 w-5" />
            {sidebarOpen && "Appointments"}
          </Link>

          <Link href="/health-reports" className={navClass("/health-reports")}>
            <FileText className="h-5 w-5" />
            {sidebarOpen && "Reports"}
          </Link>

          <Link href="/care-team" className={navClass("/care-team")}>
            <Users className="h-5 w-5" />
            {sidebarOpen && "Care Team"}
          </Link>

          <Link href="/messages" className={navClass("/messages")}>
            <MessageCircle className="h-5 w-5" />
            {sidebarOpen && "Messages"}
          </Link>

          <Link href="/notifications" className={navClass("/notifications")}>
            <Bell className="h-5 w-5" />
            {sidebarOpen && "Notifications"}
          </Link>

          <Link href="/billing" className={navClass("/billing")}>
            <CreditCard className="h-5 w-5" />
            {sidebarOpen && "Billing"}
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-primary"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />{sidebarOpen && "Back to Home"}
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          <div>
            
            <h1 className="text-3xl font-serif font-medium text-foreground">Good morning, Margaret</h1>
            <p className="text-muted-foreground mt-1">{currentDate}</p>
          </div>
          
          <Button 
            size="lg" 
            variant="destructive" 
            className="rounded-full shadow-lg relative group h-12 px-6"
            onClick={() => setSosOpen(true)}
            data-testid="btn-sos"
          >
            <div className="absolute inset-0 rounded-full border-2 border-destructive animate-ping opacity-20 group-hover:opacity-40" />
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-semibold tracking-wide">SOS Emergency</span>
          </Button>
        </header>

        {/* Top KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Health Score */}
          <Card className="col-span-2 md:col-span-1 border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
              <span className="text-sm font-medium text-muted-foreground mb-2">Health Score</span>
              <div className="relative w-20 h-20 flex items-center justify-center mb-1">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary/20" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * 82) / 100} className="text-emerald-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">82</span>
                  
                </div>
                
              </div>
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <ArrowUp className="w-4 h-4 mr-1" /> 2% this week
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Updated by caregiver
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Heart Rate</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                </span>
              </div>
              <div className="text-3xl font-bold mb-2">72 <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
              <div className="h-10 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Last updated 15 mins ago
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">SpO2</span>
                <Droplet className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold mb-4">98%</div>
              <Progress value={98} className="h-2 bg-blue-100" />
              <p className="text-xs text-muted-foreground mt-2">Normal range</p>
              <p className="text-xs text-slate-500">
                Care manager entry
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Steps Today</span>
                <Footprints className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold mb-4">3,420</div>
              <Progress value={68} className="h-2 bg-emerald-100" />
              <p className="text-xs text-muted-foreground mt-2">Goal: 5,000</p>
              <p className="text-xs text-slate-500 mt-2">
                Daily wellness log
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Sleep</span>
                <Moon className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold mb-2">7h 15m</div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Good Quality</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          
          {/* Column 1: Vitals & Smart Ring */}
          <div className="space-y-6">
            {/* Daily Vitals */}
            <Card >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Today's Vitals</CardTitle>
                <CardDescription>Recorded by care manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyVitals.map(vital => (
                    <div key={vital.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <vital.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{vital.name}</p>
                          <p className="text-xs text-muted-foreground">{vital.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{vital.value}</p>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0 text-[10px] mt-0.5">
                          {vital.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* =============================
              PHASE 2 - SMART RING MODULE
              Enable after smart ring launch
            ================================
            <Card className="bg-slate-900 text-slate-50 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-serif text-slate-50 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Smart Ring Live
                  </CardTitle>
                  <span className="text-xs text-slate-400">Synced just now</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Heart Rate Variability</span>
                    <span className="font-medium text-emerald-400">42 ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Stress Level</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 border-0">Low</Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Activity Ring</span>
                      <span className="text-slate-50">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-slate-800 [&>div]:bg-indigo-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            ================================ */}
            {/* Health Reports */}
            <Card className="self-start" >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Health Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 mb-4 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthScoreTrend}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div
                      key={report}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{report}</span>
                      </div>

                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Medications & Appointments */}
          <div className="space-y-6">
            {/* Medications */}
            <Card >
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-serif">Medications</CardTitle>
                  <CardDescription>Today's schedule</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-8">Full List</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meds.map(med => (
                    <div key={med.id} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${med.taken ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                          {med.taken ? <CheckCircle2 className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className={`font-medium ${med.taken ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{med.name}</p>
                          <p className="text-xs text-muted-foreground">{med.dose} • {med.time}</p>
                        </div>
                      </div>
                      <Button 
                        variant={med.taken ? "ghost" : "default"}
                        size="sm"
                        className={med.taken ? "text-muted-foreground" : "bg-primary text-primary-foreground"}
                        onClick={() => toggleMed(med.id)}
                        data-testid={`btn-med-${med.id}`}
                      >
                        {med.taken ? "Taken" : "Take Now"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctor Appointments */}
            <Card className="self-start" >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((apt, i) => (
                    <div key={apt.id} className={`p-4 rounded-xl border ${i === 0 ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-serif font-medium">{apt.doc}</p>
                          <p className="text-xs text-muted-foreground">{apt.spec}</p>
                        </div>
                        <Badge variant={apt.type === 'video' ? 'secondary' : 'outline'} className="text-[10px]">
                          {apt.type === 'video' ? 'Telehealth' : 'In-person'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" /> {apt.date}
                      </div>
                      {apt.type === 'video' ? (
                        <Button className="w-full" variant={i === 0 ? 'default' : 'outline'}>Join Video Call</Button>
                      ) : (
                        <Button className="w-full" variant="outline"><MapPin className="w-4 h-4 mr-2" /> Get Directions</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Activities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Wellness Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wellnessPlan.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.status === "done"
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {activity.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>

                      {activity.status === "done" ? (
                        <Badge className="bg-green-100 text-green-700">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Care Team & More */}
          <div className="space-y-6">
            {/* Care Manager Details */}
            <Card className="bg-secondary/10 border-secondary/20">
              <CardContent className="p-5">
                <div className="flex flex-col items-center gap-4 mb-5 text-center">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-sm">
                    <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <h3 className="font-serif font-medium text-xl">Sarah Mitchell</h3>
                  <p className="text-secondary-foreground mb-4 text-sm font-medium">Senior Care Manager</p>
                  
                  <div className="flex w-full grid grid-cols-2 gap-3 mb-5">
                    <Button className="flex-1" size="sm" variant="default"><Phone className="w-4 h-4 mr-2" /> Call</Button>
                    <Button className="flex-1"  size="sm" variant="outline">Message</Button>
                  </div>

                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Visit
                      </span>
                      <span>Yesterday</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next Visit</span>
                      <span> Thursday, 2 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Family Circle</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      Michael Chen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Son
                    </p>
                  </div>

                  <Badge>Primary Contact</Badge>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      Lisa Chen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Daughter
                    </p>
                  </div>

                  <Badge variant="outline">
                    Emergency Contact
                  </Badge>
                </div>

              </CardContent>
            </Card>
            {/* Upcoming Checkups & Vaccines */}
            <Card className="self-start">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Preventative Care</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="checkups" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="checkups">Checkups</TabsTrigger>
                    <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="checkups" className="space-y-3">
                    {checkups.map(c => (
                      <div key={c.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${c.status === 'Overdue' ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>{c.status}</span>
                          {c.status !== 'Up to date' && <Button variant="outline" size="sm" className="h-7 text-xs px-2">Schedule</Button>}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="vaccines" className="space-y-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-bold text-emerald-600">75%</span>
                    </div>
                    <Progress value={75} className="h-2 mb-4 bg-muted [&>div]:bg-emerald-500" />
                    
                    <div className="space-y-3">
                      {vaccines.map(v => (
                        <div key={v.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${v.color}`} />
                            <span className="text-sm">{v.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{v.status}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Ambulance Request */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3 bg-primary/5 rounded-t-xl border-b border-primary/10">
                <CardTitle className="text-lg font-serif flex items-center gap-2 text-primary">
                  <Ambulance className="w-5 h-5" /> Medical Transport
                </CardTitle>
                <CardDescription className="text-primary/70">Non-emergency ambulance booking</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Destination</Label>
                  <Select defaultValue="city-med">
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city-med">City Medical Center</SelectItem>
                      <SelectItem value="west-clinic">Westside Clinic</SelectItem>
                      <SelectItem value="custom">Other...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Pickup Time</Label>
                  <Input type="datetime-local" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm" data-testid="btn-ambulance">
                  Request Transport
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Last request: Completed on Oct 2nd
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

      </main>

      {/* SOS Modal */}
      <Dialog open={sosOpen} onOpenChange={setSosOpen}>
        <DialogContent className="sm:max-w-md border-destructive/20 text-center">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping opacity-20" />
            <PhoneCall className="w-10 h-10 text-destructive animate-pulse" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center text-destructive">SOS Activated</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Calling emergency services and notifying your care team...
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-lg my-4 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Dispatching to:</span>
              <span className="text-sm font-medium">124 Maple Street, Apt 4B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Notifying:</span>
              <span className="text-sm font-medium">Michael Chen (Son)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Notifying:</span>
              <span className="text-sm font-medium">Sarah Mitchell (Care Mgr)</span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setSosOpen(false)} className="w-full md:w-auto" data-testid="btn-sos-cancel">
              Cancel Request (10s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

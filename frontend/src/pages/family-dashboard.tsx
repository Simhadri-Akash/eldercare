import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  Heart, X, Activity, Thermometer, Droplet, Footprints, Moon, Pill,
  Calendar, Clock, ShieldCheck, Stethoscope, FileText, Phone,
  Ambulance, AlertCircle, PhoneCall, ChevronRight, Menu, CheckCircle2,
  Syringe, Info, ArrowUp, ArrowDown, MapPin, Bell, Share2, Download, Check
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const healthTrends = [
  { date: "06/01", score: 75, heartRate: 72, steps: 3100 },
  { date: "06/05", score: 78, heartRate: 74, steps: 3500 },
  { date: "06/10", score: 76, heartRate: 71, steps: 3200 },
  { date: "06/15", score: 80, heartRate: 73, steps: 3800 },
  { date: "06/20", score: 81, heartRate: 72, steps: 4100 },
  { date: "06/25", score: 82, heartRate: 75, steps: 3420 }
];

const adherenceData = [
  { name: "Taken", value: 87 },
  { name: "Missed", value: 13 }
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

export default function FamilyDashboard() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsDismissed, setAlertsDismissed] = useState<number[]>([]);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const alerts = [
    { id: 1, text: "Margaret missed her afternoon Metformin dose", type: "warning" },
    { id: 2, text: "Smart Ring battery is low (15%)", type: "info" }
  ];

  const handleDismiss = (id: number) => {
    setAlertsDismissed(prev => [...prev, id]);
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder sent",
      description: "A notification has been sent to Margaret's device.",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Generating the monthly report PDF...",
    });
  };

  const handleReplySubmit = () => {
    toast({
      title: "Message sent",
      description: "Sarah has been notified.",
    });
    setReplyModalOpen(false);
    setReplyText("");
  };

  const handleInviteSubmit = () => {
    toast({
      title: "Invitation sent",
      description: `An invite has been sent to ${inviteEmail}.`,
    });
    setInviteModalOpen(false);
    setInviteEmail("");
  };

  const activeAlerts = alerts.filter(a => !alertsDismissed.includes(a.id));

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-background border-b flex items-center justify-between p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/befine-logo.jpeg" alt="Befine" className="h-8 object-contain" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r flex flex-col transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:sticky md:top-0 md:h-screen
      `}>
        <div className="p-6 hidden md:flex items-center gap-2">
          <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain" />
        </div>
        
        <div className="p-6 flex flex-col items-center border-b">
          <Avatar className="w-16 h-16 mb-3 border-2 border-primary/10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop" />
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>
          <h2 className="font-medium text-base">James Chen</h2>
          <Badge variant="outline" className="mt-1 font-normal text-xs bg-muted">Family Admin</Badge>
          
          <div className="mt-4 w-full bg-secondary/10 border border-secondary/20 rounded-lg p-3 flex items-center gap-3">
             <Avatar className="w-8 h-8">
               <AvatarImage src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=250&auto=format&fit=crop" />
               <AvatarFallback>MC</AvatarFallback>
             </Avatar>
             <div className="text-xs">
               <span className="text-muted-foreground block leading-none">Viewing:</span>
               <span className="font-medium">Margaret Chen</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/family-dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg font-medium">
            <Activity className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/family-dashboard" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <Pill className="w-5 h-5" /> Medications
          </Link>
          <Link href="/family-dashboard" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <MapPin className="w-5 h-5" /> Safety & Location
          </Link>
          <Link href="/family-dashboard" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <Stethoscope className="w-5 h-5" /> Care Team
          </Link>
          <Link href="/family-dashboard" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <FileText className="w-5 h-5" /> Reports
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Home
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-serif font-medium text-foreground">Family Dashboard</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Last updated: Today at 4:12 PM
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Badge className="bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1.5 border border-primary/20">
               <AlertCircle className="w-4 h-4 mr-1.5" /> Attention Needed
             </Badge>
          </div>
        </header>

        {/* 1. Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl border bg-primary/5 border-primary/20 text-primary">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{alert.text}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5" onClick={() => handleDismiss(alert.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 2. Parent Overview */}
        <Card className="bg-card shadow-md border-border overflow-hidden">
          <div className="h-2 bg-primary/20 w-full" />
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=250&auto=format&fit=crop" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full border-2 border-background flex items-center gap-1 shadow-sm">
                <Heart className="w-3 h-3 fill-emerald-700" />
                Feeling Well
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-serif mb-1">Margaret Chen</h2>
              <p className="text-muted-foreground mb-4">74 years old</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/50 p-3 rounded-xl">
                  <div className="text-muted-foreground flex items-center justify-center md:justify-start gap-1 mb-1">
                    <Activity className="w-4 h-4" /> Last Activity
                  </div>
                  <div className="font-medium">Yoga (7:02 AM)</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl">
                  <div className="text-muted-foreground flex items-center justify-center md:justify-start gap-1 mb-1">
                    <MapPin className="w-4 h-4" /> Location
                  </div>
                  <div className="font-medium">Home <span className="text-xs font-normal text-muted-foreground ml-1">(10m ago)</span></div>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl">
                  <div className="text-muted-foreground flex items-center justify-center md:justify-start gap-1 mb-1">
                    <AlertCircle className="w-4 h-4" /> Battery
                  </div>
                  <div className="font-medium">Smart Ring 84%</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-muted-foreground mb-2">Health Score</span>
              <div className="relative w-24 h-24 flex items-center justify-center mb-1">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary/20" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset={251 - (251 * 82) / 100} className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">82</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Heart Rate</span>
                <Activity className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold mb-1">72 <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
              <div className="flex items-center text-xs">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-1 py-0 mr-2">Normal</Badge>
                <span className="text-emerald-600 flex items-center"><ArrowDown className="w-3 h-3 mr-0.5" /> 2 bpm</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Blood Pressure</span>
                <Thermometer className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold mb-1">120/78</div>
              <div className="flex items-center text-xs">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-1 py-0 mr-2">Normal</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">SpO2</span>
                <Droplet className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-bold mb-1">98%</div>
              <div className="flex items-center text-xs">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-1 py-0 mr-2">Normal</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Steps</span>
                <Footprints className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-2">3,420</div>
              <Progress value={68} className="h-1.5" />
              <div className="text-xs text-muted-foreground mt-1 text-right">Goal: 5,000</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Column 1 */}
          <div className="space-y-6">
            {/* 4. Medication Adherence */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-serif">Medication Status</CardTitle>
                <CardDescription>Today's schedule & adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-24 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adherenceData}
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {adherenceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-bold leading-none">87%</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Overall Adherence</div>
                    <div className="text-xs text-muted-foreground">Good consistency this week.</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-900 line-through">Lisinopril 10mg</p>
                        <p className="text-xs text-emerald-700">8:00 AM</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white/50 text-emerald-700 border-emerald-200">Taken</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-900 line-through">Atorvastatin 20mg</p>
                        <p className="text-xs text-emerald-700">8:00 AM</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white/50 text-emerald-700 border-emerald-200">Taken</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-primary">Metformin 40mg</p>
                        <p className="text-xs text-primary/80">2:00 PM</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-white text-primary border-primary/30 hover:bg-primary/10 hover:text-primary" onClick={handleSendReminder} data-testid="btn-remind-med">
                      Remind
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 9. Location & Safety */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Safety Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Current Location</span>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 h-5 px-1.5 text-[10px]">Safe Zone</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Home — Last verified 3:58 PM</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-medium">Fall Detection</span>
                    </div>
                    <p className="text-xs text-muted-foreground">No falls detected</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Bell className="w-4 h-4" />
                      <span className="text-sm font-medium">Door Sensor</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Opened 9:14 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {/* 5. Alerts Timeline */}
            <Card className="h-[430px] flex flex-col">
              <CardHeader className="pb-3 shrink-0">
                <CardTitle className="text-lg font-serif">Today's Timeline</CardTitle>
                <CardDescription>Activity and events</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto pr-2">
                <div className="relative border-l border-muted-foreground/20 ml-3 space-y-6 pb-4">
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary border border-background"></div>
                    <p className="text-xs text-primary font-medium mb-0.5">03:45 PM • Smart Ring</p>
                    <p className="text-sm font-medium">Elevated heart rate (98 bpm for 12m)</p>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-destructive border border-background"></div>
                    <p className="text-xs text-destructive font-medium mb-0.5">02:00 PM • Medication</p>
                    <p className="text-sm font-medium">Afternoon Metformin missed</p>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-background"></div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">11:00 AM • Vitals</p>
                    <p className="text-sm font-medium">Blood pressure recorded (120/78)</p>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-background"></div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">09:30 AM • Activity</p>
                    <p className="text-sm font-medium">Morning Yoga completed</p>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-background"></div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">08:05 AM • Medication</p>
                    <p className="text-sm font-medium">Morning medications taken</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 shrink-0">
                <Button variant="ghost" className="w-full text-sm h-8" data-testid="btn-view-history">View All History</Button>
              </CardFooter>
            </Card>

            {/* 6. Upcoming Schedule */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" /> Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">JUN</span>
                      <span className="text-lg font-bold text-primary leading-none">18</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Primary Care Visit</p>
                      <p className="text-xs text-muted-foreground mb-2">10:00 AM • Dr. Priya Sharma</p>
                      <Button variant="outline" size="sm" className="h-7 text-xs" data-testid="btn-add-calendar-1">Add to Calendar</Button>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-muted flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">JUL</span>
                      <span className="text-lg font-bold text-muted-foreground leading-none">02</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cardiology Follow-up</p>
                      <p className="text-xs text-muted-foreground">2:30 PM • Dr. Robert Kim</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {/* 11. Care Notes */}
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-serif">Care Manager Notes</CardTitle>
                    <CardDescription>From Sarah Mitchell</CardDescription>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-lg p-3 text-sm border shadow-sm relative">
                  <div className="absolute -left-1.5 top-4 w-3 h-3 bg-background border-t border-l rotate-[-45deg]"></div>
                  <p className="text-xs text-muted-foreground mb-1">June 13</p>
                  <p>Margaret is in good spirits today. Completed all morning exercises. Requested more puzzles for cognitive activities.</p>
                </div>
                <div className="bg-background rounded-lg p-3 text-sm border shadow-sm relative opacity-70">
                  <div className="absolute -left-1.5 top-4 w-3 h-3 bg-background border-t border-l rotate-[-45deg]"></div>
                  <p className="text-xs text-muted-foreground mb-1">June 11</p>
                  <p>Blood pressure slightly elevated, advised rest. Notified Dr. Sharma.</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => setReplyModalOpen(true)} data-testid="btn-reply-sarah">
                  Reply to Sarah
                </Button>
              </CardFooter>
            </Card>

            {/* 7. Doctor & Care Team */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Care Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dr. Priya Sharma</p>
                    <p className="text-xs text-muted-foreground">Primary Care</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-4 h-4" /></Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dr. Robert Kim</p>
                    <p className="text-xs text-muted-foreground">Cardiologist</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-4 h-4" /></Button>
                </div>
                <Button variant="outline" className="w-full mt-2" data-testid="btn-request-appt">Request Appointment</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 8. Health Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif">30-Day Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="score" name="Health Score" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                  <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Avg Heart Rate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="steps" name="Steps" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 10. Emergency Contacts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">James Chen <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">Primary</Badge></p>
                  <p className="text-xs text-muted-foreground">Son • (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Lisa Chen</p>
                  <p className="text-xs text-muted-foreground">Daughter • (555) 987-6543</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">SOS History</span>
                </div>
                <p className="text-xs text-muted-foreground">No SOS events in the last 30 days.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" data-testid="btn-edit-contacts">Edit Contacts</Button>
            </CardFooter>
          </Card>

          {/* 12. Monthly Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Monthly Report</CardTitle>
              <CardDescription>June 2026 Summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medication Adherence</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Health Score</span>
                  <span className="font-medium">79</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Appointments Attended</span>
                  <span className="font-medium">2/2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wellness Activities</span>
                  <span className="font-medium">18/22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Falls / SOS Events</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={handleDownloadReport} data-testid="btn-download-report">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button className="flex-1" variant="outline">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </CardFooter>
          </Card>

          {/* 13. Family Sharing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif">Family Sharing</CardTitle>
              <CardDescription>Manage who can see this data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8"><AvatarFallback>JC</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-medium">James Chen (You)</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8"><AvatarFallback>LC</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-medium">Lisa Chen</p>
                    <p className="text-xs text-muted-foreground">Viewer</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8"><AvatarFallback>RC</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-medium">Robert Chen</p>
                    <p className="text-xs text-muted-foreground">Viewer</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full border-dashed" variant="outline" onClick={() => setInviteModalOpen(true)} data-testid="btn-invite-family">
                + Invite Family Member
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Sarah</DialogTitle>
            <DialogDescription>Send a message to Margaret's Care Manager.</DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Type your message here..." 
            className="min-h-[100px]"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            data-testid="input-reply"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyModalOpen(false)}>Cancel</Button>
            <Button onClick={handleReplySubmit} disabled={!replyText.trim()} data-testid="btn-submit-reply">Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Family Member</DialogTitle>
            <DialogDescription>Send an email invitation to view Margaret's dashboard.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                data-testid="input-invite-email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleInviteSubmit} disabled={!inviteEmail.trim() || !inviteEmail.includes('@')} data-testid="btn-submit-invite">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

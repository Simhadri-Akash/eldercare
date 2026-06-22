import { useState } from "react";
import { Link } from "wouter";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";
import { 
  Heart, Clock, Shield, AlertTriangle, AlertCircle, Info, Activity,
  CheckCircle2, Plus, LogOut, FileText, UserCircle, 
  MessageSquare, Calendar, Stethoscope, Menu, X, Star, FileInput, Truck,
  ChevronRight, CalendarDays
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Static Data
const CLIENTS = [
  { id: "1", name: "Margaret Chen", age: 74, score: 82, status: "Stable", lastVisit: "Yesterday", nextVisit: "Today 3 PM", initials: "MC" },
  { id: "2", name: "Harold Brooks", age: 81, score: 67, status: "Needs Attention", lastVisit: "June 11", nextVisit: "June 14 2 PM", initials: "HB" },
  { id: "3", name: "Dorothy Simmons", age: 78, score: 88, status: "Stable", lastVisit: "Today 9 AM", nextVisit: "June 15 11 AM", initials: "DS" },
  { id: "4", name: "Walter Nguyen", age: 85, score: 45, status: "Critical", lastVisit: "Yesterday", nextVisit: "Today 1 PM", initials: "WN" },
  { id: "5", name: "Evelyn Ross", age: 72, score: 79, status: "Stable", lastVisit: "June 12", nextVisit: "June 16 3 PM", initials: "ER" },
  { id: "6", name: "Frank Deluca", age: 80, score: 71, status: "Needs Attention", lastVisit: "June 11", nextVisit: "June 15 10 AM", initials: "FD" },
];

const MEDICATION_DATA = [
  { name: 'Dorothy S.', taken: 100, fill: "hsl(var(--secondary))" },
  { name: 'Margaret C.', taken: 67, fill: "hsl(var(--primary))" },
  { name: 'Harold B.', taken: 100, fill: "hsl(var(--secondary))" },
  { name: 'Walter N.', taken: 50, fill: "hsl(var(--destructive))" },
  { name: 'Evelyn R.', taken: 100, fill: "hsl(var(--secondary))" },
  { name: 'Frank D.', taken: 67, fill: "hsl(var(--primary))" },
];

const WEEKLY_VISITS = [
  { day: 'Mon', visits: 4 },
  { day: 'Tue', visits: 5 },
  { day: 'Wed', visits: 3 },
  { day: 'Thu', visits: 6 },
  { day: 'Fri', visits: 3 },
  { day: 'Sat', visits: 0 },
  { day: 'Sun', visits: 0 },
];

export default function CaregiverDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnShift, setIsOnShift] = useState(true);
  const [selectedClientForVitals, setSelectedClientForVitals] = useState("4");
  const { toast } = useToast();

  const handleLogVisit = (e: React.FormEvent, clientName: string) => {
    e.preventDefault();
    toast({
      title: "Visit Logged",
      description: `Visit successfully logged for ${clientName}.`,
    });
  };

  const handleRecordVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const client = CLIENTS.find(c => c.id === selectedClientForVitals);
    toast({
      title: "Vitals Recorded",
      description: `Vitals recorded for ${client?.name}.`,
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Note Saved",
      description: "Your note has been added successfully.",
    });
  };

  const toggleShift = () => {
    setIsOnShift(!isOnShift);
    toast({
      title: !isOnShift ? "Shift Started" : "Shift Ended",
      description: !isOnShift ? "You are now on shift." : "You are now clocked out.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border z-10 relative">
        <div className="flex items-center gap-2 text-primary">
          <img src="/befine-logo.jpeg" alt="Befine" className="h-8 object-contain" />
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground p-2" data-testid="btn-mobile-menu">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? "flex" : "hidden"} md:flex 
        flex-col w-full md:w-64 bg-sidebar border-r border-sidebar-border absolute md:relative z-20 h-[calc(100vh-65px)] md:h-screen transition-transform
      `}>
        <div className="hidden md:flex items-center gap-2 p-6 pb-2 text-primary border-b border-sidebar-border/50">
          <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain" />
        </div>

        <div className="p-6 flex flex-col items-center border-b border-sidebar-border/50">
          <Avatar className="w-20 h-20 mb-4 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xl">SM</AvatarFallback>
          </Avatar>
          <h2 className="font-serif text-lg font-medium text-sidebar-foreground">Sarah Mitchell</h2>
          <Badge variant="outline" className="mt-1 font-normal text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground">Senior Care Manager</Badge>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`mt-4 w-full rounded-full transition-colors ${isOnShift ? "bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20 hover:text-secondary" : "text-muted-foreground"}`}
            onClick={toggleShift}
            data-testid="btn-toggle-shift"
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isOnShift ? "bg-secondary" : "bg-muted-foreground"}`} />
            {isOnShift ? "On Shift" : "Off Shift"}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/caregiver-dashboard">
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-foreground font-medium cursor-pointer" data-testid="nav-dashboard">
              <Activity className="w-5 h-5 text-sidebar-primary" /> Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer">
            <UserCircle className="w-5 h-5" /> My Clients
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer">
            <CalendarDays className="w-5 h-5" /> Schedule
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer">
            <MessageSquare className="w-5 h-5" /> Messages
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer">
            <FileText className="w-5 h-5" /> Reports
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border/50">
          <Link href="/">
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer" data-testid="nav-logout">
              <LogOut className="w-5 h-5" /> Log Out
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        
        {/* Header Bar */}
        <header className="bg-background border-b border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-serif text-foreground">Good morning, Sarah</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              <span className="mx-2 text-border">•</span>
              <span className="text-primary font-medium">4 tasks remaining today</span>
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm w-full md:w-auto"
            onClick={toggleShift}
            data-testid="btn-header-clockout"
          >
            {isOnShift ? "Clock Out" : "Clock In"}
          </Button>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          
          {/* 1. Today's Shift Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Assigned Clients</p>
                  <p className="text-2xl font-serif text-foreground">6 <span className="text-sm font-sans text-muted-foreground font-normal">total</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Visits Today</p>
                  <p className="text-2xl font-serif text-foreground">3 <span className="text-sm font-sans text-muted-foreground font-normal">completed</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Tasks Pending</p>
                  <p className="text-2xl font-serif text-foreground">4</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/5 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary font-medium">Alerts</p>
                  <p className="text-2xl font-serif text-primary font-medium">2 <span className="text-sm font-sans font-normal">attention needed</span></p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 2. My Assigned Clients */}
              <Card className="shadow-sm border-border/60 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <CardTitle className="font-serif text-lg">My Assigned Clients</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/20 text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Client</th>
                        <th className="px-4 py-3 font-medium">Health</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Schedule</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {CLIENTS.map(client => (
                        <tr key={client.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">{client.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{client.name}</p>
                                <p className="text-xs text-muted-foreground">{client.age} yrs</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${client.score >= 75 ? 'bg-secondary' : client.score >= 50 ? 'bg-primary' : 'bg-destructive'}`}></span>
                              <span className="font-medium">{client.score}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="text-xs">
                              <p className="text-muted-foreground mb-0.5">Last: {client.lastVisit}</p>
                              <p className="font-medium text-foreground">Next: {client.nextVisit}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`font-normal text-xs ${
                              client.status === 'Stable' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                              client.status === 'Needs Attention' ? 'bg-primary/10 text-primary border-primary/20' : 
                              'bg-destructive/10 text-destructive border-destructive/20'
                            }`}>
                              {client.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 text-xs" data-testid={`btn-log-visit-${client.id}`}>Log Visit</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <form onSubmit={(e) => handleLogVisit(e, client.name)}>
                                    <DialogHeader>
                                      <DialogTitle className="font-serif">Log Visit: {client.name}</DialogTitle>
                                      <DialogDescription>Record details for your current or completed visit.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Date & Time</Label>
                                          <Input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Visit Type</Label>
                                          <Select defaultValue="routine">
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="routine">Routine</SelectItem>
                                              <SelectItem value="followup">Follow-up</SelectItem>
                                              <SelectItem value="emergency">Emergency</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        <Label>Vitals Recorded</Label>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div className="flex items-center space-x-2"><Checkbox id="bp" /><label htmlFor="bp" className="cursor-pointer">Blood Pressure</label></div>
                                          <div className="flex items-center space-x-2"><Checkbox id="gl" /><label htmlFor="gl" className="cursor-pointer">Blood Glucose</label></div>
                                          <div className="flex items-center space-x-2"><Checkbox id="wt" /><label htmlFor="wt" className="cursor-pointer">Weight</label></div>
                                          <div className="flex items-center space-x-2"><Checkbox id="tp" /><label htmlFor="tp" className="cursor-pointer">Temperature</label></div>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Visit Notes</Label>
                                        <Textarea placeholder="Enter observations and notes here..." className="h-24 resize-none" required />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit" className="w-full">Submit Visit Record</Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* 4. Client Alerts & Urgent Items */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" /> Action Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    <div className="p-4 flex gap-4 items-start hover:bg-muted/10 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-foreground"><span className="text-destructive font-bold">URGENT:</span> Walter Nguyen</p>
                            <p className="text-sm text-muted-foreground mt-1">Health score dropped 12 points in 3 days. Elevated blood pressure and reported dizziness.</p>
                          </div>
                          <Button size="sm" variant="destructive" className="shrink-0">Review Now</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex gap-4 items-start hover:bg-muted/10 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-foreground"><span className="text-primary font-bold">WARNING:</span> Harold Brooks</p>
                            <p className="text-sm text-muted-foreground mt-1">Missed last 2 scheduled physiotherapy sessions. Pain levels may be increasing.</p>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0 border-primary text-primary hover:bg-primary/5 hover:text-primary">Contact Client</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex gap-4 items-start hover:bg-muted/10 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-foreground"><span className="text-blue-500 font-bold">INFO:</span> Margaret Chen</p>
                            <p className="text-sm text-muted-foreground mt-1">Missed afternoon Metformin dose according to smart dispenser.</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="shrink-0"
                            onClick={() => toast({ description: "Reminder sent to Margaret Chen and family." })}
                          >
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5 & 6. Vitals & Notes Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Vitals Entry */}
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-secondary" /> Quick Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <form onSubmit={handleRecordVitals} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Client</Label>
                        <Select value={selectedClientForVitals} onValueChange={setSelectedClientForVitals}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CLIENTS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>BP (mmHg)</Label>
                          <Input placeholder="120/80" />
                        </div>
                        <div className="space-y-2">
                          <Label>Glucose (mg/dL)</Label>
                          <Input placeholder="100" />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight (lbs)</Label>
                          <Input placeholder="150" />
                        </div>
                        <div className="space-y-2">
                          <Label>Temp (°F)</Label>
                          <Input placeholder="98.6" />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" data-testid="btn-record-vitals">Record Vitals</Button>
                      
                      <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs">
                        <p className="text-muted-foreground font-medium mb-1">Last Recorded (Walter N.):</p>
                        <p className="text-foreground">BP: 145/90 • Gl: 110 • Wt: 142 • 2 days ago</p>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Visit Notes Log */}
                <Card className="shadow-sm border-border/60 flex flex-col">
                  <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="font-serif text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" /> Recent Notes
                    </CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Plus className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleAddNote}>
                          <DialogHeader>
                            <DialogTitle>Add Clinical Note</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Client</Label>
                              <Select defaultValue="1">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {CLIENTS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Note</Label>
                              <Textarea placeholder="Type observations here..." className="h-32" required />
                            </div>
                          </div>
                          <DialogFooter><Button type="submit">Save Note</Button></DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto max-h-[300px] divide-y divide-border/50">
                      <div className="p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-foreground">Margaret Chen</p>
                          <span className="text-xs text-muted-foreground">June 13</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">Margaret is in good spirits today. Completed all morning exercises. Requested more puzzles for cognitive activities.</p>
                      </div>
                      <div className="p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-foreground">Dorothy Simmons</p>
                          <span className="text-xs text-muted-foreground">June 13, 9:15 AM</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">Routine visit completed. BP 118/76 normal. Weight stable. Client reports mild knee pain.</p>
                      </div>
                      <div className="p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-foreground">Walter Nguyen</p>
                          <span className="text-xs text-muted-foreground">June 12</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">Significant fatigue reported. Health score declining. Recommending urgent GP review. Notified Dr. Sharma.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
              
              {/* 10. Team Communications */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" /> Team & Family Inbox
                  </CardTitle>
                  <Button variant="outline" size="sm" className="h-8">Message Team</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    <div className="p-4 flex gap-4 hover:bg-muted/10 transition-colors">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarFallback className="bg-accent text-accent-foreground text-xs">PS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">Dr. Priya Sharma <span className="text-xs font-normal text-muted-foreground">to Care Team</span></p>
                          <span className="text-xs text-muted-foreground">June 12</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">Please ensure Walter Nguyen gets his blood pressure recorded daily until his appointment.</p>
                        <Button variant="link" size="sm" className="h-6 px-0 mt-2 text-primary">Reply</Button>
                      </div>
                    </div>
                    <div className="p-4 flex gap-4 hover:bg-muted/10 transition-colors">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">AD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">Befine Admin <span className="text-xs font-normal text-muted-foreground">to Staff</span></p>
                          <span className="text-xs text-muted-foreground">June 11</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">Reminder: Monthly reports due June 20.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* 3. Today's Schedule */}
              <Card className="shadow-sm border-border/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <CardTitle className="font-serif text-lg">Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-background bg-secondary text-secondary-foreground absolute left-0 -translate-x-3 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] pl-3">
                        <div className="flex flex-col">
                          <time className="text-xs font-medium text-muted-foreground">9:00 AM</time>
                          <p className="text-sm font-medium text-foreground">Dorothy Simmons</p>
                          <p className="text-xs text-muted-foreground">Routine Visit</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-background text-primary absolute left-0 -translate-x-3 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] pl-3">
                        <div className="flex flex-col bg-primary/5 p-2 rounded-lg border border-primary/20">
                          <div className="flex justify-between items-start">
                            <time className="text-xs font-bold text-primary">1:00 PM</time>
                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider">Next</Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground mt-0.5">Walter Nguyen</p>
                          <p className="text-xs text-muted-foreground">Follow-up</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-border bg-background absolute left-0 -translate-x-3 shrink-0" />
                      <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] pl-3">
                        <div className="flex flex-col">
                          <time className="text-xs font-medium text-muted-foreground">3:00 PM</time>
                          <p className="text-sm font-medium text-foreground">Margaret Chen</p>
                          <p className="text-xs text-muted-foreground">Routine Visit</p>
                        </div>
                      </div>
                    </div>

                  </div>
                  
                  <Button variant="outline" className="w-full mt-6 border-dashed text-muted-foreground">
                    <Plus className="w-4 h-4 mr-2" /> Add Unscheduled Visit
                  </Button>
                </CardContent>
              </Card>

              {/* 7. Medication Oversight */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <CardTitle className="font-serif text-lg">Medication Oversight</CardTitle>
                  <CardDescription className="text-xs">Adherence across clients today</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-6">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MEDICATION_DATA} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                        <Bar dataKey="taken" radius={[0, 4, 4, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-center">
                    <Button variant="link" size="sm" className="text-primary text-xs" onClick={() => toast({description: "Reminders sent to all pending clients."})}>
                      Send Reminders to Pending
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 8. Care Plans Due */}
              <Card className="shadow-sm border-border/60">
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" /> Care Plan Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-foreground">Walter Nguyen</p>
                        <p className="text-xs text-destructive font-medium">Overdue (3 days)</p>
                      </div>
                      <Button size="sm" variant="destructive" className="h-7 text-xs">Review Now</Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-foreground">Harold Brooks</p>
                        <p className="text-xs text-primary font-medium">Due June 15</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-primary text-primary">Review</Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-foreground">Frank Deluca</p>
                        <p className="text-xs text-muted-foreground">Due June 18</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-muted-foreground">Schedule</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 11. Performance */}
              <Card className="shadow-sm border-border/60 bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="font-serif text-lg text-foreground">My Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Visits</p>
                      <p className="text-xl font-serif text-foreground">24</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">On-Time</p>
                      <p className="text-xl font-serif text-secondary">96%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xl font-serif text-foreground mr-1">4.8</p>
                        <Star className="w-3 h-3 fill-primary text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Resp. Time</p>
                      <p className="text-xl font-serif text-foreground">18m</p>
                    </div>
                  </div>
                  
                  <div className="h-[120px] w-full">
                    <p className="text-xs text-muted-foreground text-center mb-2">Visits This Week</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={WEEKLY_VISITS} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis hide />
                        <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>

        {/* 12. Quick Actions Bar (Sticky Bottom) */}
        <div className="sticky bottom-0 w-full bg-background border-t border-border p-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="shadow-sm" data-testid="btn-action-emergency">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Log Emergency
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Log Emergency</DialogTitle>
                  <DialogDescription>Record a critical incident. This will immediately notify the supervisor and family if applicable.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Client Involved</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select client..." /></SelectTrigger>
                      <SelectContent>
                        {CLIENTS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Incident Description</Label>
                    <Textarea placeholder="Describe what happened, actions taken, and current status..." className="h-32" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="destructive" onClick={() => toast({variant: "destructive", title: "Emergency Logged", description: "Supervisor has been notified immediately."})}>Submit Emergency Report</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="bg-accent/50 hover:bg-accent text-accent-foreground border-accent-foreground/20"
              onClick={() => toast({title: "Supervisor Notified", description: "A request has been sent to the on-call supervisor."})}
            >
              <Shield className="w-4 h-4 mr-2" /> Request Supervisor
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Truck className="w-4 h-4 mr-2 text-blue-500" /> Ambulance Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Medical Transport</DialogTitle>
                  <DialogDescription>Log a request for non-emergency or emergency ambulance transport.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select client..." /></SelectTrigger><SelectContent>{CLIENTS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Pickup Location</Label><Input placeholder="Client Home" /></div>
                    <div className="space-y-2"><Label>Destination</Label><Input placeholder="Hospital/Clinic Name" /></div>
                  </div>
                </div>
                <DialogFooter><Button onClick={() => toast({title: "Transport Requested", description: "Ambulance request logged and dispatched."})}>Confirm Request</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground ml-auto">
                  <FileInput className="w-4 h-4 mr-2" /> End Shift Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={(e) => { e.preventDefault(); toast({title: "Shift Report Submitted", description: "Thank you, Sarah. Have a good rest!"}); toggleShift(); }}>
                  <DialogHeader>
                    <DialogTitle>End of Shift Summary</DialogTitle>
                    <DialogDescription>Please provide a brief handover for the next shift.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-3 bg-muted/30 rounded-lg text-sm flex justify-between items-center">
                      <span className="text-muted-foreground">Visits Completed: <strong className="text-foreground">3/3</strong></span>
                      <span className="text-muted-foreground">Notes Logged: <strong className="text-foreground">5</strong></span>
                    </div>
                    <div className="space-y-2">
                      <Label>Handover Comments</Label>
                      <Textarea placeholder="Any specific instructions or things to watch for the next caregiver..." className="h-32" required />
                    </div>
                  </div>
                  <DialogFooter><Button type="submit">Submit & Clock Out</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </main>
    </div>
  );
}

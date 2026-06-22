import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  FileText, Download, Share2, Printer, ChevronDown, ChevronRight, 
  Calendar, Activity, Heart, Pill, User, Shield, FlaskConical, 
  Stethoscope, ClipboardList, CheckCircle, AlertTriangle, TrendingUp, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useListHealthReports, useCreateHealthReport, getListHealthReportsQueryKey, type HealthReport as ApiHealthReport } from "@workspace/api-client-react";

// --- MOCK DATA ---

const healthScoreData = [
  { month: 'Jan', score: 71 },
  { month: 'Feb', score: 73 },
  { month: 'Mar', score: 74 },
  { month: 'Apr', score: 76 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 82 },
];

const vitalsBpData = [
  { day: '1', sys: 122, dia: 79 },
  { day: '3', sys: 118, dia: 76 },
  { day: '6', sys: 124, dia: 80 },
  { day: '9', sys: 128, dia: 82 },
  { day: '11', sys: 120, dia: 78 },
  { day: '13', sys: 119, dia: 77 },
];

const vitalsHrData = [
  { day: '1', hr: 74 },
  { day: '3', hr: 72 },
  { day: '6', hr: 89 },
  { day: '9', hr: 68 },
  { day: '11', hr: 75 },
  { day: '13', hr: 72 },
];

const adherenceData = [
  { day: '1', percent: 100 },
  { day: '2', percent: 100 },
  { day: '3', percent: 100 },
  { day: '4', percent: 67 },
  { day: '5', percent: 100 },
  { day: '6', percent: 100 },
  { day: '7', percent: 33 },
  { day: '8', percent: 100 },
  { day: '9', percent: 67 },
  { day: '10', percent: 100 },
  { day: '11', percent: 100 },
  { day: '12', percent: 67 },
  { day: '13', percent: 100 },
];

const doctorReportsData = [
  { id: 1, doctor: "Dr. Priya Sharma", specialty: "Primary Care", date: "Jun 13, 2026", summary: "Routine monthly review. Good health, stable BP.", status: "Complete", notes: "Patient Margaret Chen presented in good overall health this month. Blood pressure readings remain within normal range. Slight improvements noted in mobility and energy levels.", vitals: "BP: 120/78, HR: 72, Temp: 98.4°F", instructions: "Continue current medication regimen. Monitor Metformin evening dose adherence." },
  { id: 2, doctor: "Dr. Robert Kim", specialty: "Cardiologist", date: "May 28, 2026", summary: "ECG within normal range. Continue current cardiac meds.", status: "Complete", notes: "ECG performed. No acute ischemic changes. Regular sinus rhythm.", vitals: "BP: 118/76, HR: 68", instructions: "Continue Atorvastatin. Follow up in 6 months." },
  { id: 3, doctor: "Dr. Priya Sharma", specialty: "Primary Care", date: "May 5, 2026", summary: "Slight fatigue reported. Iron levels borderline, supplement recommended.", status: "Complete", notes: "Patient reported fatigue in the afternoons. Ordered full blood panel.", vitals: "BP: 124/80, HR: 76", instructions: "Start OTC Iron supplement daily." },
  { id: 4, doctor: "Dr. Priya Sharma", specialty: "Primary Care", date: "Apr 7, 2026", summary: "All vitals normal. Routine check. No changes.", status: "Complete", notes: "Routine follow-up. Patient is stable and comfortable.", vitals: "BP: 122/79, HR: 74", instructions: "None." },
  { id: 5, doctor: "Dr. Robert Kim", specialty: "Cardiologist", date: "Mar 12, 2026", summary: "Annual cardiac review. Heart function excellent for age.", status: "Complete", notes: "Annual review. Echocardiogram shows normal LV function.", vitals: "BP: 120/80, HR: 70", instructions: "Maintain low sodium diet." },
  { id: 6, doctor: "Dr. Priya Sharma", specialty: "Primary Care", date: "Feb 10, 2026", summary: "Winter health check. Minor cold recovered. All clear.", status: "Complete", notes: "Recovering well from minor URI. Lungs clear.", vitals: "BP: 126/82, HR: 78", instructions: "Stay hydrated." },
];

const caregiverNotesData = [
  { id: 1, name: "Sarah Mitchell", role: "Primary Care Manager", date: "Jun 13, 2026", duration: "3 hrs", type: "Routine", vitals: true, note: "Margaret is in great spirits. Completed all morning exercises. Requested more puzzles. Had a good lunch." },
  { id: 2, name: "Sarah Mitchell", role: "Primary Care Manager", date: "Jun 11, 2026", duration: "2 hrs", type: "Follow-up", vitals: true, note: "BP slightly elevated this visit (128/82). Advised rest. Notified Dr. Sharma. She rested in the afternoon." },
  { id: 3, name: "Sarah Mitchell", role: "Primary Care Manager", date: "Jun 9, 2026", duration: "3 hrs", type: "Routine", vitals: true, note: "Completed chair exercises and morning yoga. Excellent mood. We watered the plants together." },
  { id: 4, name: "James Okafor", role: "Substitute Caregiver", date: "Jun 5, 2026", duration: "4 hrs", type: "Routine", vitals: true, note: "Covered for Sarah. All vitals normal. Client comfortable. Prepared dinner." },
  { id: 5, name: "Sarah Mitchell", role: "Primary Care Manager", date: "Jun 3, 2026", duration: "2.5 hrs", type: "Routine", vitals: true, note: "Routine check. Margaret was a bit tired today, skipped yoga but did chair exercises." },
  { id: 6, name: "Sarah Mitchell", role: "Primary Care Manager", date: "Jun 1, 2026", duration: "3 hrs", type: "Routine", vitals: true, note: "Start of the month review. Sorted medications into the weekly pill box. All good." },
  { id: 7, name: "James Okafor", role: "Substitute Caregiver", date: "May 29, 2026", duration: "3 hrs", type: "Routine", vitals: true, note: "Margaret enjoyed the afternoon music therapy session." },
  { id: 8, name: "Sarah Mitchell", role: "Primary Care Manager", date: "May 27, 2026", duration: "2 hrs", type: "Routine", vitals: true, note: "Accompanied Margaret to Cardiology appointment." },
];

export default function HealthReportsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Prefer live reports; retain mock records when the collection is empty.
  const { data: apiReports = [] } = useListHealthReports();
  
  // Use API data or fall back to mock
  const displayReports = apiReports.length > 0 ? apiReports : doctorReportsData;

  const [activeView, setActiveView] = useState("overview"); // overview, monthly, doctor, lab, caregiver, vaccination
  const [activeMonth, setActiveMonth] = useState("Jun");
  const [dateFilter, setDateFilter] = useState("This Month"); // This Month, Last 3 Months, Last 6 Months, This Year
  const [typeFilter, setTypeFilter] = useState("All"); // All, Medical, Caregiver, Lab, Vaccination
  const [caregiverFilter, setCaregiverFilter] = useState("All Caregivers");

  const handleAction = (message: string) => {
    toast({
      title: "Action triggered",
      description: message,
    });
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
    { id: "monthly", label: "Monthly Reports", icon: <Calendar className="w-4 h-4" /> },
    { id: "doctor", label: "Doctor Reports", icon: <Stethoscope className="w-4 h-4" /> },
    { id: "lab", label: "Lab Results", icon: <FlaskConical className="w-4 h-4" /> },
    { id: "caregiver", label: "Caregiver Notes", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "vaccination", label: "Vaccination Records", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Reports</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-card rounded-full border-border shadow-sm h-10 px-4">
                <Avatar className="w-6 h-6 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">MC</AvatarFallback>
                </Avatar>
                <span className="font-medium">Margaret Chen</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="px-3 py-2 flex items-center gap-3 border-b border-border mb-1">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary">MC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Margaret Chen</p>
                  <p className="text-xs text-muted-foreground">Age: 74 • ID: BF-00412</p>
                </div>
              </div>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" /> View Full Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground">
                Switch Patient...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 shadow-sm"
            onClick={() => handleAction("Opening report generator...")}
            data-testid="btn-generate-report"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[260px] border-r border-border bg-sidebar/50 hidden lg:flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Report Navigator</h2>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeView === item.id 
                          ? "bg-primary/10 text-primary border-l-2 border-primary" 
                          : "text-foreground/80 hover:bg-muted hover:text-foreground border-l-2 border-transparent"
                      }`}
                      data-testid={`nav-${item.id}`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                    
                    {/* Expandable months for Monthly Reports */}
                    {item.id === "monthly" && activeView === "monthly" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="ml-9 mt-1 space-y-1 overflow-hidden"
                      >
                        {["Jun", "May", "Apr", "Mar", "Feb", "Jan"].map(m => (
                          <button
                            key={m}
                            onClick={() => setActiveMonth(m)}
                            className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                              activeMonth === m ? "bg-card shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {m} 2026
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-8">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Quick Filters</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Timeframe</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["This Month", "Last 3 Months", "Last 6 Months", "This Year"].map(range => (
                        <Badge 
                          key={range}
                          variant={dateFilter === range ? "default" : "outline"}
                          className={`cursor-pointer ${dateFilter === range ? 'bg-primary/20 text-primary hover:bg-primary/30 border-transparent' : 'hover:bg-muted font-normal text-muted-foreground'}`}
                          onClick={() => setDateFilter(range)}
                        >
                          {range}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Type</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["All", "Medical", "Caregiver", "Lab", "Vaccination"].map(t => (
                        <Badge 
                          key={t}
                          variant={typeFilter === t ? "default" : "outline"}
                          className={`cursor-pointer ${typeFilter === t ? 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 border-transparent' : 'hover:bg-muted font-normal text-muted-foreground'}`}
                          onClick={() => setTypeFilter(t)}
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t border-border bg-sidebar">
            <Button 
              variant="outline" 
              className="w-full justify-center shadow-sm"
              onClick={() => handleAction("Preparing archive for download...")}
              data-testid="btn-download-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </aside>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden border-b border-border bg-card">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                    activeView === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
            
            {/* VIEW 1: OVERVIEW */}
            {activeView === "overview" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-serif text-foreground">Health Overview</h1>
                      <p className="text-muted-foreground mt-1">Snapshot of Margaret's health and recent activity.</p>
                    </div>
                  </div>

                  {/* Health Score Chart */}
                  <Card className="shadow-sm border-border overflow-hidden">
                    <CardHeader className="pb-2 bg-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-serif text-xl flex items-center gap-2">
                            <Heart className="w-5 h-5 text-primary" />
                            Health Score Trend — 2026
                          </CardTitle>
                          <CardDescription>Avg: 75.8 | Trend: ↑ improving</CardDescription>
                        </div>
                        <Badge className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 border-transparent">
                          Improving
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={healthScoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                            <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}
                              formatter={(value) => [`${value} pts`, 'Score']}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3}
                              dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }}
                              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Reports", value: "24", icon: <FileText className="w-4 h-4 text-muted-foreground" /> },
                      { label: "Doctor Visits", value: "6", icon: <Stethoscope className="w-4 h-4 text-muted-foreground" /> },
                      { label: "Lab Tests", value: "4", icon: <FlaskConical className="w-4 h-4 text-muted-foreground" /> },
                      { label: "Caregiver Visits", value: "48", icon: <User className="w-4 h-4 text-muted-foreground" /> },
                    ].map((stat, i) => (
                      <Card key={i} className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col justify-center h-full">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                            {stat.icon}
                          </div>
                          <span className="text-2xl font-serif">{stat.value}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Recent Reports */}
                    <Card className="md:col-span-2 shadow-sm border-border">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-serif text-lg">Recent Reports</CardTitle>
                          <Button variant="ghost" size="sm" className="text-primary h-8" onClick={() => setActiveView("monthly")}>View All</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { title: "Monthly Health Summary", desc: "June 2026", date: "Jun 13", doctor: "Dr. Priya Sharma", type: "summary", status: "Complete" },
                            { title: "Blood Test Results", desc: "Full Panel — Lab Corp", date: "Jun 5", doctor: "Dr. Priya Sharma", type: "lab", status: "Complete" },
                            { title: "Cardiology Follow-up Notes", desc: "Routine check", date: "May 28", doctor: "Dr. Robert Kim", type: "doctor", status: "Complete" },
                            { title: "Monthly Health Summary", desc: "May 2026", date: "May 31", doctor: "Dr. Priya Sharma", type: "summary", status: "Complete" },
                            { title: "Physiotherapy Assessment", desc: "Mobility review", date: "May 20", doctor: "Sarah Mitchell", type: "caregiver", status: "Complete" },
                            { title: "ECG Report", desc: "City Medical Center", date: "Apr 18", doctor: "Dr. Robert Kim", type: "lab", status: "Complete" },
                          ].map((rep, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  rep.type === 'summary' ? 'bg-primary/10 text-primary' : 
                                  rep.type === 'lab' ? 'bg-blue-500/10 text-blue-500' : 
                                  rep.type === 'doctor' ? 'bg-secondary/10 text-secondary-foreground' : 
                                  'bg-primary/10 text-primary'
                                }`}>
                                  {rep.type === 'summary' ? <Activity className="w-5 h-5" /> : 
                                   rep.type === 'lab' ? <FlaskConical className="w-5 h-5" /> : 
                                   rep.type === 'doctor' ? <Stethoscope className="w-5 h-5" /> : 
                                   <User className="w-5 h-5" />}
                                </div>
                                <div className="truncate pr-4">
                                  <h4 className="text-sm font-medium text-foreground truncate">{rep.title}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{rep.desc} • {rep.date} • {rep.doctor}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant="outline" className="hidden sm:inline-flex bg-green-500/10 text-green-700 border-transparent text-[10px] uppercase font-bold tracking-wider">
                                  {rep.status}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleAction(`Opening ${rep.title}...`)}>
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleAction("Download started")}>
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upcoming Reports */}
                    <Card className="shadow-sm border-border bg-accent/30 border-accent h-fit">
                      <CardHeader>
                        <CardTitle className="font-serif text-lg flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Upcoming Action
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium">Dental Examination</h4>
                              <Badge variant="destructive" className="text-[10px]">Overdue</Badge>
                            </div>
                            <Button size="sm" variant="destructive" className="w-full mt-2 h-8 text-xs" onClick={() => handleAction("Opening scheduler...")}>Schedule Now</Button>
                          </div>
                          
                          <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium">Quarterly Blood Panel</h4>
                              <span className="text-xs text-muted-foreground">Due Jul 1</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full mt-2 h-8 text-xs" onClick={() => handleAction("Opening scheduler...")}>Schedule</Button>
                          </div>

                          <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium">Annual Wellness</h4>
                              <span className="text-xs text-muted-foreground">Due Jul 15</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full mt-2 h-8 text-xs" onClick={() => handleAction("Opening scheduler...")}>Schedule</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* VIEW 2: MONTHLY REPORTS */}
            {activeView === "monthly" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Month Tabs */}
                  <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
                    {["Jun", "May", "Apr", "Mar", "Feb", "Jan"].map(m => (
                      <Button
                        key={m}
                        variant={activeMonth === m ? "default" : "outline"}
                        className={`rounded-full shadow-sm ${activeMonth === m ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
                        onClick={() => setActiveMonth(m)}
                      >
                        {m} 2026
                      </Button>
                    ))}
                  </div>

                  {/* Header Card */}
                  <Card className="shadow-sm border-border bg-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent mb-3">Official Report</Badge>
                          <h1 className="text-3xl font-serif text-foreground mb-4">Monthly Health Summary — {activeMonth} 2026</h1>
                          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                            <p><strong className="text-foreground font-medium">Patient:</strong> Margaret Chen</p>
                            <p><strong className="text-foreground font-medium">DOB:</strong> March 12, 1952</p>
                            <p><strong className="text-foreground font-medium">Generated:</strong> {activeMonth} 13, 2026</p>
                            <p><strong className="text-foreground font-medium">Doctor:</strong> Dr. Priya Sharma</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                          <Button variant="outline" size="sm" onClick={() => handleAction("Printing...")}>
                            <Printer className="w-4 h-4 mr-2" /> Print
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAction("Downloading PDF...")}>
                            <Download className="w-4 h-4 mr-2" /> PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAction("Share link copied")}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Overall Score */}
                    <Card className="shadow-sm border-border flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="font-serif text-lg mb-1">Health Score</h3>
                      <p className="text-sm text-muted-foreground mb-6">Overall wellness metric</p>
                      
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-muted stroke-current"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-primary stroke-current"
                            strokeWidth="3"
                            strokeDasharray={`${82}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-serif text-foreground">82</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">/ 100</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-2">
                        <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-transparent">Good</Badge>
                        <span className="text-sm font-medium text-green-700 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> +3 pts
                        </span>
                      </div>
                    </Card>

                    {/* Vitals Summary */}
                    <Card className="md:col-span-2 shadow-sm border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="font-serif text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          Vitals Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="font-medium text-foreground">Vital</TableHead>
                                <TableHead>Latest</TableHead>
                                <TableHead>Average</TableHead>
                                <TableHead className="hidden sm:table-cell">Range</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[
                                { name: "Blood Pressure", latest: "120/78", avg: "122/79", range: "118-128", status: "Normal" },
                                { name: "Heart Rate", latest: "72 bpm", avg: "74 bpm", range: "68-89", status: "Normal" },
                                { name: "Blood Glucose", latest: "95 mg/dL", avg: "97 mg/dL", range: "88-108", status: "Normal" },
                                { name: "Weight", latest: "62 kg", avg: "62.1 kg", range: "61.8-62.4", status: "Stable" },
                                { name: "Temperature", latest: "98.4°F", avg: "98.5°F", range: "98.2-98.8", status: "Normal" },
                                { name: "SpO2", latest: "98%", avg: "97.8%", range: "96-99%", status: "Normal" },
                              ].map((row, i) => (
                                <TableRow key={i} className="border-border">
                                  <TableCell className="font-medium">{row.name}</TableCell>
                                  <TableCell>{row.latest}</TableCell>
                                  <TableCell className="text-muted-foreground">{row.avg}</TableCell>
                                  <TableCell className="text-muted-foreground hidden sm:table-cell">{row.range}</TableCell>
                                  <TableCell className="text-right">
                                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">
                                      <CheckCircle className="w-3 h-3 mr-1" /> {row.status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-sm border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Blood Pressure Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalsBpData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                              <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                              <Line type="monotone" dataKey="sys" name="Systolic" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                              <Line type="monotone" dataKey="dia" name="Diastolic" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalsHrData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                              <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                              <Line type="monotone" dataKey="hr" name="Heart Rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Doctor's Summary */}
                  <Card className="shadow-sm border-border bg-white">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg mb-1 text-foreground">Physician's Summary</h3>
                          <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed mb-4">
                            <p className="italic text-base font-serif text-foreground/90">
                              "Patient Margaret Chen presented in good overall health this month. Blood pressure readings remain within normal range. Slight improvements noted in mobility and energy levels. Recommend continuing current medication regimen. Monitor Metformin evening dose adherence — consider a reminder system."
                            </p>
                          </div>
                          <p className="text-sm font-medium">— Dr. Priya Sharma, MD | Primary Care Physician | June 13, 2026</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Medication Adherence */}
                  <Card className="shadow-sm border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-serif text-lg flex items-center gap-2">
                          <Pill className="w-5 h-5 text-primary" />
                          Medication Adherence
                        </CardTitle>
                        <div className="text-right">
                          <span className="text-2xl font-serif text-primary">87%</span>
                          <span className="text-xs text-muted-foreground block">Overall Adherence</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[120px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={adherenceData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                            <YAxis domain={[0, 100]} hide />
                            <RechartsTooltip 
                              cursor={{ fill: 'transparent' }}
                              contentStyle={{ borderRadius: '8px', fontSize: '12px', padding: '4px 8px' }}
                              formatter={(value) => [`${value}%`, 'Adherence']}
                              labelFormatter={(label) => `Day ${label}`}
                            />
                            <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                              {adherenceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.percent === 100 ? 'hsl(var(--secondary))' : entry.percent > 50 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border">
                              <TableHead>Medication</TableHead>
                              <TableHead>Dose & Time</TableHead>
                              <TableHead>Adherence</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { med: "Lisinopril", dose: "10mg (Morning)", adh: "100%", status: "good", notes: "—" },
                              { med: "Atorvastatin", dose: "20mg (Morning)", adh: "100%", status: "good", notes: "—" },
                              { med: "Metformin", dose: "40mg (Evening)", adh: "62%", status: "warn", notes: "Frequently missed evening dose" },
                            ].map((row, i) => (
                              <TableRow key={i} className="border-border">
                                <TableCell className="font-medium">{row.med}</TableCell>
                                <TableCell className="text-muted-foreground">{row.dose}</TableCell>
                                <TableCell>
                                  <span className={`font-medium ${row.status === 'good' ? 'text-green-600' : 'text-primary'}`}>
                                    {row.adh}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{row.notes}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}

            {/* VIEW 3: DOCTOR REPORTS */}
            {activeView === "doctor" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-serif text-foreground">Doctor Reports</h1>
                      <p className="text-muted-foreground mt-1">Clinical notes and appointment summaries.</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {doctorReportsData.map((report) => (
                      <AccordionItem key={report.id} value={`item-${report.id}`} className="bg-card border border-border rounded-xl px-4 overflow-hidden shadow-sm">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-2">
                            <div className="flex items-center gap-4 text-left">
                              <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary-foreground flex items-center justify-center flex-shrink-0">
                                <Stethoscope className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-serif text-base font-medium text-foreground">{report.doctor}</h3>
                                <p className="text-xs text-muted-foreground">{report.specialty} • {report.date}</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right flex-1 sm:ml-8 truncate">
                              <p className="text-sm text-muted-foreground truncate">{report.summary}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6">
                          <div className="pl-14 pr-4 border-t border-border/50 pt-4 space-y-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Clinical Notes</h4>
                              <p className="text-sm text-foreground/90 leading-relaxed">{report.notes}</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="bg-muted/30 p-3 rounded-lg border border-border">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Vitals Recorded</h4>
                                <p className="text-sm font-medium">{report.vitals}</p>
                              </div>
                              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Instructions</h4>
                                <p className="text-sm text-primary-foreground/90 font-medium">{report.instructions}</p>
                              </div>
                            </div>
                            <div className="pt-2">
                              <Button variant="outline" size="sm" onClick={() => handleAction("Downloading full report...")}>
                                <Download className="w-4 h-4 mr-2" /> Download Full Report
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </AnimatePresence>
            )}

            {/* VIEW 4: LAB RESULTS */}
            {activeView === "lab" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-serif text-foreground">Lab Results</h1>
                      <p className="text-muted-foreground mt-1">Test results and pathology reports.</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3 text-primary">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                    <div>
                      <h4 className="font-medium">Action Required</h4>
                      <p className="text-sm opacity-90 mt-1">2 values require attention: HbA1c and LDL in the latest panel. Dr. Sharma has been notified and will discuss at next visit.</p>
                    </div>
                  </div>

                  <Accordion type="single" defaultValue="item-1" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="bg-card border border-border rounded-xl px-2 sm:px-4 overflow-hidden shadow-sm">
                      <AccordionTrigger className="hover:no-underline py-4 px-2">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <FlaskConical className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-medium text-foreground">Blood Panel — Full Profile</h3>
                            <p className="text-xs text-muted-foreground">Lab Corp • Jun 5, 2026</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="overflow-x-auto border-t border-border pt-2">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border">
                                <TableHead>Test</TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead className="hidden sm:table-cell">Reference Range</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[
                                { test: "Haemoglobin", res: "12.8 g/dL", range: "12.0–16.0", stat: "Normal" },
                                { test: "White Blood Cells", res: "6.2 K/uL", range: "4.5–11.0", stat: "Normal" },
                                { test: "Platelets", res: "210 K/uL", range: "150–400", stat: "Normal" },
                                { test: "Fasting Glucose", res: "95 mg/dL", range: "70–100", stat: "Normal" },
                                { test: "HbA1c", res: "6.2%", range: "<5.7%", stat: "Borderline" },
                                { test: "Cholesterol Total", res: "188 mg/dL", range: "<200", stat: "Normal" },
                                { test: "LDL", res: "112 mg/dL", range: "<100", stat: "Borderline" },
                                { test: "HDL", res: "54 mg/dL", range: ">40", stat: "Normal" },
                                { test: "Triglycerides", res: "142 mg/dL", range: "<150", stat: "Normal" },
                                { test: "Creatinine", res: "0.9 mg/dL", range: "0.6–1.1", stat: "Normal" },
                                { test: "eGFR", res: "72 mL/min", range: ">60", stat: "Normal" },
                              ].map((row, i) => (
                                <TableRow key={i} className="border-border">
                                  <TableCell className="font-medium">{row.test}</TableCell>
                                  <TableCell>{row.res}</TableCell>
                                  <TableCell className="text-muted-foreground hidden sm:table-cell">{row.range}</TableCell>
                                  <TableCell className="text-right">
                                    <Badge variant="outline" className={`border-transparent ${
                                      row.stat === 'Normal' ? 'bg-green-50 text-green-700' : 'bg-primary/10 text-primary'
                                    }`}>
                                      {row.stat}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="mt-4 px-2">
                            <Button variant="outline" size="sm" onClick={() => handleAction("Downloading lab report...")}>
                              <Download className="w-4 h-4 mr-2" /> Download Original PDF
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="bg-card border border-border rounded-xl px-4 overflow-hidden shadow-sm">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                            <FlaskConical className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-medium text-foreground">Blood Panel</h3>
                            <p className="text-xs text-muted-foreground">Lab Corp • Feb 10, 2026</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground py-4 text-center">All values within normal ranges.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </AnimatePresence>
            )}

            {/* VIEW 5: CAREGIVER NOTES */}
            {activeView === "caregiver" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-serif text-foreground">Caregiver Notes</h1>
                      <p className="text-muted-foreground mt-1">Daily logs from the care team.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {["All Caregivers", "Sarah Mitchell", "James Okafor"].map(f => (
                      <Badge 
                        key={f}
                        variant={caregiverFilter === f ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1 text-sm ${caregiverFilter === f ? 'bg-secondary text-secondary-foreground border-transparent' : 'bg-card text-muted-foreground hover:bg-muted font-normal'}`}
                        onClick={() => setCaregiverFilter(f)}
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {caregiverNotesData
                      .filter(note => caregiverFilter === "All Caregivers" || note.name === caregiverFilter)
                      .map((note) => (
                      <Card key={note.id} className="shadow-sm border-border bg-card">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border border-border">
                                <AvatarFallback className="bg-accent text-accent-foreground font-medium">
                                  {note.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-foreground">{note.name}</h4>
                                <p className="text-xs text-muted-foreground">{note.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium block">{note.date}</span>
                              <span className="text-xs text-muted-foreground">{note.duration} • {note.type}</span>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 mb-4">
                            <p className="text-sm text-foreground/90 leading-relaxed">{note.note}</p>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              {note.vitals && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-transparent text-xs font-normal">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Vitals Recorded
                                </Badge>
                              )}
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-primary h-8">Add Response</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Add Response</DialogTitle>
                                  <DialogDescription>
                                    Your response will be visible to the care team.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea placeholder="Type your response here..." className="min-h-[100px]" />
                                </div>
                                <DialogFooter>
                                  <Button type="submit" onClick={() => handleAction("Response saved")}>Save Response</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* VIEW 6: VACCINATION */}
            {activeView === "vaccination" && (
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-serif text-foreground">Vaccination Records</h1>
                      <p className="text-muted-foreground mt-1">Immunization history and schedule.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleAction("Downloading record...")}>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>

                  <Card className="shadow-sm border-border">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="border-border">
                              <TableHead className="font-medium text-foreground py-4">Vaccine</TableHead>
                              <TableHead>Date Given</TableHead>
                              <TableHead className="hidden sm:table-cell">Next Due</TableHead>
                              <TableHead className="hidden md:table-cell">Provider</TableHead>
                              <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { vax: "Influenza (Flu Shot)", given: "Oct 15, 2025", due: "Oct 2026", prov: "Dr. Priya Sharma", stat: "Up to Date" },
                              { vax: "COVID-19 Booster", given: "Nov 2, 2025", due: "May 2026", prov: "City Clinic", stat: "Due Now" },
                              { vax: "Pneumococcal (PCV15)", given: "Mar 8, 2023", due: "—", prov: "City Clinic", stat: "Complete" },
                              { vax: "Shingles (Shingrix 1)", given: "Jan 14, 2024", due: "—", prov: "Dr. Priya Sharma", stat: "Complete" },
                              { vax: "Shingles (Shingrix 2)", given: "Mar 18, 2024", due: "—", prov: "Dr. Priya Sharma", stat: "Complete" },
                              { vax: "Tdap (Tetanus)", given: "Sep 5, 2019", due: "Sep 2029", prov: "City Clinic", stat: "Up to Date" },
                            ].map((row, i) => (
                              <TableRow key={i} className="border-border">
                                <TableCell className="font-medium">{row.vax}</TableCell>
                                <TableCell>{row.given}</TableCell>
                                <TableCell className="text-muted-foreground hidden sm:table-cell">{row.due}</TableCell>
                                <TableCell className="text-muted-foreground hidden md:table-cell">{row.prov}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant="outline" className={`border-transparent ${
                                    row.stat === 'Due Now' ? 'bg-primary/10 text-primary' : 'bg-green-50 text-green-700'
                                  }`}>
                                    {row.stat}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border bg-accent/30 border-accent">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-serif text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Recommended
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/80 mb-4">Based on CDC guidelines for age 74, the following vaccines are recommended but not currently on record:</p>
                      <div className="bg-card p-3 rounded-lg border border-border inline-flex items-center gap-3 pr-6">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-sm">RSV (Respiratory Syncytial Virus)</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

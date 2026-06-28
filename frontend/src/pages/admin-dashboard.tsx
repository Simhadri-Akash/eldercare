import { useState } from "react";
import { Link } from "wouter";

import {
  Heart,
  Users,
  Activity,
  AlertTriangle,
  Search,
  Download,
  ArrowUpRight,
  Bell,
  FileText,
  CheckCircle,
  Settings,
  LogOut,
  Plus,
  Calendar as CalendarIcon,
  Star,
  Menu,
  X,
  Calendar,
  MessageSquare,
  BarChart3,
  ShieldCheck
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const revenueData = [
  { name: "Jan", revenue: 38000 },
  { name: "Feb", revenue: 41000 },
  { name: "Mar", revenue: 39000 },
  { name: "Apr", revenue: 43000 },
  { name: "May", revenue: 44000 },
  { name: "Jun", revenue: 48200 },
];

const satisfactionData = [
  { name: "Jan", sarah: 4.7, james: 4.4, maria: 4.8 },
  { name: "Feb", sarah: 4.7, james: 4.5, maria: 4.9 },
  { name: "Mar", sarah: 4.8, james: 4.5, maria: 4.9 },
  { name: "Apr", sarah: 4.8, james: 4.6, maria: 4.9 },
  { name: "May", sarah: 4.9, james: 4.6, maria: 4.9 },
  { name: "Jun", sarah: 4.8, james: 4.6, maria: 4.9 },
];

const planTiersData = [
  { name: "Premium", value: 14, color: "hsl(var(--primary))" },
  { name: "Standard", value: 12, color: "hsl(var(--secondary))" },
  { name: "Basic", value: 6, color: "hsl(var(--muted-foreground))" },
];

const allClients = [
  { id: 1, name: "Margaret Chen", age: 74, caregiver: "Sarah Mitchell", score: 82, plan: "Premium", status: "Active", fee: "$1,800", date: "Mar 2025" },
  { id: 2, name: "Harold Brooks", age: 81, caregiver: "Sarah Mitchell", score: 67, plan: "Standard", status: "Active", fee: "$1,200", date: "Jan 2025" },
  { id: 3, name: "Dorothy Simmons", age: 78, caregiver: "Sarah Mitchell", score: 88, plan: "Premium", status: "Active", fee: "$1,800", date: "Jun 2024" },
  { id: 4, name: "Walter Nguyen", age: 85, caregiver: "Sarah Mitchell", score: 45, plan: "Premium", status: "Active", fee: "$1,800", date: "Sep 2024" },
  { id: 5, name: "Evelyn Ross", age: 72, caregiver: "James Okafor", score: 79, plan: "Standard", status: "Active", fee: "$1,200", date: "Feb 2025" },
  { id: 6, name: "Frank Deluca", age: 80, caregiver: "James Okafor", score: 71, plan: "Basic", status: "Active", fee: "$900", date: "Apr 2025" },
  { id: 7, name: "Ruth Harmon", age: 77, caregiver: "Maria Santos", score: 84, plan: "Premium", status: "Active", fee: "$1,800", date: "Nov 2024" },
  { id: 8, name: "George Flynn", age: 83, caregiver: "Maria Santos", score: 58, plan: "Standard", status: "On Hold", fee: "$0", date: "Jul 2024" },
  { id: 9, name: "Robert Taylor", age: 79, caregiver: "Kevin Park", score: 75, plan: "Basic", status: "Active", fee: "$900", date: "May 2025" },
  { id: 10, name: "Alice Jenkins", age: 88, caregiver: "Tom Bradley", score: 81, plan: "Standard", status: "Active", fee: "$1,200", date: "Oct 2024" },
];

const caregivers = [
  { id: 1, name: "Sarah Mitchell", role: "Sr. Care Manager", clients: 6, visits: 24, score: 74, onTime: "96%", rating: 4.8, status: "On Shift" },
  { id: 2, name: "James Okafor", role: "Care Manager", clients: 5, visits: 20, score: 76, onTime: "92%", rating: 4.6, status: "On Shift" },
  { id: 3, name: "Maria Santos", role: "Care Manager", clients: 6, visits: 22, score: 80, onTime: "98%", rating: 4.9, status: "On Shift" },
  { id: 4, name: "Kevin Park", role: "Jr. Care Manager", clients: 4, visits: 15, score: 68, onTime: "88%", rating: 4.2, status: "Off Shift" },
  { id: 5, name: "Anita Rao", role: "Sr. Care Manager", clients: 5, visits: 21, score: 82, onTime: "97%", rating: 4.7, status: "Leave" },
  { id: 6, name: "Tom Bradley", role: "Care Manager", clients: 6, visits: 19, score: 71, onTime: "90%", rating: 4.4, status: "On Shift" },
];

const alertsData = [
  { id: 1, type: "critical", title: "Walter Nguyen (Sarah Mitchell) — Health score 45, declining", time: "3 hrs ago" },
  { id: 2, type: "warning", title: "George Flynn — Care plan overdue 5 days", time: "Yesterday" },
  { id: 3, type: "warning", title: "Harold Brooks — Missed 2 physio sessions", time: "2 days ago" },
  { id: 4, type: "info", title: "4 invoices outstanding — Finance", time: "Today" },
  { id: 5, type: "info", title: "Kevin Park — On leave June 13–16 — Coverage needed", time: "Today" },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [showAllClients, setShowAllClients] = useState(false);
  const [alerts, setAlerts] = useState(alertsData);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Computed state
  const filteredClients = allClients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.caregiver.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  const displayedClients = showAllClients ? filteredClients : filteredClients.slice(0, 8);

  const resolveAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast({
      title: "Alert marked resolved",
      description: "The alert has been removed from your feed.",
    });
  };

  const movePipelineStage = (name: string, stage: string) => {
    toast({
      title: `Moved to ${stage}`,
      description: `${name} has been updated in the pipeline.`,
    });
  };

  const fillGap = () => {
    toast({
      title: "Shift posted to available caregivers",
      description: "You will be notified when coverage is confirmed.",
    });
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddClientModalOpen(false);
    toast({
      title: "New client added",
      description: "The client profile has been created successfully.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-secondary/20 text-secondary border-secondary/30";
    if (score >= 60) return "bg-primary/20 text-primary border-primary/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

 const Sidebar = () => (
  <div className="h-screen w-[320px] border-r border-sidebar-border bg-sidebar flex flex-col">

    {/* Logo */}
    <div className="p-6">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/befine-logo.jpeg"
          alt="Befine"
          className="h-9 object-contain"
        />
      </Link>
    </div>

    {/* Profile */}
    <div className="px-6 pb-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage
            src="https://i.pravatar.cc/150?u=diane"
            alt="Diane Foster"
          />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>

        <div>
          <p className="font-medium">Diane Foster</p>
          <p className="text-sm text-muted-foreground">
            Operations Director
          </p>
        </div>
      </div>
    </div>

    {/* Menu */}
    <div className="flex-1 px-6">
      <nav className="space-y-2">
      <Link href="/admin-dashboard">
        <Button variant="secondary" className="w-full justify-start">
          <Activity className="w-4 h-4 mr-3" />
          Overview
        </Button>
      </Link>
      <Link href="/clients">
        <Button variant="ghost" className="w-full justify-start">
          <Users className="w-4 h-4 mr-3" />
          Clients
        </Button>
      </Link>
      <Link href="/care-team">
        <Button variant="ghost" className="w-full justify-start">
          <Heart className="w-4 h-4 mr-3" />
          Caregivers
        </Button>
      </Link>
      <Link href="/appointments">
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="w-4 h-4 mr-3" />
          Appointments
        </Button>
      </Link>
      <Link href="/health-reports">
        <Button variant="ghost" className="w-full justify-start">
          <ShieldCheck className="w-4 h-4 mr-3" />
          Health Reports
        </Button>
      </Link>
      <Link href="/messages">
        <Button variant="ghost" className="w-full justify-start">
          <MessageSquare className="w-4 h-4 mr-3" />
          Messages
        </Button>
      </Link>
      <Link href="/notifications">
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="w-4 h-4 mr-3" />
          Notifications
        </Button>
      </Link>
      <Link href="/analytics">
        <Button variant="ghost" className="w-full justify-start">
          <BarChart3 className="w-4 h-4 mr-3" />
          Analytics
        </Button>
      </Link>
      <Link href="/billing">
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-3" />
          Billing
        </Button>
      </Link>
      <Link href="/compliance">
        <Button variant="ghost" className="w-full justify-start">
          <CheckCircle className="w-4 h-4 mr-3" />
          Compliance
        </Button>
      </Link>
      </nav>
    </div>

    {/* Bottom Section */}
    <div className="p-6 border-t">
    <Link href="/settings">
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
      >
        <Settings className="w-4 h-4 mr-3" />
        Settings
      </Button>
    </Link>
    <Link href="/">
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-600"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Log Out
      </Button>
    </Link>
    </div>

  </div>
);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b border-border p-4 md:px-8 md:py-6 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-medium">Operations Overview</h1>
              <div className="flex gap-3 mt-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>

                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Assign Caregiver
                </Button>

                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>

                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <CalendarIcon className="w-3.5 h-3.5" /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                <span className="text-border mx-1">|</span>
                32 active clients · 12 caregivers
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hidden md:flex" data-testid="btn-export-report">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </header>

        {/* Scrollable Dashboard Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24">
            
            {/* 1. KPI Row */}
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Active</p>
                  <p className="text-3xl font-serif" data-testid="kpi-total-active">32</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">On Duty</p>
                  <p className="text-3xl font-serif" data-testid="kpi-on-duty">8 <span className="text-lg text-muted-foreground">/ 12</span></p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">New This Month</p>
                  <p className="text-3xl font-serif" data-testid="kpi-new-clients">5</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Revenue</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-serif" data-testid="kpi-revenue">$48.2k</p>
                    <span className="text-xs font-medium text-secondary flex items-center bg-secondary/10 px-1.5 py-0.5 rounded">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-primary/20 bg-primary/5">
                <CardContent className="p-4 md:p-6">
                  <p className="text-sm font-medium text-primary mb-1">Open Alerts</p>
                  <p className="text-3xl font-serif text-primary" data-testid="kpi-open-alerts">{alerts.length}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-3">
                <Button>Add Client</Button>
                <Button>Add Caregiver</Button>
                <Button>Schedule Visit</Button>
                <Button>Generate Invoice</Button>
                <Button>Send Alert</Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-[2fr_1fr] gap-8">
              {/* Left Column (2/3 width) */}
              <div className="md:col-span-2 space-y-8">
                
                {/* 2. Org Health Overview */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif">Organisation Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center divide-x divide-border">
                      <div className="px-2">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" strokeDasharray={`${76 * 2.51} 251`} strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">76</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-1">Client Health Avg</p>
                        <p className="text-xs text-secondary font-medium">↑ 3pts</p>
                      </div>
                      
                      <div className="px-2">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-secondary" strokeDasharray={`${89 * 2.51} 251`} strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">89%</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-1">Medication Adherence</p>
                        <p className="text-xs text-secondary font-medium">↑ 1%</p>
                      </div>

                      <div className="px-2">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-primary" strokeDasharray={`${78 * 2.51} 251`} strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">78%</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-1">Caregiver Utilisation</p>
                        <p className="text-xs text-primary font-medium">↓ 2%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Revenue & Billing */}
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="font-serif">Revenue Trend</CardTitle>
                      <CardDescription>Jan - Jun 2026</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value/1000}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground">Outstanding Invoices</p>
                          <p className="font-medium">4 <span className="text-muted-foreground font-normal">($3,200 total)</span></p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Overdue Payments</p>
                          <p className="font-medium text-destructive">1 <span className="text-muted-foreground font-normal">($800)</span></p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" data-testid="btn-view-invoices">View Invoices</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 4. Client Roster */}
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-serif">Client Roster</CardTitle>
                      <CardDescription>Directory of all active and pending clients</CardDescription>
                    </div>
                    <Dialog open={isAddClientModalOpen} onOpenChange={setIsAddClientModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="btn-add-client">
                          <Plus className="w-4 h-4 mr-2" /> Add New Client
                        </Button>
                      </DialogTrigger>
                      <Button size="sm">View</Button>
                      <Button size="sm">Edit</Button>
                      <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleAddClientSubmit}>
                          <DialogHeader>
                            <DialogTitle className="font-serif">Add New Client</DialogTitle>
                            <DialogDescription>Enter the details for the new care recipient.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">Name</Label>
                              <Input id="name" placeholder="E.g. Jane Doe" className="col-span-3" required data-testid="input-client-name" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="age" className="text-right">Age</Label>
                              <Input id="age" type="number" placeholder="E.g. 75" className="col-span-3" required data-testid="input-client-age" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="address" className="text-right">Address</Label>
                              <Textarea id="address" placeholder="Full address" className="col-span-3" data-testid="input-client-address" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="contact" className="text-right">Emergency</Label>
                              <Input id="contact" placeholder="Contact name & number" className="col-span-3" required data-testid="input-client-contact" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="plan" className="text-right">Plan Type</Label>
                              <Select defaultValue="standard">
                                <SelectTrigger className="col-span-3" data-testid="select-client-plan">
                                  <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="basic">Basic ($900/mo)</SelectItem>
                                  <SelectItem value="standard">Standard ($1,200/mo)</SelectItem>
                                  <SelectItem value="premium">Premium ($1,800/mo)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="caregiver" className="text-right">Caregiver</Label>
                              <Select>
                                <SelectTrigger className="col-span-3" data-testid="select-client-caregiver">
                                  <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                                  <SelectItem value="james">James Okafor</SelectItem>
                                  <SelectItem value="maria">Maria Santos</SelectItem>
                                  <SelectItem value="kevin">Kevin Park</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddClientModalOpen(false)} data-testid="btn-add-client-cancel">Cancel</Button>
                            <Button type="submit" data-testid="btn-add-client-submit">Create Profile</Button>
                          </DialogFooter>
                        </form>
                        
                      </DialogContent>
                    </Dialog>
                   
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search clients or caregivers..." 
                        className="pl-9 w-full md:max-w-sm bg-muted/50 border-border"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        data-testid="input-search-clients"
                      />
                      
                    </div>
                    
                    <div className="rounded-md border border-border overflow-hidden">
                      
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Health</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Fee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedClients.map((client) => (
                            <TableRow key={client.id}>
                              <TableCell>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-xs text-muted-foreground">Age: {client.age} • Joined {client.date}</p>
                              </TableCell>
                              <TableCell className="text-sm">{client.caregiver}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getScoreColor(client.score)}>
                                  {client.score}/100
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-accent text-accent-foreground font-normal">
                                  {client.plan}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={client.status === 'Active' ? 'border-secondary/50 text-secondary bg-secondary/10' : 'border-muted-foreground/50 text-muted-foreground bg-muted'}>
                                  {client.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium">{client.fee}</TableCell>
                            </TableRow>
                          ))}
                          {filteredClients.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No clients found matching "{clientSearch}"
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    {filteredClients.length > 8 && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowAllClients(!showAllClients)}
                          className="text-primary hover:text-primary/80"
                          data-testid="btn-toggle-clients"
                        >
                          {showAllClients ? "Show less" : `Show all ${filteredClients.length} clients`}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 5. Caregiver Performance */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif">Caregiver Performance</CardTitle>
                    <CardDescription>Team metrics and current status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border border-border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Caregiver</TableHead>
                            <TableHead>Load</TableHead>
                            <TableHead>Avg Score</TableHead>
                            <TableHead>On-Time</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {caregivers.map((cg) => (
                            <TableRow key={cg.id}>
                              <TableCell>
                                <p className="font-medium">{cg.name}</p>
                                <p className="text-xs text-muted-foreground">{cg.role}</p>
                              </TableCell>
                              <TableCell className="text-sm">
                                {cg.clients} clients<br/>
                                <span className="text-xs text-muted-foreground">{cg.visits} visits/mo</span>
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${cg.score >= 80 ? 'text-secondary' : cg.score >= 70 ? 'text-primary' : 'text-destructive'}`}>
                                  {cg.score}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">{cg.onTime}</TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm font-medium">
                                  {cg.rating} <Star className="w-3 h-3 ml-1 fill-primary text-primary" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  cg.status === 'On Shift' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                                  cg.status === 'Off Shift' ? 'bg-muted text-muted-foreground border-border' : 
                                  'bg-primary/10 text-primary border-primary/20'
                                }>
                                  {cg.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid={`btn-view-profile-${cg.id}`}>Profile</Button>
                                  <Button variant="outline" size="sm" className="h-8 text-xs" data-testid={`btn-assign-client-${cg.id}`}>Assign</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* 10. Satisfaction Trends */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif">Client Satisfaction Trends</CardTitle>
                    <CardDescription>Monthly average ratings by senior care managers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={satisfactionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                          <YAxis domain={[4.0, 5.0]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="circle" />
                          <Line type="monotone" dataKey="maria" name="Maria Santos" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="sarah" name="Sarah Mitchell" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="james" name="James Okafor" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column (1/3 width) */}
              <div className="space-y-8">
                
                {/* 6. Alerts & Incidents */}
                <Card className="shadow-sm border-primary/20">
                  <CardHeader className="bg-primary/5 pb-4">
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" /> Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex gap-3">
                            <div className="mt-0.5 shrink-0">
                              {alert.type === 'critical' ? <AlertTriangle className="w-5 h-5 text-destructive" /> :
                               alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-primary" /> :
                               <Activity className="w-5 h-5 text-secondary" />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 border-transparent ${
                                  alert.type === 'critical' ? 'bg-destructive/10 text-destructive' :
                                  alert.type === 'warning' ? 'bg-primary/10 text-primary' :
                                  'bg-secondary/10 text-secondary'
                                }`}>
                                  {alert.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                              </div>
                              <p className="text-sm font-medium leading-tight">{alert.title}</p>
                              <div className="pt-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs w-full" onClick={() => resolveAlert(alert.id)} data-testid={`btn-resolve-alert-${alert.id}`}>
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {alerts.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 mb-2 text-secondary/50" />
                          <p>All clear. No active alerts.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 9. Care Plan Summary */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Care Plan Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={planTiersData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {planTiersData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-2">
                      {planTiersData.map(tier => (
                        <div key={tier.name} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                            <span>{tier.name}</span>
                          </div>
                          <span className="font-medium">{tier.value} clients</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6" data-testid="btn-manage-plans">Manage Plans</Button>
                  </CardContent>
                </Card>

                {/* 8. Caregiver Schedule */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Weekly Coverage</CardTitle>
                    <CardDescription>Shift fulfillment status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        <div></div>
                        <div className="text-[10px] text-center font-medium text-muted-foreground uppercase">Morn</div>
                        <div className="text-[10px] text-center font-medium text-muted-foreground uppercase">Aft</div>
                        <div className="text-[10px] text-center font-medium text-muted-foreground uppercase">Eve</div>
                      </div>
                      
                      {[
                        { day: 'Mon', m: 'bg-secondary/80', a: 'bg-primary/80', e: 'bg-secondary/80' },
                        { day: 'Tue', m: 'bg-secondary/80', a: 'bg-secondary/80', e: 'bg-destructive/80' },
                        { day: 'Wed', m: 'bg-secondary/80', a: 'bg-secondary/80', e: 'bg-secondary/80' },
                        { day: 'Thu', m: 'bg-primary/80', a: 'bg-secondary/80', e: 'bg-secondary/80' },
                        { day: 'Fri', m: 'bg-secondary/80', a: 'bg-destructive/80', e: 'bg-primary/80' },
                        { day: 'Sat', m: 'bg-primary/80', a: 'bg-primary/80', e: 'bg-primary/80' },
                        { day: 'Sun', m: 'bg-primary/80', a: 'bg-destructive/80', e: 'bg-primary/80' },
                      ].map((row) => (
                        <div key={row.day} className="grid grid-cols-4 gap-1 items-center">
                          <div className="text-xs font-medium text-muted-foreground">{row.day}</div>
                          <div className={`h-6 rounded-sm ${row.m} flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`} onClick={row.m.includes('destructive') ? fillGap : undefined}>
                            {row.m.includes('destructive') && <Plus className="w-3 h-3 text-white" />}
                          </div>
                          <div className={`h-6 rounded-sm ${row.a} flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`} onClick={row.a.includes('destructive') ? fillGap : undefined}>
                            {row.a.includes('destructive') && <Plus className="w-3 h-3 text-white" />}
                          </div>
                          <div className={`h-6 rounded-sm ${row.e} flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`} onClick={row.e.includes('destructive') ? fillGap : undefined}>
                            {row.e.includes('destructive') && <Plus className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-secondary/80"></div> Full</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-primary/80"></div> Partial</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-destructive/80"></div> Gap</div>
                    </div>
                  </CardContent>
                </Card>

                {/* 11. Compliance */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">DBS Checks</span>
                        <span className="text-secondary">12/12</span>
                      </div>
                      <Progress value={100} className="h-2 bg-secondary/20" indicatorClassName="bg-secondary" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Insurance Certs</span>
                        <span className="text-primary">11/12</span>
                      </div>
                      <Progress value={92} className="h-2 bg-primary/20" indicatorClassName="bg-primary" />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-muted-foreground">1 expiring June 30</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-primary" data-testid="btn-renew-insurance">Renew</Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">First Aid Certs</span>
                        <span className="text-primary">10/12</span>
                      </div>
                      <Progress value={83} className="h-2 bg-primary/20" indicatorClassName="bg-primary" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">GDPR Training</span>
                        <span className="text-secondary">12/12</span>
                      </div>
                      <Progress value={100} className="h-2 bg-secondary/20" indicatorClassName="bg-secondary" />
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">CQC Registration</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Dec 2026</span>
                    </div>

                    <Button variant="outline" className="w-full mt-2 text-xs h-8" data-testid="btn-download-compliance"><Download className="w-3 h-3 mr-2"/> Download Report</Button>
                  </CardContent>
                </Card>

                {/* 12. Activity Feed */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Live Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l border-border ml-3 space-y-6">
                      <div className="relative pl-6">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-background"></div>
                        <p className="text-sm"><span className="font-medium">Sarah Mitchell</span> logged visit for Dorothy Simmons</p>
                        <p className="text-xs text-muted-foreground mt-0.5">2 mins ago</p>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                        <p className="text-sm"><span className="font-medium">James Chen</span> viewed family dashboard</p>
                        <p className="text-xs text-muted-foreground mt-0.5">15 mins ago</p>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                        <p className="text-sm">New client enquiry: <span className="font-medium">Patricia Hammond</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5">1 hr ago</p>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-background"></div>
                        <p className="text-sm"><span className="font-medium">Walter Nguyen</span> — Vitals recorded</p>
                        <p className="text-xs text-muted-foreground mt-0.5">2 hrs ago</p>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                        <p className="text-sm">Invoice #1042 sent — <span className="font-medium">Margaret Chen</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5">3 hrs ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground" data-testid="btn-view-all-activity">View All Activity</Button>
                  </CardContent>
                </Card>

              </div>
            </div>

            {/* 7. Pipeline (Full width below) */}
            <div className="mt-8">
              <Card className="shadow-sm bg-muted/30 border-dashed">
                <CardHeader>
                  <CardTitle className="font-serif">Onboarding Pipeline</CardTitle>
                  <CardDescription>Track new clients through the intake process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {/* Stage 1 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-medium text-sm">Enquiry</h3>
                        <Badge variant="secondary" className="bg-background">2</Badge>
                      </div>
                      <Card className="shadow-sm">
                        <CardContent className="p-3 text-sm">
                          <p className="font-medium">Patricia Hammond</p>
                          <p className="text-xs text-muted-foreground mb-3">Age: 79</p>
                          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => movePipelineStage('Patricia Hammond', 'Assessment')} data-testid="btn-move-stage-patricia">Move to Next Stage</Button>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm">
                        <CardContent className="p-3 text-sm">
                          <p className="font-medium">Steven Yee</p>
                          <p className="text-xs text-muted-foreground mb-3">Age: 82</p>
                          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => movePipelineStage('Steven Yee', 'Assessment')} data-testid="btn-move-stage-steven">Move to Next Stage</Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Stage 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-medium text-sm">Assessment Scheduled</h3>
                        <Badge variant="secondary" className="bg-background">1</Badge>
                      </div>
                      <Card className="shadow-sm border-primary/20">
                        <CardContent className="p-3 text-sm">
                          <p className="font-medium">Fiona Walsh</p>
                          <p className="text-xs text-muted-foreground mb-1">Age: 76</p>
                          <p className="text-xs text-primary mb-3 font-medium flex items-center"><CalendarIcon className="w-3 h-3 mr-1"/> June 16</p>
                          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => movePipelineStage('Fiona Walsh', 'Plan Assigned')} data-testid="btn-move-stage-fiona">Move to Next Stage</Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Stage 3 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-medium text-sm">Plan Assigned</h3>
                        <Badge variant="secondary" className="bg-background">2</Badge>
                      </div>
                      <Card className="shadow-sm border-secondary/20">
                        <CardContent className="p-3 text-sm">
                          <p className="font-medium">Clara Moss</p>
                          <p className="text-xs text-muted-foreground mb-1">Age: 71</p>
                          <Badge variant="outline" className="mb-3 text-[10px] bg-secondary/10 text-secondary border-transparent font-normal">Premium plan</Badge>
                          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => movePipelineStage('Clara Moss', 'Active')} data-testid="btn-move-stage-clara">Move to Next Stage</Button>
                        </CardContent>
                      </Card>
                      <Card className="shadow-sm border-secondary/20">
                        <CardContent className="p-3 text-sm">
                          <p className="font-medium">Roy Jeffers</p>
                          <p className="text-xs text-muted-foreground mb-1">Age: 80</p>
                          <Badge variant="outline" className="mb-3 text-[10px] bg-accent text-accent-foreground border-transparent font-normal">Standard</Badge>
                          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => movePipelineStage('Roy Jeffers', 'Active')} data-testid="btn-move-stage-roy">Move to Next Stage</Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Stage 4 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-medium text-sm">Active</h3>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">32</Badge>
                      </div>
                      <div className="h-full min-h-[100px] border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-background/50">
                        <p className="text-sm text-muted-foreground px-4 text-center">Clients automatically move to roster</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </ScrollArea>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm h-full bg-sidebar flex flex-col shadow-2xl animate-in slide-in-from-left">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 text-sidebar-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
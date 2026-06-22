import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Download,
  Receipt,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  TrendingUp,
  ChevronRight,
  Lock,
  Plus,
  X,
  Building2,
  Printer,
  ExternalLink,
  Filter,
  Search
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useListInvoices, usePayInvoice, getListInvoicesQueryKey, type Invoice as ApiInvoice } from "@workspace/api-client-react";

// --- Mock Data ---

const INVOICES = [
  { id: "INV-2026-047", date: "Jun 15, 2026", description: "Monthly Care Plan — Premium", amount: 399.00, status: "Pending" },
  { id: "INV-2026-046", date: "Jun 10, 2026", description: "Caregiver Services — 18 hrs", amount: 270.00, status: "Pending" },
  { id: "INV-2026-045", date: "Jun 5, 2026", description: "Dr. Sharma Consultation", amount: 85.00, status: "Pending" },
  { id: "INV-2026-044", date: "Jun 1, 2026", description: "Physiotherapy — 4 sessions", amount: 93.50, status: "Overdue" },
  { id: "INV-2026-043", date: "May 28, 2026", description: "Lab Tests — Blood Panel", amount: 45.00, status: "Pending" },
  { id: "INV-2026-042", date: "May 15, 2026", description: "Monthly Care Plan — Premium", amount: 399.00, status: "Paid" },
  { id: "INV-2026-041", date: "May 10, 2026", description: "Caregiver Services — 22 hrs", amount: 330.00, status: "Paid" },
  { id: "INV-2026-040", date: "May 3, 2026", description: "Dr. Kim — Cardiology", amount: 150.00, status: "Paid" },
  { id: "INV-2026-039", date: "Apr 15, 2026", description: "Monthly Care Plan — Premium", amount: 399.00, status: "Paid" },
  { id: "INV-2026-038", date: "Apr 8, 2026", description: "Caregiver Services — 20 hrs", amount: 300.00, status: "Paid" },
  { id: "INV-2026-037", date: "Apr 2, 2026", description: "Wellness Sessions — May pack", amount: 120.00, status: "Paid" },
  { id: "INV-2026-036", date: "Mar 15, 2026", description: "Monthly Care Plan — Premium", amount: 399.00, status: "Paid" },
  { id: "INV-2026-035", date: "Mar 5, 2026", description: "Physiotherapy — 6 sessions", amount: 142.00, status: "Paid" },
  { id: "INV-2026-034", date: "Feb 15, 2026", description: "Monthly Care Plan — Premium", amount: 399.00, status: "Paid" },
  { id: "INV-2026-033", date: "Jan 15, 2026", description: "Monthly Care Plan — Premium", amount: 399.00, status: "Paid" },
];

const PAYMENTS = [
  { id: "PAY-88421", date: "May 15, 2026", time: "10:24 AM", amount: 729.00, method: "Visa ····4242", notes: "Covers INV-042, INV-041 partial" },
  { id: "PAY-88380", date: "May 10, 2026", time: "2:15 PM", amount: 150.00, method: "Bank Transfer", notes: "" },
  { id: "PAY-87201", date: "Apr 15, 2026", time: "9:05 AM", amount: 849.00, method: "Visa ····4242", notes: "" },
  { id: "PAY-87050", date: "Apr 2, 2026", time: "11:42 AM", amount: 120.00, method: "Visa ····4242", notes: "" },
  { id: "PAY-85902", date: "Mar 15, 2026", time: "10:00 AM", amount: 541.00, method: "Visa ····4242", notes: "" },
  { id: "PAY-84301", date: "Feb 15, 2026", time: "9:30 AM", amount: 399.00, method: "Bank Transfer", notes: "" },
  { id: "PAY-82700", date: "Jan 15, 2026", time: "10:12 AM", amount: 399.00, method: "Visa ····4242", notes: "" },
];

const SPEND_DATA = [
  { name: 'Jan', carePlan: 399, caregiver: 0, medical: 0, wellness: 0 },
  { name: 'Feb', carePlan: 399, caregiver: 0, medical: 0, wellness: 0 },
  { name: 'Mar', carePlan: 399, caregiver: 300, medical: 142, wellness: 0 },
  { name: 'Apr', carePlan: 399, caregiver: 300, medical: 0, wellness: 120 },
  { name: 'May', carePlan: 399, caregiver: 330, medical: 150, wellness: 0 },
  { name: 'Jun', carePlan: 399, caregiver: 270, medical: 85, wellness: 0 },
];

const CATEGORY_DATA = [
  { name: 'Care Plan Fees', value: 2394, color: 'hsl(var(--primary))' },
  { name: 'Caregiver Services', value: 1650, color: 'hsl(var(--secondary))' },
  { name: 'Medical/Doctor', value: 535, color: '#3b82f6' },
  { name: 'Physiotherapy', value: 335, color: '#8b5cf6' },
  { name: 'Lab Tests', value: 46, color: '#6366f1' },
  { name: 'Wellness', value: 120, color: '#206dc6' },
  { name: 'Other', value: 200, color: '#94a3b8' },
];

export default function BillingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Prefer live invoices; retain mock records when the collection is empty.
  const { data: apiInvoices = [] } = useListInvoices();
  const payInvoiceMutation = usePayInvoice({ mutation: {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getListInvoicesQueryKey() }),
    onError: () => toast({ title: "Payment update failed", description: "Please check the API connection and try again.", variant: "destructive" }),
  }});
  
  // Use API data or fall back to mock
  const displayInvoices = apiInvoices.length > 0 
    ? apiInvoices.map((inv: ApiInvoice) => ({
        id: inv.id,
        date: inv.date,
        description: inv.description,
        amount: inv.amount,
        status: inv.status
      }))
    : INVOICES;

  const [activeTab, setActiveTab] = useState("invoices");
  const [showPayModal, setShowPayModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof displayInvoices[0] | null>(null);
  
  const [invoiceFilter, setInvoiceFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Outstanding invoices for the pay modal
  const outstandingInvoices = displayInvoices.filter(inv => inv.status === "Pending" || inv.status === "Overdue");
  
  // Default check all except the last one (as per requirements)
  const initialChecked = new Set(outstandingInvoices.slice(0, -1).map(inv => inv.id));
  const [checkedInvoices, setCheckedInvoices] = useState<Set<string>>(initialChecked);
  
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [expandAddCard, setExpandAddCard] = useState(false);
  const [schedulePayment, setSchedulePayment] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());

  const handlePayNow = () => {
    setShowPayModal(true);
  };

  const handleViewInvoice = (invoice: typeof INVOICES[0]) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice downloaded",
      description: "The PDF has been saved to your device.",
    });
  };

  const handleProcessPayment = () => {
    const total = outstandingInvoices
      .filter(inv => checkedInvoices.has(inv.id))
      .reduce((sum, inv) => sum + inv.amount, 0);
    const realInvoiceIds = new Set(apiInvoices.map((invoice) => invoice.id));
    checkedInvoices.forEach((id) => {
      if (realInvoiceIds.has(id)) payInvoiceMutation.mutate({ id });
    });
    
    toast({
      title: "Payment processed successfully",
      description: `Payment of $${total.toFixed(2)} processed. Ref: PAY-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    
    setShowPayModal(false);
  };

  const toggleInvoiceCheck = (id: string) => {
    const next = new Set(checkedInvoices);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedInvoices(next);
  };

  const handleAddAddon = (name: string) => {
    toast({
      title: "Add-on selected",
      description: `${name} has been added to your next invoice.`,
    });
  };

  const filteredInvoices = displayInvoices.filter(inv => {
    const matchesFilter = invoiceFilter === "All" || inv.status === invoiceFilter;
    const matchesSearch = inv.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const payModalTotal = outstandingInvoices
    .filter(inv => checkedInvoices.has(inv.id))
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0" data-testid="link-home-logo">
              <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain" />
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <nav className="hidden sm:flex text-sm text-muted-foreground gap-2 items-center">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">Billing</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden md:flex font-normal bg-card">
              Margaret Chen — Family Plan
            </Badge>
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleDownloadInvoice}>
              <Download className="w-4 h-4 mr-2" />
              Statement
            </Button>
            <Button size="sm" onClick={handlePayNow} data-testid="btn-header-pay">
              Make a Payment
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        
        {/* Top Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <AlertCircle className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif text-primary mb-1">$847.50</p>
              <p className="text-xs text-muted-foreground">Due Jun 30, 2026</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-muted-foreground">This Month's Spend</p>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-serif text-foreground mb-1">$2,340.00</p>
              <p className="text-xs text-muted-foreground">Jun 2026</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-muted-foreground">Year-to-Date</p>
                <Calendar className="w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-3xl font-serif text-foreground mb-1">$14,280.00</p>
              <p className="text-xs text-muted-foreground">Jan – Jun 2026</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-muted-foreground">Plan Status</p>
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">Active</Badge>
              </div>
              <p className="text-xl font-serif text-foreground mb-1 mt-2">Premium Family Plan</p>
              <p className="text-xs text-muted-foreground">Renews Aug 1</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Panel Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-[280px] shrink-0 space-y-6">
            
            {/* Quick Pay */}
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="pb-3 bg-primary/5 rounded-t-xl border-b border-border/50">
                <CardTitle className="text-lg">Quick Pay</CardTitle>
                <CardDescription className="text-foreground font-medium">
                  Outstanding Balance: $847.50
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-pay-amount">Payment Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input id="quick-pay-amount" defaultValue="847.50" className="pl-7" />
                  </div>
                </div>
                <Button className="w-full" onClick={handlePayNow} data-testid="btn-quick-pay">
                  Pay Now
                </Button>
                <div className="text-center">
                  <button className="text-sm text-primary hover:underline" onClick={() => {
                    setSchedulePayment(true);
                    setShowPayModal(true);
                  }}>
                    Schedule Payment
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  Payment Method
                  <button className="text-xs font-normal text-muted-foreground hover:text-foreground">Edit</button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 09/28</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Primary</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Chase ····1847</p>
                    <p className="text-xs text-muted-foreground">Bank Account</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Backup</span>
                </div>
                
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add New Card
                </button>
                
                <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground pt-2">
                  <Lock className="w-3 h-3" />
                  Secured by 256-bit encryption
                </div>
              </CardContent>
            </Card>

            {/* Current Plan Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pb-3 border-b border-border/50">
                  <p className="font-serif text-lg">Premium Family Plan</p>
                  <p className="text-muted-foreground">$399/mo</p>
                </div>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Up to 40 hrs caregiver/month",
                    "Unlimited doctor consultations",
                    "Wellness & physio sessions",
                    "24/7 emergency response",
                    "Family dashboard access",
                    "Monthly health reports"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-2 flex flex-col gap-2">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("plan")} data-testid="btn-sidebar-upgrade">
                    Upgrade Plan
                  </Button>
                  <button className="text-sm text-center text-muted-foreground hover:text-foreground" onClick={() => setActiveTab("plan")}>
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Billing Contact */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  Billing Contact
                  <button className="text-xs font-normal text-muted-foreground hover:text-foreground">Edit</button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">James Chen</p>
                  <p className="text-muted-foreground">james.chen@email.com</p>
                  <p className="text-muted-foreground">(555) 234-5678</p>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <p className="text-muted-foreground text-xs mb-1">Billing Support</p>
                  <a href="mailto:billing@befine.care" className="text-primary hover:underline">billing@befine.care</a>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Main Area */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto pb-2 -mb-2">
                <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 space-x-6">
                  <TabsTrigger 
                    value="invoices" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 pb-3 pt-2 text-base"
                    data-testid="tab-invoices"
                  >
                    Invoices
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payments" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 pb-3 pt-2 text-base"
                    data-testid="tab-payments"
                  >
                    Payments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="plan" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 pb-3 pt-2 text-base"
                    data-testid="tab-plan"
                  >
                    Plan & Services
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 pb-3 pt-2 text-base"
                    data-testid="tab-reports"
                  >
                    Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TAB 1: INVOICES */}
              <TabsContent value="invoices" className="mt-6 space-y-6 outline-none focus:ring-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {["All", "Pending", "Paid", "Overdue"].map(filter => (
                      <Badge 
                        key={filter}
                        variant={invoiceFilter === filter ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer whitespace-nowrap",
                          invoiceFilter === filter ? (filter === "Overdue" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "") : ""
                        )}
                        onClick={() => setInvoiceFilter(filter)}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search invoices..." 
                        className="pl-9 bg-card"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => {
                      toast({ title: "Exporting...", description: "Your CSV is being generated." });
                    }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-xl bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b">
                        <tr>
                          <th className="px-6 py-4 font-medium">Invoice #</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">Description</th>
                          <th className="px-6 py-4 font-medium">Amount</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-invoice-${inv.id}`}>
                            <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{inv.id}</td>
                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{inv.date}</td>
                            <td className="px-6 py-4 text-muted-foreground min-w-[200px]">{inv.description}</td>
                            <td className="px-6 py-4 font-medium whitespace-nowrap">${inv.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={
                                inv.status === "Paid" ? "secondary" : 
                                inv.status === "Overdue" ? "destructive" : "outline"
                              } className={cn(
                                "font-medium",
                                inv.status === "Pending" ? "bg-primary/10 text-primary border-transparent" : "",
                                inv.status === "Paid" ? "bg-secondary/20 text-secondary-foreground" : ""
                              )}>
                                {inv.status === "Paid" && <CheckCircle className="w-3 h-3 mr-1" />}
                                {inv.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              {inv.status !== "Paid" ? (
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => handleViewInvoice(inv)}>View</Button>
                                  <Button size="sm" onClick={() => {
                                    setCheckedInvoices(new Set([inv.id]));
                                    setShowPayModal(true);
                                  }}>Pay Now</Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => handleViewInvoice(inv)}>View</Button>
                                  <Button size="sm" variant="outline" onClick={handleDownloadInvoice}>
                                    <Download className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                              No invoices found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: PAYMENTS */}
              <TabsContent value="payments" className="mt-6 space-y-6 outline-none focus:ring-0">
                <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-foreground/80 mb-1">Total Paid YTD</p>
                    <p className="text-2xl font-serif text-secondary-foreground">$3,187.00</p>
                  </div>
                  <div className="bg-background rounded-full p-3 shadow-sm border border-border">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                </div>

                <div className="space-y-4">
                  {PAYMENTS.map((payment) => (
                    <Card key={payment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="bg-secondary/10 p-2.5 rounded-full shrink-0">
                            <CheckCircle className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-0.5">Payment of <span className="text-secondary font-bold">${payment.amount.toFixed(2)}</span></p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {payment.date} at {payment.time}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>Ref: {payment.id}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="flex items-center gap-1.5">
                                {payment.method.includes("Visa") ? <CreditCard className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                                {payment.method}
                              </span>
                            </div>
                            {payment.notes && (
                              <p className="text-xs text-muted-foreground mt-1.5 bg-muted inline-block px-2 py-0.5 rounded">{payment.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="sm:shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5" onClick={handleDownloadInvoice}>
                            <Receipt className="w-4 h-4 mr-2" />
                            Receipt
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* TAB 3: PLAN & SERVICES */}
              <TabsContent value="plan" className="mt-6 space-y-8 outline-none focus:ring-0">
                {/* Active Plan */}
                <Card className="border-primary/40 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3 border-transparent">Current Plan</Badge>
                        <CardTitle className="text-2xl font-serif text-foreground">Premium Family Plan</CardTitle>
                        <CardDescription className="text-base mt-1">$399/month • Billed monthly</CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Started: Aug 1, 2025</p>
                        <p>Renews: Aug 1, 2026</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-foreground/80">Usage this month</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Caregiver Hours</span>
                            <span className="font-medium">18 / 40 hrs</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Physiotherapy</span>
                            <span className="font-medium">4 / 8 sessions</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full" style={{ width: "50%" }}></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Doctor Consultations</span>
                            <span className="font-medium">1 / Unlimited</span>
                          </div>
                          <p className="text-xs text-secondary font-medium">Included in plan</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Wellness Sessions</span>
                            <span className="font-medium">3 / Unlimited</span>
                          </div>
                          <p className="text-xs text-secondary font-medium">Included in plan</p>
                        </div>
                        
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t flex justify-between pt-4">
                    <button className="text-sm text-destructive hover:underline">Cancel Plan</button>
                    <Button variant="outline" className="bg-background">Change Plan</Button>
                  </CardFooter>
                </Card>

                {/* Available Plans Table */}
                <div className="space-y-4">
                  <h3 className="text-xl font-serif">Available Plans</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border rounded-xl overflow-hidden">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-4 font-medium text-muted-foreground w-1/4">Feature</th>
                          <th className="px-4 py-4 w-1/4 text-center border-l">
                            <div className="font-serif text-lg text-foreground mb-1">Basic</div>
                            <div className="text-muted-foreground font-normal">$199/mo</div>
                          </th>
                          <th className="px-4 py-4 w-1/4 text-center border-l bg-primary/5 border-t-2 border-t-primary">
                            <div className="font-serif text-lg text-foreground mb-1 flex items-center justify-center gap-1.5">
                              Premium <CheckCircle className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-primary font-medium">$399/mo</div>
                          </th>
                          <th className="px-4 py-4 w-1/4 text-center border-l">
                            <div className="font-serif text-lg text-foreground mb-1">Elite</div>
                            <div className="text-muted-foreground font-normal">$699/mo</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card">
                        {[
                          { feature: "Caregiver hours", basic: "20 hrs", premium: "40 hrs", elite: "Unlimited" },
                          { feature: "Doctor consults", basic: "2/mo", premium: "Unlimited", elite: "Unlimited" },
                          { feature: "Wellness sessions", basic: "—", premium: "Included", elite: "Included + priority" },
                          { feature: "Physio sessions", basic: "—", premium: "8/mo", elite: "Unlimited" },
                          { feature: "Emergency response", basic: "8am-8pm", premium: "24/7", elite: "24/7 + dedicated line" },
                          { feature: "Family members", basic: "2", premium: "5", elite: "Unlimited" },
                          { feature: "Health reports", basic: "Monthly", premium: "Monthly", elite: "Weekly" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium text-muted-foreground">{row.feature}</td>
                            <td className="px-4 py-3 text-center border-l">{row.basic}</td>
                            <td className="px-4 py-3 text-center border-l bg-primary/5 font-medium">{row.premium}</td>
                            <td className="px-4 py-3 text-center border-l">{row.elite}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="px-4 py-4"></td>
                          <td className="px-4 py-4 text-center border-l">
                            <Button variant="outline" className="w-full text-xs h-8">Downgrade</Button>
                          </td>
                          <td className="px-4 py-4 text-center border-l bg-primary/5">
                            <Badge variant="outline" className="bg-background w-full justify-center py-1">Current Plan</Badge>
                          </td>
                          <td className="px-4 py-4 text-center border-l">
                            <Button className="w-full text-xs h-8">Upgrade to Elite</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="space-y-4">
                  <h3 className="text-xl font-serif">Add-on Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Extra Caregiver Hours", price: "$15/hr" },
                      { name: "Overnight Caregiver", price: "$180/night" },
                      { name: "Specialist Consultation", price: "$120/visit" },
                      { name: "Meal Preparation", price: "$45/session" },
                      { name: "Transportation", price: "$35/trip" },
                    ].map((addon, i) => (
                      <Card key={i} className="bg-card">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm text-foreground mb-1">{addon.name}</p>
                            <p className="text-xs text-muted-foreground">{addon.price}</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-8" onClick={() => handleAddAddon(addon.name)}>
                            Add
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: REPORTS */}
              <TabsContent value="reports" className="mt-6 space-y-8 outline-none focus:ring-0">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Exporting...", description: "Excel report generating." })}>
                    <FileText className="w-4 h-4 mr-2" /> Export to Excel
                  </Button>
                  <Button size="sm" onClick={() => toast({ title: "Exporting...", description: "PDF report generating." })}>
                    <Download className="w-4 h-4 mr-2" /> Download PDF Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar Chart */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Spending Summary</CardTitle>
                      <CardDescription>Monthly spend Jan–Jun 2026</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={SPEND_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                            <Tooltip 
                              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                              formatter={(value: number) => [`$${value}`, undefined]}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                            <Bar dataKey="carePlan" name="Care Plan" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="caregiver" name="Caregiver" stackId="a" fill="hsl(var(--secondary))" />
                            <Bar dataKey="medical" name="Medical" stackId="a" fill="#3b82f6" />
                            <Bar dataKey="wellness" name="Wellness" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Donut Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Breakdown</CardTitle>
                      <CardDescription>YTD Allocation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={CATEGORY_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {CATEGORY_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => [`$${value}`, undefined]}
                              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-sm text-muted-foreground">Total</span>
                          <span className="text-xl font-serif font-medium">$5,280</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-2">
                        {CATEGORY_DATA.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-medium">${item.value}</span>
                          </div>
                        ))}
                        <div className="text-xs text-center text-muted-foreground pt-2 cursor-pointer hover:text-foreground">View all categories</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Year Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-y">
                          <tr>
                            <th className="px-4 py-3 font-medium text-muted-foreground">Month</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground text-right">Care Plan</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground text-right">Caregiver</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground text-right">Medical</th>
                            <th className="px-4 py-3 font-medium text-muted-foreground text-right">Wellness</th>
                            <th className="px-4 py-3 font-medium text-foreground text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {[
                            { m: "Jan", cp: 399, cg: null, md: null, wl: null, t: 399 },
                            { m: "Feb", cp: 399, cg: null, md: null, wl: null, t: 399 },
                            { m: "Mar", cp: 399, cg: 300, md: 142, wl: null, t: 841 },
                            { m: "Apr", cp: 399, cg: 300, md: null, wl: 120, t: 819 },
                            { m: "May", cp: 399, cg: 330, md: 150, wl: null, t: 879 },
                            { m: "Jun (so far)", cp: 399, cg: 270, md: 85, wl: null, t: 754 },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium text-foreground">{row.m}</td>
                              <td className="px-4 py-3 text-muted-foreground text-right">${row.cp}</td>
                              <td className="px-4 py-3 text-muted-foreground text-right">{row.cg ? `$${row.cg}` : "—"}</td>
                              <td className="px-4 py-3 text-muted-foreground text-right">{row.md ? `$${row.md}` : "—"}</td>
                              <td className="px-4 py-3 text-muted-foreground text-right">{row.wl ? `$${row.wl}` : "—"}</td>
                              <td className="px-4 py-3 font-medium text-foreground text-right">${row.t}</td>
                            </tr>
                          ))}
                          <tr className="bg-primary/5 font-medium border-t-2 border-primary/20">
                            <td className="px-4 py-4 text-foreground">YTD</td>
                            <td className="px-4 py-4 text-right">$2,394</td>
                            <td className="px-4 py-4 text-right">$1,200</td>
                            <td className="px-4 py-4 text-right">$377</td>
                            <td className="px-4 py-4 text-right">$120</td>
                            <td className="px-4 py-4 text-right font-bold text-primary">$4,091</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* MAKE A PAYMENT MODAL */}
      <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-serif">Make a Payment</DialogTitle>
            <DialogDescription>
              Select the outstanding invoices you want to pay.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              
              <div className="space-y-3">
                <Label className="text-base text-foreground/80">Outstanding Invoices</Label>
                <div className="bg-card border rounded-lg overflow-hidden divide-y divide-border">
                  {outstandingInvoices.map((inv) => (
                    <div 
                      key={inv.id} 
                      className={cn(
                        "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                        checkedInvoices.has(inv.id) ? "bg-primary/5 hover:bg-primary/5" : ""
                      )}
                      onClick={() => toggleInvoiceCheck(inv.id)}
                    >
                      <Checkbox 
                        checked={checkedInvoices.has(inv.id)} 
                        onCheckedChange={() => toggleInvoiceCheck(inv.id)} 
                        id={`pay-${inv.id}`}
                        data-testid={`checkbox-pay-${inv.id}`}
                      />
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                        <div className="flex flex-col">
                          <Label htmlFor={`pay-${inv.id}`} className="cursor-pointer text-sm font-medium">
                            {inv.id} — {inv.description}
                          </Label>
                          {inv.status === "Overdue" && (
                            <span className="text-[10px] uppercase font-bold text-destructive tracking-wider mt-0.5">Overdue</span>
                          )}
                        </div>
                        <span className="font-medium whitespace-nowrap">${inv.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center py-2 px-1">
                  <span className="font-medium text-muted-foreground">Total Selected</span>
                  <span className="text-xl font-serif text-primary font-bold">${payModalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base text-foreground/80">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className={cn(
                    "flex items-center space-x-3 space-y-0 border p-3 rounded-lg cursor-pointer transition-colors",
                    paymentMethod === "visa" ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/50"
                  )} onClick={() => setPaymentMethod("visa")}>
                    <RadioGroupItem value="visa" id="r1" />
                    <Label htmlFor="r1" className="flex-1 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>Visa ····4242</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">Primary</Badge>
                    </Label>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-3 space-y-0 border p-3 rounded-lg cursor-pointer transition-colors",
                    paymentMethod === "chase" ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/50"
                  )} onClick={() => setPaymentMethod("chase")}>
                    <RadioGroupItem value="chase" id="r2" />
                    <Label htmlFor="r2" className="flex-1 flex items-center gap-2 cursor-pointer">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>Chase ····1847</span>
                    </Label>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-3 space-y-0 border p-3 rounded-lg cursor-pointer transition-colors",
                    paymentMethod === "new" ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/50"
                  )} onClick={() => { setPaymentMethod("new"); setExpandAddCard(true); }}>
                    <RadioGroupItem value="new" id="r3" />
                    <Label htmlFor="r3" className="flex-1 flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                      <span>Add New Card</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Add New Card Expanded Form */}
                {paymentMethod === "new" && expandAddCard && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-muted/30 rounded-lg border space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-9 bg-background" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="bg-background" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="Margaret Chen" className="bg-background" />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base text-foreground/80">Schedule for later</Label>
                    <p className="text-xs text-muted-foreground">Payment will be processed on selected date</p>
                  </div>
                  <Switch 
                    checked={schedulePayment} 
                    onCheckedChange={setSchedulePayment}
                  />
                </div>
                
                {schedulePayment && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-card",
                            !scheduleDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {scheduleDate ? format(scheduleDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {/* Compact payment-date calendar */}
                        <div className="p-4 text-sm text-center text-muted-foreground">
                          Calendar picker would open here
                        </div>
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                )}
              </div>

            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t bg-muted/20 sm:justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hidden sm:flex">
              <Lock className="w-3 h-3" /> Secure Payment
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowPayModal(false)}>Cancel</Button>
              <Button 
                className="w-full sm:w-auto" 
                onClick={handleProcessPayment} 
                disabled={payModalTotal === 0}
                data-testid="btn-modal-process-pay"
              >
                {schedulePayment ? "Schedule" : "Pay"} ${payModalTotal.toFixed(2)}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INVOICE DETAIL MODAL */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background">
          {selectedInvoice && (
            <div className="flex flex-col h-[80vh] sm:h-auto max-h-[90vh]">
              <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <img src="/befine-logo.jpeg" alt="Befine" className="h-10 object-contain" />
                  <div className="text-right">
                    <h2 className="text-2xl font-serif text-muted-foreground/50 tracking-wider">TAX INVOICE</h2>
                    <p className="font-medium text-foreground mt-2">{selectedInvoice.id}</p>
                  </div>
                </div>

                {/* Dates & Status */}
                <div className="flex justify-between items-end border-b pb-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date: <span className="text-foreground font-medium">{selectedInvoice.date}</span></p>
                    <p className="text-sm text-muted-foreground">Due: <span className="text-foreground font-medium">Upon receipt</span></p>
                  </div>
                  <Badge variant={selectedInvoice.status === "Paid" ? "secondary" : "outline"} className={cn(
                    "text-sm px-3 py-1",
                    selectedInvoice.status === "Pending" ? "bg-primary/10 text-primary border-transparent" : "",
                    selectedInvoice.status === "Overdue" ? "bg-destructive text-destructive-foreground border-transparent" : "",
                    selectedInvoice.status === "Paid" ? "bg-secondary/20 text-secondary-foreground" : ""
                  )}>
                    {selectedInvoice.status}
                  </Badge>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2">Bill To</p>
                    <p className="font-medium text-foreground">Margaret Chen / James Chen</p>
                    <p className="text-muted-foreground">142 Maple Street</p>
                    <p className="text-muted-foreground">San Francisco, CA 94102</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2">From</p>
                    <p className="font-medium text-foreground">Befine Care Services</p>
                    <p className="text-muted-foreground">800 Market St</p>
                    <p className="text-muted-foreground">San Francisco, CA 94102</p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="pt-4">
                  <table className="w-full text-sm">
                    <thead className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left pb-3 font-semibold">Service Description</th>
                        <th className="text-right pb-3 font-semibold">Qty</th>
                        <th className="text-right pb-3 font-semibold">Rate</th>
                        <th className="text-right pb-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-4 font-medium text-foreground">{selectedInvoice.description}</td>
                        <td className="py-4 text-right text-muted-foreground">1</td>
                        <td className="py-4 text-right text-muted-foreground">${(selectedInvoice.amount / 1.085).toFixed(2)}</td>
                        <td className="py-4 text-right text-foreground">${(selectedInvoice.amount / 1.085).toFixed(2)}</td>
                      </tr>
                      {/* Add a dummy second item just to make it look like a real invoice if it's the premium plan */}
                      {selectedInvoice.description.includes("Premium") && (
                        <tr>
                          <td className="py-4 font-medium text-foreground">Platform Access Fee</td>
                          <td className="py-4 text-right text-muted-foreground">1</td>
                          <td className="py-4 text-right text-muted-foreground">$0.00</td>
                          <td className="py-4 text-right text-foreground">$0.00</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-4">
                  <div className="w-64 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${(selectedInvoice.amount / 1.085).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (8.5%)</span>
                      <span>${(selectedInvoice.amount - (selectedInvoice.amount / 1.085)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-serif font-bold text-foreground border-t pt-3">
                      <span>Total</span>
                      <span>${selectedInvoice.amount.toFixed(2)}</span>
                    </div>
                    
                    {selectedInvoice.status === "Paid" && (
                      <div className="pt-4 border-t border-dashed mt-4 space-y-2">
                        <div className="flex justify-between text-secondary font-medium">
                          <span>Amount Paid</span>
                          <span>-${selectedInvoice.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-xs">
                          <span>Paid on</span>
                          <span>{selectedInvoice.date} via Visa 4242</span>
                        </div>
                        <div className="flex justify-between text-foreground font-medium mt-2 pt-2 border-t">
                          <span>Balance Due</span>
                          <span>$0.00</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-12 text-center text-sm text-muted-foreground">
                  <p className="font-medium text-foreground/80">Thank you for choosing Befine.</p>
                  <p className="mt-1">For billing inquiries, please contact <a href="mailto:billing@befine.care" className="text-primary hover:underline">billing@befine.care</a></p>
                </div>
              </div>

              {/* Sticky Actions Footer */}
              <div className="border-t bg-muted/20 p-4 sm:px-8 flex justify-between items-center shrink-0">
                <Button variant="ghost" onClick={() => setShowInvoiceModal(false)}>Close</Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => {
                    toast({ title: "Printing...", description: "Opening print dialog." });
                  }}>
                    <Printer className="w-4 h-4 mr-2" /> Print
                  </Button>
                  <Button onClick={handleDownloadInvoice}>
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

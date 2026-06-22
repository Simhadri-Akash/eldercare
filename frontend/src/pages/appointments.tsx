import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, List as ListIcon, Plus, ChevronLeft, ChevronRight, 
  Clock, MapPin, User, Phone, Video, RefreshCw, AlertTriangle, 
  CheckCircle, XCircle, Info, Edit, Trash2, Bell, Check
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateAppointment, useListAppointments, getListAppointmentsQueryKey, type Appointment as ApiAppointment, type AppointmentCreate } from "@workspace/api-client-react";

// Types
type AppointmentType = "doctor" | "home" | "wellness" | "lab" | "physio" | "other";
type AppointmentStatus = "upcoming" | "completed" | "overdue" | "cancelled";

interface AppointmentView {
  id: string;
  title: string;
  type: AppointmentType;
  status: AppointmentStatus;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  duration: string;
  provider: {
    name: string;
    role: string;
  };
  caregiver?: string;
  location: string;
  notes?: string;
  recurring?: boolean;
  isTeamView?: boolean;
}

const mapAppointmentStatus = (status: string): AppointmentStatus => {
  switch (status) {
    case "Completed":
      return "completed";
    case "Cancelled":
      return "cancelled";
    case "Scheduled":
    case "Rescheduled":
      return "upcoming";
    default:
      return "upcoming";
  }
};

const getTypeFromService = (service: string): AppointmentType => {
  const lower = service.toLowerCase();
  if (lower.includes("home")) return "home";
  if (lower.includes("doctor")) return "doctor";
  if (lower.includes("wellness") || lower.includes("therapy")) return "wellness";
  if (lower.includes("lab") || lower.includes("blood")) return "lab";
  if (lower.includes("physio") || lower.includes("physiotherapy")) return "physio";
  return "other";
};

const mapApiAppointment = (appointment: ApiAppointment): AppointmentView => ({
  id: appointment.id,
  title: appointment.service,
  type: getTypeFromService(appointment.service),
  status: mapAppointmentStatus(appointment.status),
  date: appointment.date,
  time: appointment.time,
  duration: "1hr",
  provider: {
    name: appointment.caregiverId ?? "Care Team",
    role: "Caregiver",
  },

  location: appointment.location ?? "Margaret's Home",
  notes: appointment.notes,
  recurring: appointment.status === "Scheduled",
});

const getServiceName = (type: AppointmentType) => {
  switch (type) {
    case "doctor":
      return "Doctor Visit";
    case "home":
      return "Home Visit";
    case "wellness":
      return "Wellness Session";
    case "lab":
      return "Lab Appointment";
    case "physio":
      return "Physiotherapy";
    default:
      return "Service";
  }
};

const getBookingLocation = (type: AppointmentType) =>
  type === "home" ? "Margaret's Home" : "City Medical Center";

// Mock Data
const MOCK_APPOINTMENTS: AppointmentView[] = [
  { id: "1", title: "Routine Home Visit", type: "home", status: "upcoming", date: "2026-06-03", time: "9:00 AM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" },caregiver: "Sarah Mitchell" , location: "Margaret's Home", notes: "Check blood pressure", recurring: true },
  { id: "2", title: "Monthly Check-up", type: "doctor", status: "completed", date: "2026-06-05", time: "11:00 AM", duration: "1hr", provider: { name: "Dr. Priya Sharma", role: "Primary Care" }, location: "City Medical Center" },
  { id: "3", title: "Chair Exercises", type: "wellness", status: "completed", date: "2026-06-07", time: "10:00 AM", duration: "45min", provider: { name: "Befine Staff", role: "Instructor" }, location: "Befine Wellness Studio", recurring: true },
  { id: "4", title: "Music Therapy", type: "wellness", status: "completed", date: "2026-06-07", time: "2:00 PM", duration: "1hr", provider: { name: "Befine Staff", role: "Therapist" }, location: "Befine Wellness Studio" },
  { id: "5", title: "Routine Home Visit", type: "home", status: "completed", date: "2026-06-09", time: "3:00 PM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Margaret's Home", recurring: true },
  { id: "6", title: "Physiotherapy", type: "physio", status: "completed", date: "2026-06-11", time: "9:00 AM", duration: "1hr", provider: { name: "Dorothy Simmons", role: "Physiotherapist" }, location: "City Medical Center" },
  { id: "7", title: "Routine Home Visit", type: "home", status: "completed", date: "2026-06-13", time: "9:00 AM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Margaret's Home", recurring: true },
  { id: "8", title: "Care Check", type: "home", status: "upcoming", date: "2026-06-13", time: "1:00 PM", duration: "1hr", provider: { name: "Walter Nguyen", role: "Care Coordinator" }, location: "Margaret's Home" },
  { id: "9", title: "Routine Home Visit", type: "home", status: "upcoming", date: "2026-06-13", time: "3:00 PM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Margaret's Home", recurring: true },
  { id: "10", title: "Annual Eye Exam", type: "other", status: "overdue", date: "2026-06-14", time: "10:00 AM", duration: "1hr", provider: { name: "Dr. Chen", role: "Optometrist" }, location: "Vision Clinic", notes: "Needs to be rescheduled." },
  { id: "11", title: "Physiotherapy", type: "physio", status: "upcoming", date: "2026-06-16", time: "2:00 PM", duration: "1hr", provider: { name: "Harold Brooks", role: "Physiotherapist" }, location: "City Medical Center" },
  { id: "12", title: "Primary Care Review", type: "doctor", status: "upcoming", date: "2026-06-18", time: "10:00 AM", duration: "45min", provider: { name: "Dr. Priya Sharma", role: "Primary Care" }, location: "City Medical Center" },
  { id: "13", title: "Morning Yoga", type: "wellness", status: "upcoming", date: "2026-06-18", time: "3:00 PM", duration: "1hr", provider: { name: "Befine Staff", role: "Instructor" }, location: "Befine Wellness Studio", recurring: true },
  { id: "14", title: "Cardiology Follow-up", type: "doctor", status: "upcoming", date: "2026-06-20", time: "2:00 PM", duration: "1hr", provider: { name: "Dr. Robert Kim", role: "Cardiologist" }, location: "City Medical Center" },
  { id: "15", title: "Routine Home Visit", type: "home", status: "upcoming", date: "2026-06-23", time: "9:00 AM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Margaret's Home", recurring: true },
  { id: "16", title: "Blood Panel", type: "lab", status: "upcoming", date: "2026-06-25", time: "11:00 AM", duration: "30min", provider: { name: "LabCorp", role: "Technician" }, location: "City Medical Center", notes: "Fasting required for 8 hours before blood test." },
  { id: "17", title: "Chair Exercises", type: "wellness", status: "upcoming", date: "2026-06-27", time: "10:00 AM", duration: "45min", provider: { name: "Befine Staff", role: "Instructor" }, location: "Befine Wellness Studio", recurring: true },
  { id: "18", title: "Routine Home Visit", type: "home", status: "upcoming", date: "2026-06-27", time: "2:00 PM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Margaret's Home", recurring: true },
  
  // Team View Extras
  { id: "t1", title: "Home Visit (Harold Brooks)", type: "home", status: "upcoming", date: "2026-06-16", time: "9:00 AM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Harold's Home", isTeamView: true },
  { id: "t2", title: "Home Visit (Dorothy S.)", type: "home", status: "upcoming", date: "2026-06-18", time: "1:00 PM", duration: "2hrs", provider: { name: "Sarah Mitchell", role: "Caregiver" }, location: "Dorothy's Home", isTeamView: true },
];

const getTypeColor = (type: AppointmentType) => {
  switch (type) {
    case "doctor": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "home": return "bg-primary/10 text-primary border-primary/20";
    case "wellness": return "bg-secondary/10 text-secondary border-secondary/20";
    case "lab":
    case "other": return "bg-destructive/10 text-destructive border-destructive/20";
    case "physio": return "bg-secondary/10 text-secondary border-secondary/20";
  }
};

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "upcoming": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "overdue": return "bg-destructive/10 text-destructive";
    case "cancelled": return "bg-muted text-muted-foreground";
  }
};

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2);
};

export default function AppointmentsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: apiAppointments, isLoading: isAppointmentsLoading } = useListAppointments();
  const createAppointmentMutation = useCreateAppointment({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Appointment booked",
          description: "Your appointment has been scheduled successfully.",
        });
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
      },
      onError: () => {
        toast({
          title: "Booking failed",
          description: "Unable to schedule your appointment. Please try again.",
          variant: "destructive",
        });
      },
    },
  });
  // State
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar");
  const [calendarMode, setCalendarMode] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-13");
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentView | null>(null);
  const [teamView, setTeamView] = useState(false);
  const [expandedPast, setExpandedPast] = useState(false);
  
  // Booking Form State
  const [bookingType, setBookingType] = useState<AppointmentType>("home");
  const [bookingDate, setBookingDate] = useState<string>("2026-06-13");
  const [bookingTime, setBookingTime] = useState<string>("10:00 AM");

  const today = new Date().toISOString().slice(0, 10);
  const appointments = apiAppointments && apiAppointments.length > 0
    ? apiAppointments.map(mapApiAppointment)
    : MOCK_APPOINTMENTS;



  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };
  const handleBook = () => {
    const payload: AppointmentCreate = {
      clientName: "Margaret Chen",
      service: getServiceName(bookingType),
      date: bookingDate,
      time: bookingTime,
      location: getBookingLocation(bookingType),
      caregiverId: "sarah-mitchell",
      status: "Scheduled",
    };

    createAppointmentMutation.mutate({ data: payload });
    setShowBookModal(false);
  };

  // 35 days for June 2026 (starts Sunday June 1, 30 days)
  const daysInMonth = 30;
  const calendarCells = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum > daysInMonth) return null;
    return `2026-06-${dayNum.toString().padStart(2, '0')}`;
  });

  const getAppointmentsForDate = (dateStr: string | null) => {
    if (!dateStr) return [];

    return appointments.filter(
      (a) => a.date === dateStr && (!a.isTeamView || teamView)
    );
  };
  const upcomingAppointments = MOCK_APPOINTMENTS
    .filter(a => !a.isTeamView && (a.status === "upcoming" || a.status === "overdue") && a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const pastAppointments = MOCK_APPOINTMENTS
    .filter(a => !a.isTeamView && a.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date));
  const upcomingCount = appointments.filter(
    (a) => a.status === "upcoming"
  ).length;

  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain" />
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="text-sm text-muted-foreground font-medium hidden sm:flex items-center gap-2">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Schedule</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-muted rounded-full p-1 border border-border/50">
              <Button
                variant={!teamView ? "default" : "ghost"}
                onClick={() => setTeamView(false)}
              >
                Margaret's Schedule
              </Button>
              <Button
                variant={teamView ? "default" : "ghost"}
                onClick={() => setTeamView(true)}
              >
                Full Team View
              </Button>
            </div>
            
            <div className="flex items-center bg-muted rounded-lg p-1 border border-border/50">
              <button 
                onClick={() => setActiveView("calendar")}
                data-testid="toggle-calendar"
                className={`p-1.5 rounded-md transition-all ${activeView === "calendar" ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveView("list")}
                data-testid="toggle-list"
                className={`p-1.5 rounded-md transition-all ${activeView === "list" ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            
            <Button 
              onClick={() => setShowBookModal(true)} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm gap-2"
              data-testid="btn-book-nav"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </Button>
          </div>
        </div>
      </header>

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main
        className={`px-6 py-6 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="flex gap-6">
          
          

          {/* MAIN AREA */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <Card className="border-border shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif">Margaret Chen</h2>
                      <p className="text-muted-foreground">
                        Age 74 • Requires Assistance
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Upcoming
                        </p>
                        <h3 className="text-3xl font-bold text-blue-600">
                          {upcomingCount}
                        </h3>
                      </Card>

                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Completed
                        </p>
                        <h3 className="text-3xl font-bold text-green-600">
                          {completedCount}
                        </h3>
                      </Card>
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Cancelled
                        </p>
                        <h3 className="text-3xl font-bold text-red-500">
                          {cancelledCount}
                        </h3>
                      </Card>
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Next Visit</p>
                        <h3 className="text-lg font-semibold">Jun 23</h3>
                        <p className="text-sm text-muted-foreground">9:00 AM</p>
                      </Card>
                    </div>
                  </div>

                </CardContent>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">
                  Upcoming Reminder
                </h3>

                <p>
                  Primary Care Review
                </p>

                <p className="text-sm text-muted-foreground">
                  Jun 18 • 10:00 AM
                </p>
              </Card>
              {/* TODAY'S SCHEDULE */}
              {!teamView && (
                <>
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-serif">Today's Schedule</h3>
                          <p className="text-muted-foreground text-sm">
                            June 13, 2026
                          </p>
                        </div>

                        <Badge className="bg-primary/10 text-primary">
                          3 Appointments
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">Routine Home Visit</p>
                            <p className="text-sm text-muted-foreground">
                              Sarah Mitchell
                            </p>
                          </div>
                          <span className="font-medium">9:00 AM</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">Care Check</p>
                            <p className="text-sm text-muted-foreground">
                              Walter Nguyen
                            </p>
                          </div>
                          <span className="font-medium">1:00 PM</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">Routine Home Visit</p>
                            <p className="text-sm text-muted-foreground">
                              Sarah Mitchell
                            </p>
                          </div>
                          <span className="font-medium">3:00 PM</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Input
                    placeholder="Search appointments..."
                    className="max-w-sm"
                  />
                </>
              )}
            {activeView === "calendar" && (
              <>
                {!teamView ? (
                 <>
                    <div className="flex items-center justify-between bg-card p-2 rounded-xl border border-border shadow-sm">
                      <h2 className="text-xl font-serif font-medium px-2">June 2026</h2>
                      <div className="flex items-center bg-muted rounded-lg p-1 border border-border/50">
                        <button 
                          onClick={() => setCalendarMode("month")}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${calendarMode === "month" ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          Month
                        </button>
                        <button 
                          onClick={() => setCalendarMode("week")}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${calendarMode === "week" ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          Week
                        </button>
                      </div>
                    </div>

                    {calendarMode === "month" ? (
                      <Card className="border-border shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-border gap-px">
                          {calendarCells.map((dateStr, i) => {
                            if (!dateStr) return <div key={i} className="bg-background min-h-[100px]" />;
                            const dayNum = parseInt(dateStr.split('-')[2]);
                            const isToday = dateStr === today;
                            const isSelected = dateStr === selectedDate;
                            const apps = getAppointmentsForDate(dateStr);
                            
                            return (
                              <div 
                                key={i} 
                                onClick={() => handleDateClick(dateStr)}
                                className={`
                                  bg-background min-h-[100px] p-1.5 flex flex-col gap-1 transition-colors cursor-pointer group
                                  ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}
                                `}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className={`
                                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                                    ${isToday ? 'bg-primary text-primary-foreground shadow-sm' : isSelected ? 'bg-foreground/10' : 'text-muted-foreground group-hover:text-foreground'}
                                  `}>
                                    {dayNum}
                                  </span>
                                  {apps.length > 3 && <span className="text-[10px] text-muted-foreground">+{apps.length - 3}</span>}
                                </div>
                                
                                <div className="flex flex-col gap-1 overflow-hidden">
                                  {apps.slice(0, 3).map(app => (
                                    <div
                                      key={app.id}onClick={(e) => {e.stopPropagation(); setSelectedAppointment(app);}}
                                      className={`
                                        text-xs truncate px-1.5 py-0.5 rounded border ${getTypeColor(app.type)} 
                                        ${app.isTeamView ? 'opacity-50 border-dashed' : 'shadow-xs'} 
                                        hover:brightness-95 transition-all
                                      `}
                                    >
                                      {app.time.replace(':00', '').replace(' AM', 'a').replace(' PM', 'p')} {app.title}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    ) : (
                      <Card className="border-border shadow-sm p-8 text-center text-muted-foreground flex-1 flex items-center justify-center min-h-[500px]">
                        <div className="flex flex-col items-center gap-4">
                          <CalendarIcon className="w-12 h-12 text-border" />
                          <p>Week view implementation omitted for brevity.<br/>Please use Month view.</p>
                          <Button variant="outline" onClick={() => setCalendarMode("month")}>Switch to Month View</Button>
                        </div>
                      </Card>
                    )}
                </>
                ) : (
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                      Care Team Schedule
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <h3 className="font-semibold">Sarah Mitchell</h3>
                        <p className="text-sm text-muted-foreground">
                          Senior Caregiver
                        </p>
                        <p className="mt-2 text-primary font-bold">
                          8 Visits Today
                        </p>
                      </Card>

                      <Card className="p-4">
                        <h3 className="font-semibold">John Carter</h3>
                        <p className="text-sm text-muted-foreground">
                          Nurse
                        </p>
                        <p className="mt-2 text-primary font-bold">
                          5 Visits Today
                        </p>
                      </Card>

                      <Card className="p-4">
                        <h3 className="font-semibold">Emma Wilson</h3>
                        <p className="text-sm text-muted-foreground">
                          Physiotherapist
                        </p>
                        <p className="mt-2 text-primary font-bold">
                          6 Visits Today
                        </p>
                      </Card>
                      <Card className="p-6 mt-4">
                        <h2 className="text-xl font-semibold mb-4">
                          Team Workload
                        </h2>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Sarah Mitchell</span>
                              <span>80%</span>
                            </div>
                            <Progress value={80} />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>John Carter</span>
                              <span>50%</span>
                            </div>
                            <Progress value={50} />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Emma Wilson</span>
                              <span>60%</span>
                            </div>
                            <Progress value={60} />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button variant="outline">
                              Edit
                            </Button>

                            <Button variant="outline">
                              Reschedule
                            </Button>

                            <Button variant="destructive">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Card>
                  
                )}
              </>
            )}

            {activeView === "list" && (
              <div className="flex flex-col gap-6">
                
                {/* Today & Upcoming */}
                <div>
                  <h2 className="text-xl font-serif font-medium mb-4 sticky top-16 bg-background/95 backdrop-blur py-2 z-10">Upcoming Appointments</h2>
                  <div className="flex flex-col gap-4">
                    {upcomingAppointments.map((app) => (
                      <Card key={app.id} className="border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                          <div className={`w-full sm:w-1 ${
                            app.type === 'home' ? 'bg-primary' : 
                            app.type === 'doctor' ? 'bg-blue-500' : 
                            app.type === 'wellness' || app.type === 'physio' ? 'bg-secondary' : 'bg-destructive'
                          }`} />
                          
                          <div className="flex-1 p-5 flex flex-col sm:flex-row gap-6">
                            
                            {/* Time Column */}
                            <div className="sm:w-32 shrink-0">
                              <p className="font-medium text-foreground">{app.time}</p>
                              <p className="text-sm text-muted-foreground">{new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                              <p className="text-xs text-muted-foreground mt-1">{app.duration}</p>
                            </div>
                            
                            {/* Main Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-serif font-medium text-lg">{app.title}</h3>
                                    {app.recurring && <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />}
                                  </div>
                                  <div className="flex gap-2 mb-3">
                                    <Badge variant="outline" className={getTypeColor(app.type)}>{app.type.charAt(0).toUpperCase() + app.type.slice(1)}</Badge>
                                    <Badge variant="outline" className={getStatusColor(app.status)}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <User className="w-4 h-4 shrink-0" />
                                  <span className="truncate">{app.provider.name} <span className="opacity-70">({app.provider.role})</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="w-4 h-4 shrink-0" />
                                  <span className="truncate">{app.location}</span>
                                </div>
                              </div>
                              
                              {app.notes && (
                                <div className="bg-destructive/5 text-destructive-foreground/90 p-3 rounded-lg text-sm border border-destructive/10 mb-4 flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
                                  <p>{app.notes}</p>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                                {app.status === 'overdue' ? (
                                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Reschedule Now</Button>
                                ) : (
                                  <>
                                    <Button size="sm" variant="outline">Reschedule</Button>
                                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/5 hover:text-destructive">Cancel</Button>
                                    <Button size="sm" variant="ghost" className="ml-auto text-primary hover:text-primary hover:bg-primary/5">
                                      {app.type === 'doctor' ? <Video className="w-4 h-4 mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
                                      {app.type === 'doctor' ? 'Join Video' : 'Directions'}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Past Appointments */}
                <div className="mt-4">
                  <button 
                    onClick={() => setExpandedPast(!expandedPast)}
                    className="flex items-center justify-between w-full py-3 border-b border-border text-left hover:bg-muted/30 px-2 rounded-lg transition-colors"
                  >
                    <h2 className="font-serif text-lg text-muted-foreground">Past Appointments <span className="text-sm bg-muted px-2 py-0.5 rounded-full ml-2">{pastAppointments.length}</span></h2>
                    {expandedPast ? <ChevronRight className="w-5 h-5 transform rotate-90 transition-transform" /> : <ChevronRight className="w-5 h-5 transition-transform" />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedPast && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 py-4 opacity-70">
                          {pastAppointments.map((app) => (
                            <Card key={app.id} className="border-border shadow-none bg-muted/20">
                              <div className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                                <div className="sm:w-32 shrink-0 text-muted-foreground">
                                  <p className="font-medium">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                  <p className="text-sm">{app.time}</p>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <h3 className="font-medium line-through decoration-muted-foreground/30">{app.title}</h3>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{app.provider.name} • {app.location}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost">View Notes</Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}
          </div>

          {/* RIGHT DETAIL PANEL (when appointment selected in calendar view) */}
          <AnimatePresence>
            {activeView === "calendar" && selectedAppointment && (
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                className="w-full lg:w-[320px] shrink-0 border-l border-border pl-6 hidden xl:block"
              >
                <div className="sticky top-24 flex flex-col gap-6">
                  
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-serif font-medium">Details</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={() => setSelectedAppointment(null)}>
                      <XCircle className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>

                  <Card className="border-border shadow-sm overflow-hidden">
                    <div className={`h-2 ${
                      selectedAppointment.type === 'home' ? 'bg-primary' : 
                      selectedAppointment.type === 'doctor' ? 'bg-blue-500' : 
                      selectedAppointment.type === 'wellness' || selectedAppointment.type === 'physio' ? 'bg-secondary' : 'bg-destructive'
                    }`} />
                    <div className="p-5 flex flex-col gap-4">
                      
                      <div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline" className={getTypeColor(selectedAppointment.type)}>{selectedAppointment.type.charAt(0).toUpperCase() + selectedAppointment.type.slice(1)}</Badge>
                          <Badge variant="outline" className={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}</Badge>
                        </div>
                        <h3 className="font-serif font-medium text-lg mb-1">{selectedAppointment.title}</h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-muted-foreground text-sm ml-5">{selectedAppointment.time} ({selectedAppointment.duration})</p>
                      </div>

                      <div className="h-px bg-border/60" />

                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-center">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">{getInitials(selectedAppointment.provider.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{selectedAppointment.provider.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedAppointment.provider.role}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"><Phone className="w-4 h-4" /></Button>
                        </div>
                        
                        <div className="flex gap-3 items-start mt-1">
                          <div className="h-10 w-10 flex items-center justify-center bg-muted/50 rounded-full shrink-0">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="pt-1">
                            <p className="font-medium text-sm">{selectedAppointment.location}</p>
                            <p className="text-xs text-primary hover:underline cursor-pointer mt-0.5">Get Directions</p>
                          </div>
                        </div>
                      </div>

                      {selectedAppointment.notes && (
                        <>
                          <div className="h-px bg-border/60" />
                          <div className="bg-primary/5 p-3 rounded-lg text-sm border border-primary/20">
                            <div className="flex items-center gap-1.5 mb-1 text-primary font-medium">
                              <Info className="w-4 h-4" /> Notes
                            </div>
                            <p className="text-primary/80 text-xs">{selectedAppointment.notes}</p>
                          </div>
                        </>
                      )}

                      <div className="flex flex-col gap-2 mt-2">
                        {selectedAppointment.status === 'upcoming' || selectedAppointment.status === 'overdue' ? (
                          <>
                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Reschedule</Button>
                            <Button variant="outline" className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive">Cancel Appointment</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" className="w-full">View Visit Notes</Button>
                            <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5">Book Follow-up</Button>
                          </>
                        )}
                      </div>

                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  </main>

      {/* BOOK APPOINTMENT MODAL */}
      <Dialog open={showBookModal} onOpenChange={setShowBookModal}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border bg-card">
          <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
            <DialogTitle className="font-serif text-xl font-medium">Book New Appointment</DialogTitle>
          </div>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="p-6 flex flex-col gap-6">
              
              {/* Type & Provider */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type" className="text-sm font-medium">Appointment Type</Label>
                  <Select value={bookingType} onValueChange={(value) => setBookingType(value as AppointmentType)}>
                    <SelectTrigger id="type" className="bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor Visit</SelectItem>
                      <SelectItem value="home">Caregiver Home Visit</SelectItem>
                      <SelectItem value="wellness">Wellness Session</SelectItem>
                      <SelectItem value="physio">Physiotherapy</SelectItem>
                      <SelectItem value="lab">Lab Test</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="provider" className="text-sm font-medium">Provider</Label>
                  <Select defaultValue="sarah">
                    <SelectTrigger id="provider" className="bg-background">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingType === 'doctor' ? (
                        <>
                          <SelectItem value="priya">Dr. Priya Sharma</SelectItem>
                          <SelectItem value="robert">Dr. Robert Kim</SelectItem>
                          <SelectItem value="lee">Dr. Lee</SelectItem>
                        </>
                      ) : bookingType === 'home' ? (
                        <>
                          <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                          <SelectItem value="james">James Okafor</SelectItem>
                          <SelectItem value="maria">Maria Santos</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="staff">Befine Staff</SelectItem>
                          <SelectItem value="external">External Provider</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-px bg-border/60" />

              {/* Date & Time */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                  <Input type="date" id="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="bg-background" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                  <Select value={bookingTime} onValueChange={setBookingTime}>
                    <SelectTrigger id="time" className="bg-background">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                  <Select defaultValue="1hr">
                    <SelectTrigger id="duration" className="bg-background">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 min</SelectItem>
                      <SelectItem value="45min">45 min</SelectItem>
                      <SelectItem value="1hr">1 hour</SelectItem>
                      <SelectItem value="1.5hr">1.5 hours</SelectItem>
                      <SelectItem value="2hr">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Conflict Warning (Simulated) */}
              {bookingTime === "9:00 AM" && bookingDate === "2026-06-13" && (
                <div className="bg-primary/5 border border-primary/20 text-primary text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>This time slot conflicts with an existing appointment (Routine Home Visit).</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input 
                  id="location" 
                  value={bookingType === 'home' ? "Margaret's Home" : bookingType === 'doctor' ? "City Medical Center" : "Befine Wellness Studio"} 
                  readOnly 
                  className="bg-muted/50 text-muted-foreground" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes" className="text-sm font-medium">Preparation / Notes</Label>
                <Textarea id="notes" placeholder="Add any special instructions or notes..." className="bg-background resize-none" rows={3} />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="calendar" defaultChecked />
                  <label htmlFor="calendar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Add to external calendar
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify" defaultChecked />
                  <label htmlFor="notify" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Notify family members
                  </label>
                </div>
              </div>

            </div>
          </ScrollArea>
          
          <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex sm:justify-between items-center">
            <Button variant="ghost" onClick={() => setShowBookModal(false)}>Cancel</Button>
            <Button onClick={handleBook} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8" data-testid="btn-submit-booking">Book Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Appointment Details
            </DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            
            <div className="space-y-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  Appointment
                </p>
                <p className="font-medium">
                  {selectedAppointment.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Caregiver
                </p>
                <p>
                  {selectedAppointment.provider.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Date
                </p>
                <p>
                  {selectedAppointment.date}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Time
                </p>
                <p>
                  {selectedAppointment.time}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Type
                </p>
                <p>
                  {selectedAppointment.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>
                <p>
                  {selectedAppointment.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Location
                </p>
                <p>
                  {selectedAppointment.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Notes
                </p>
                <p>
                  {selectedAppointment.notes || "No Notes available"}
                </p>
              </div>
            </div>
            
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

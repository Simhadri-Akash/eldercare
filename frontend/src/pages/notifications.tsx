import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Heart,
  Pill,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  MoreHorizontal,
  CheckCheck,
  Trash2,
  Download,
  Activity,
  Shield,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useListNotifications, useMarkNotificationRead, getListNotificationsQueryKey, type Notification as ApiNotification } from "@workspace/api-client-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NotificationType = "All" | "Health Alerts" | "Medications" | "Messages" | "Appointments" | "Care Updates" | "System";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  buttons?: Array<{ label: string; action: string; variant?: "default" | "outline" | "secondary" }>;
}

const initialNotifications: Notification[] = [
  // Health Alerts
  { id: "1", type: "Health Alerts", title: "Walter Nguyen: Health Score Dropped", description: "Health score fell from 57 to 45 over 3 days. Immediate review recommended.", timestamp: "3 hrs ago", read: false, buttons: [{ label: "View Dashboard", action: "view_dashboard" }, { label: "Contact Sarah", action: "contact_sarah", variant: "outline" }] },
  { id: "2", type: "Health Alerts", title: "Margaret Chen: Elevated Heart Rate", description: "Heart rate of 98 bpm detected for 12 minutes at 3:45 PM today via Smart Ring.", timestamp: "5 hrs ago", read: false, buttons: [{ label: "View Vitals", action: "view_vitals" }] },
  { id: "3", type: "Health Alerts", title: "Routine Checkup Overdue", description: "Margaret's eye examination is overdue by 14 days. Please schedule an appointment.", timestamp: "Yesterday", read: false, buttons: [{ label: "Schedule Now", action: "schedule" }] },
  { id: "4", type: "Health Alerts", title: "Margaret Chen: Blood Pressure Normal", description: "Blood pressure reading 120/78 recorded at 8:00 AM — within normal range.", timestamp: "Yesterday 8:05 AM", read: true },
  
  // Medications
  { id: "5", type: "Medications", title: "Missed Medication Alert", description: "Margaret Chen missed her afternoon Metformin (40mg) dose at 2:00 PM.", timestamp: "4 hrs ago", read: false, buttons: [{ label: "Send Reminder", action: "send_reminder" }, { label: "Mark Taken", action: "mark_taken", variant: "outline" }] },
  { id: "6", type: "Medications", title: "Medication Refill Needed", description: "Lisinopril supply for Margaret Chen will run out in 5 days. Contact pharmacy to refill.", timestamp: "Today 9:00 AM", read: false, buttons: [{ label: "Contact Pharmacy", action: "contact_pharmacy" }] },
  { id: "7", type: "Medications", title: "Morning Medications Taken", description: "Margaret Chen completed all 2 morning medications at 8:05 AM.", timestamp: "Today 8:06 AM", read: true },
  { id: "8", type: "Medications", title: "Prescription Updated", description: "Dr. Priya Sharma updated Margaret's medication plan. Atorvastatin dosage adjusted.", timestamp: "June 12", read: true },

  // Messages
  { id: "9", type: "Messages", title: "New message from Sarah Mitchell", description: "Morning! I've spoken with Dr. Sharma — she recommends keeping the current schedule...", timestamp: "2 hrs ago", read: false, buttons: [{ label: "Reply", action: "reply" }] },
  { id: "10", type: "Messages", title: "New message from Befine Support", description: "Margaret's annual wellness assessment is due next month. Would you like to schedule it?", timestamp: "Today 8:00 AM", read: false, buttons: [{ label: "View Message", action: "view_message" }] },
  { id: "11", type: "Messages", title: "Message from Dr. Priya Sharma", description: "I've updated Margaret's care notes. See you at the June 18 appointment.", timestamp: "June 11", read: false, buttons: [{ label: "View Message", action: "view_message" }] },
  { id: "12", type: "Messages", title: "Message from Lisa Chen", description: "Did you see Mom's latest health report? I'll call her this weekend.", timestamp: "June 12 7:00 PM", read: true },
  { id: "13", type: "Messages", title: "Message from Sarah Mitchell", description: "Visit completed. Margaret is in great spirits. Completed all morning exercises.", timestamp: "Yesterday 2:14 PM", read: true },

  // Appointments
  { id: "14", type: "Appointments", title: "Upcoming Appointment Reminder", description: "Margaret Chen has an appointment with Dr. Priya Sharma on June 18 at 10:00 AM.", timestamp: "Today 10:00 AM", read: false, buttons: [{ label: "Add to Calendar", action: "add_calendar" }, { label: "Get Directions", action: "get_directions", variant: "outline" }] },
  { id: "15", type: "Appointments", title: "Appointment Confirmed", description: "Cardiology follow-up with Dr. Robert Kim confirmed for July 2 at 2:30 PM.", timestamp: "June 11", read: true },
  { id: "16", type: "Appointments", title: "Appointment Completed", description: "Margaret's routine check with Dr. Priya Sharma on June 5 was marked as completed.", timestamp: "June 5", read: true },

  // Care Updates
  { id: "17", type: "Care Updates", title: "Visit Completed", description: "Sarah Mitchell completed a routine visit with Margaret Chen at 9:00 AM. All vitals recorded.", timestamp: "Today 9:15 AM", read: false, buttons: [{ label: "View Report", action: "view_report" }] },
  { id: "18", type: "Care Updates", title: "Care Plan Updated", description: "Sarah Mitchell updated Margaret's care plan — added cognitive activity sessions (puzzles).", timestamp: "Today 11:30 AM", read: false, buttons: [{ label: "View Care Plan", action: "view_care_plan" }] },
  { id: "19", type: "Care Updates", title: "Caregiver Note Added", description: "Sarah Mitchell added a note: 'Client requested more puzzles for cognitive activities.'", timestamp: "Yesterday 2:30 PM", read: true },
  { id: "20", type: "Care Updates", title: "New Wellness Activity Added", description: "Music therapy session added to Margaret's weekly wellness schedule on Thursdays.", timestamp: "June 12", read: true },
  { id: "21", type: "Care Updates", title: "Physiotherapy Session Completed", description: "Margaret completed her morning chair exercise physiotherapy session.", timestamp: "Today 7:05 AM", read: true },

  // System
  { id: "22", type: "System", title: "Monthly Report Available", description: "Your May 2026 care report is ready to download from the Family Dashboard.", timestamp: "June 12 11:00 AM", read: true, buttons: [{ label: "Download", action: "download" }] },
  { id: "23", type: "System", title: "Account Security", description: "Your Befine account was accessed from a new device on June 10. If this wasn't you, contact support.", timestamp: "June 10", read: true },
  { id: "24", type: "System", title: "Platform Update", description: "Befine app updated with new Smart Ring integration features and improved health tracking.", timestamp: "June 9", read: true },
  { id: "25", type: "System", title: "Invoice Generated", description: "Invoice #1042 for Margaret Chen's June 2026 care plan has been generated: $1,800.", timestamp: "June 1", read: true, buttons: [{ label: "View Invoice", action: "view_invoice" }] },
  { id: "26", type: "System", title: "Family Access Added", description: "Lisa Chen (Sister) was given Viewer access to Margaret Chen's profile.", timestamp: "May 28", read: true },
  { id: "27", type: "System", title: "Welcome to Befine", description: "Thank you for choosing Befine Elderly Care. Your dedicated care manager is Sarah Mitchell.", timestamp: "March 2025", read: true }
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationType>("All");
  const [showPreferences, setShowPreferences] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Prefer live notifications; retain mock records when the collection is empty.
  const { data: apiNotifications = [] } = useListNotifications();
  const queryClient = useQueryClient();
  const markReadMutation = useMarkNotificationRead({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }) },
  });

  // Map API notifications to display format
  const mapApiNotification = (n: ApiNotification): Notification => ({
    id: n.id,
    type: "System" as NotificationType,
    title: n.title,
    description: n.body,
    timestamp: n.createdAt,
    read: n.read
  });

  // Use API data or fall back to mock
  const [notifications, setNotifications] = useState<Notification[]>(
    apiNotifications.length > 0 
      ? apiNotifications.map(mapApiNotification)
      : initialNotifications
  );

  useEffect(() => {
    if (apiNotifications.length > 0) setNotifications(apiNotifications.map(mapApiNotification));
  }, [apiNotifications]);

  const [prefs, setPrefs] = useState({
    "Health Alerts": true,
    "Medication Reminders": true,
    "Message Notifications": true,
    "Appointment Reminders": true,
    "Care Manager Updates": true,
    "System Updates": false,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ description: "All notifications marked as read" });
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (apiNotifications.some((notification) => notification.id === id)) {
      markReadMutation.mutate({ id });
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ description: "Notification deleted" });
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    switch(action) {
      case "send_reminder":
        toast({ description: "Reminder sent to Margaret" });
        break;
      case "mark_taken":
        toast({ description: "Medication marked as taken" });
        break;
      case "reply":
        setLocation("/messages");
        break;
      case "download":
        toast({ description: "Download started" });
        break;
      default:
        toast({ description: "Action completed" });
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const unreadCountAll = notifications.filter(n => !n.read).length;

  const filterCounts = useMemo(() => {
    const counts = {
      "All": unreadCountAll,
      "Health Alerts": 0,
      "Medications": 0,
      "Messages": 0,
      "Appointments": 0,
      "Care Updates": 0,
      "System": 0,
    };
    notifications.forEach(n => {
      if (!n.read) counts[n.type] += 1;
    });
    return counts;
  }, [notifications, unreadCountAll]);

  const typeConfig: Record<string, { icon: React.ElementType, color: string, bg: string, border: string }> = {
    "Health Alerts": { icon: Heart, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive" },
    "Medications": { icon: Pill, color: "text-primary", bg: "bg-primary/10", border: "border-primary" },
    "Messages": { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
    "Appointments": { icon: Calendar, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary" },
    "Care Updates": { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500" },
    "System": { icon: Settings, color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur shadow-sm border-b border-border py-4">
        <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain cursor-pointer" />
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-medium">Notifications</h1>
              {unreadCountAll > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCountAll}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead} data-testid="btn-mark-all-read" className="hidden sm:flex">
              <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notification preferences" onClick={() => { setShowPreferences(true); setTimeout(() => document.getElementById("notification-preferences")?.scrollIntoView({ behavior: "smooth" }), 0); }}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 max-w-6xl py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8">
          
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 gap-2 hide-scrollbar">
            <button
              onClick={() => setActiveFilter("All")}
              data-testid="filter-all"
              className={cn(
                "flex items-center justify-between w-full p-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal border border-transparent",
                activeFilter === "All" ? "bg-primary/10 border-l-4 border-l-primary shadow-sm" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <Bell className={cn("w-5 h-5", activeFilter === "All" ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("font-medium text-sm", activeFilter === "All" ? "text-foreground" : "text-foreground/80")}>All Notifications</span>
              </div>
              {filterCounts["All"] > 0 && (
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                  {filterCounts["All"]}
                </span>
              )}
            </button>

            {(Object.keys(typeConfig) as NotificationType[]).map(type => {
              const Icon = typeConfig[type].icon;
              const count = filterCounts[type];
              const isActive = activeFilter === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  data-testid={`filter-${type.replace(/\s+/g, '-').toLowerCase()}`}
                  className={cn(
                    "flex items-center justify-between w-full p-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal border border-transparent",
                    isActive ? "bg-primary/10 border-l-4 border-l-primary shadow-sm" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5", isActive ? typeConfig[type].color : "text-muted-foreground")} />
                    <span className={cn("font-medium text-sm", isActive ? "text-foreground" : "text-foreground/80")}>{type}</span>
                  </div>
                  {count > 0 && (
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full ml-2", typeConfig[type].bg, typeConfig[type].color)}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Preferences - Desktop Only */}
          <div id="notification-preferences" className={`${showPreferences ? "flex" : "hidden md:flex"} flex-col gap-4 bg-muted/30 p-5 rounded-2xl border border-border`}>
            <h3 className="font-serif font-medium text-sm text-muted-foreground uppercase tracking-wider">Preferences</h3>
            <div className="space-y-4">
              {Object.entries(prefs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">{key}</span>
                  <Switch 
                    checked={val} 
                    onCheckedChange={() => togglePref(key as keyof typeof prefs)}
                    className={val && key === "Health Alerts" ? "data-[state=checked]:bg-secondary" : ""}
                  />
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Feed */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between md:hidden mb-2">
            <h2 className="font-serif font-medium text-lg">{activeFilter}</h2>
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
            </Button>
          </div>

          <div className="space-y-3 pb-20">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border">
                <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-medium">No notifications</h3>
                <p className="text-muted-foreground text-sm">You're all caught up here.</p>
              </div>
            ) : (
              filteredNotifications.map(notification => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => markRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                    className={cn(
                      "group relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                      !notification.read ? "bg-card shadow-sm border-transparent" : "bg-muted/30 border-transparent",
                      !notification.read && `hover:shadow-md`,
                      `border-l-4 ${!notification.read ? config.border : 'border-l-transparent'}`
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute top-0 bottom-0 left-0 w-full h-full rounded-2xl ring-1 ring-inset ring-primary/10 pointer-events-none" />
                    )}

                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", config.bg, config.color, !notification.read ? "opacity-100" : "opacity-60")}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={cn("text-base font-medium font-serif leading-snug", !notification.read ? "text-foreground" : "text-foreground/70")}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 mt-1">
                          {notification.timestamp}
                        </span>
                      </div>
                      
                      <p className={cn("text-sm leading-relaxed mb-3", !notification.read ? "text-muted-foreground" : "text-muted-foreground/70")}>
                        {notification.description}
                      </p>

                      {notification.buttons && notification.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {notification.buttons.map((btn, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant={btn.variant || "default"}
                              onClick={(e) => handleAction(e, btn.action)}
                              className={cn("h-8 text-xs", notification.read && "opacity-80")}
                              data-testid={`btn-action-${btn.action}`}
                            >
                              {btn.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {!notification.read && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); markRead(notification.id); }}>
                              <CheckCheck className="w-4 h-4 mr-2" /> Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

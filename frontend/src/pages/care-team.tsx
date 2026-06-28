import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Star, StarHalf, Phone, Mail, Calendar, Clock, MapPin, 
  MessageSquare, Plus, X, ChevronRight, Shield, Award, 
  User, Users, Heart, Stethoscope, Activity, Crown, Search,
  Filter, Grid, List as ListIcon, ChevronDown, Check,
  MoreVertical, FileText
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useListCareTeam, useCreateCareTeamMember, useUpdateCareTeamMember, useDeleteCareTeamMember, getListCareTeamQueryKey, type CareTeamMember as ApiCareTeamMember, type CareTeamMemberCreate } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Types & Mock Data ---

type Role = "Caregiver" | "Doctor" | "Specialist" | "Wellness";
type Status = "Available Now" | "On Duty" | "Off Today" | "Available" | string;

interface TeamMember {
  id: string;
  name: string;
  role: Role;
  roleType: string; // e.g. "Primary Caregiver", "Cardiologist"
  isPrimary?: boolean;
  status: Status;
  avatarUrl?: string;
  initials: string;
  rating: number;
  reviews: number;
  experience: number;
  specialties: string[];
  languages: string[];
  hoursThisMonth?: number;
  hoursContracted?: number;
  nextVisit?: string;
  phone: string;
  email: string;
  location?: string;
  bio: string;
  certifications?: string[];
  availability: any; // simplified for UI
  history: any[]; // simplified
}

const teamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Sarah Mitchell",
    role: "Caregiver",
    roleType: "Primary Caregiver",
    isPrimary: true,
    status: "On Duty",
    initials: "SM",
    rating: 4.9,
    reviews: 18,
    experience: 7,
    specialties: ["Dementia Care", "Mobility Assistance", "Medication Management"],
    languages: ["English", "Spanish"],
    hoursThisMonth: 18,
    hoursContracted: 40,
    nextVisit: "Today 3:00 PM",
    phone: "(555) 301-4421",
    email: "sarah.m@befine.care",
    bio: "Sarah brings 7 years of specialized dementia care experience. She has a gentle, patient approach and forms deep bonds with her clients.",
    certifications: ["CPR Certified", "Dementia Care Certified", "HHA"],
    availability: {},
    history: [
      { date: "Yesterday", type: "Full Day Care", duration: "8 hrs", note: "Margaret was in good spirits, enjoyed a walk in the garden." },
      { date: "Jun 12", type: "Morning Care", duration: "4 hrs", note: "Helped with breakfast and morning medications." },
      { date: "Jun 10", type: "Full Day Care", duration: "8 hrs", note: "Played cards, standard routine." }
    ]
  },
  {
    id: "m2",
    name: "James Okafor",
    role: "Caregiver",
    roleType: "Caregiver",
    status: "Available Now",
    initials: "JO",
    rating: 4.7,
    reviews: 11,
    experience: 4,
    specialties: ["Personal Care", "Companionship", "Light Exercise"],
    languages: ["English", "Yoruba"],
    hoursThisMonth: 0,
    hoursContracted: 0,
    nextVisit: "Jun 23, 9:00 AM",
    phone: "(555) 412-7823",
    email: "james.o@befine.care",
    bio: "James is energetic and encouraging, perfect for helping clients maintain their mobility and stay active.",
    certifications: ["CPR Certified", "CNA"],
    availability: {},
    history: [
      { date: "Jun 5", type: "Relief Care", duration: "4 hrs", note: "Covered for Sarah. Margaret was a bit confused but settled down." }
    ]
  },
  {
    id: "m3",
    name: "Maria Santos",
    role: "Caregiver",
    roleType: "Caregiver",
    status: "Off Today",
    initials: "MS",
    rating: 4.8,
    reviews: 9,
    experience: 5,
    specialties: ["Nutrition & Meal Prep", "Physical Therapy Assist", "Wound Care"],
    languages: ["English", "Portuguese", "Tagalog"],
    hoursThisMonth: 0,
    hoursContracted: 0,
    nextVisit: "Jun 27, 2:00 PM",
    phone: "(555) 508-6612",
    email: "maria.s@befine.care",
    bio: "Maria loves cooking and ensuring her clients receive nutritious, delicious meals tailored to their dietary needs.",
    certifications: ["Food Handler Card", "CNA"],
    availability: {},
    history: []
  },
  {
    id: "m4",
    name: "Dr. Priya Sharma",
    role: "Doctor",
    roleType: "Primary Care Physician",
    status: "Available",
    initials: "PS",
    rating: 4.9,
    reviews: 42,
    experience: 18,
    specialties: ["Geriatric Medicine", "Preventive Care", "Chronic Disease Management"],
    languages: ["English", "Hindi"],
    location: "City Medical Center, 450 Sutter St, SF",
    nextVisit: "Jun 18, 10:00 AM",
    phone: "(555) 221-8800",
    email: "dr.sharma@citymedical.com",
    bio: "Dr. Sharma is a board-certified geriatrician with nearly two decades of experience managing complex age-related conditions.",
    certifications: ["MD", "Board Certified in Geriatrics"],
    availability: {},
    history: [
      { date: "May 15", type: "Routine Checkup", duration: "45 min", note: "Blood pressure stable. Adjusted morning medications slightly." }
    ]
  },
  {
    id: "m5",
    name: "Dr. Robert Kim",
    role: "Specialist",
    roleType: "Cardiologist",
    status: "Off Today", // Clinic hours Tue & Thu
    initials: "RK",
    rating: 4.8,
    reviews: 31,
    experience: 22,
    specialties: ["Cardiology", "Heart Failure Management", "Pacemaker Monitoring"],
    languages: ["English", "Korean"],
    location: "SF Heart Institute, 2100 Webster St, SF",
    nextVisit: "Jun 20, 2:00 PM",
    phone: "(555) 334-9900",
    email: "dr.kim@sfheart.com",
    bio: "Dr. Kim specializes in heart failure management in elderly populations, focusing on quality of life.",
    certifications: ["MD", "FACC"],
    availability: {},
    history: [
      { date: "Mar 10", type: "Echocardiogram Follow-up", duration: "30 min", note: "Pacemaker functioning well. Heart rhythm normal." }
    ]
  },
  {
    id: "m6",
    name: "Harold Brooks",
    role: "Specialist",
    roleType: "Physical Therapist",
    status: "Available Now",
    initials: "HB",
    rating: 4.7,
    reviews: 15,
    experience: 10,
    specialties: ["Geriatric Rehabilitation", "Balance & Fall Prevention", "Post-Surgery Recovery"],
    languages: ["English"],
    location: "Befine Wellness Studio + Home visits",
    nextVisit: "Jun 16, 2:00 PM",
    phone: "(555) 619-3344",
    email: "harold.b@befine.care",
    bio: "Harold uses evidence-based approaches to help seniors maintain their independence and prevent falls.",
    certifications: ["DPT", "Geriatric Clinical Specialist"],
    availability: {},
    history: [
      { date: "Jun 9", type: "In-home session", duration: "1 hr", note: "Worked on lower body strength and balance. Good progress." }
    ]
  },
  {
    id: "m7",
    name: "Dorothy Simmons",
    role: "Specialist",
    roleType: "Occupational Therapist",
    status: "On Leave until Jun 20",
    initials: "DS",
    rating: 4.6,
    reviews: 8,
    experience: 12,
    specialties: ["ADL Training", "Home Safety Assessment", "Adaptive Equipment"],
    languages: ["English", "French"],
    nextVisit: "Jun 25, 11:00 AM",
    phone: "(555) 720-5588",
    email: "dorothy.s@befine.care",
    bio: "Dorothy helps adapt the living environment to ensure safety and ease of daily activities.",
    certifications: ["OTR/L"],
    availability: {},
    history: [
      { date: "Jan 12", type: "Home Assessment", duration: "2 hrs", note: "Recommended grab bars in bathroom and removing throw rugs." }
    ]
  },
  {
    id: "m8",
    name: "Elena Vasquez",
    role: "Wellness",
    roleType: "Wellness Coach",
    status: "Available Now",
    initials: "EV",
    rating: 4.9,
    reviews: 22,
    experience: 6,
    specialties: ["Chair Yoga", "Cognitive Exercises", "Music Therapy Coordination"],
    languages: ["English", "Spanish"],
    nextVisit: "Jun 18, 3:00 PM",
    phone: "(555) 831-6677",
    email: "elena.v@befine.care",
    bio: "Elena brings joy and engagement through holistic wellness practices, focusing on mind-body connection.",
    certifications: ["Certified Senior Fitness Specialist"],
    availability: {},
    history: [
      { date: "Jun 11", type: "Chair Yoga", duration: "45 min", note: "Margaret loved the music today. Very engaged." }
    ]
  }
];

export default function CareTeamPage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch care team from API
  const { data: apiTeamMembers = [] } = useListCareTeam();

  // Map API team members to display format, use mock data as fallback
  const [displayMembers, setDisplayMembers] = useState<TeamMember[]>(teamMembers);

  useEffect(() => {
    if (apiTeamMembers.length === 0) return;
    setDisplayMembers(apiTeamMembers.map((member: ApiCareTeamMember) => ({
      id: member.id,
      name: member.name,
      role: member.role as Role,
      roleType: member.role,
      isPrimary: member.isPrimary,
      status: member.status,
      avatarUrl: member.avatarUrl,
      initials: member.name.split(" ").map((part) => part[0]).join("").slice(0, 2),
      rating: member.rating,
      reviews: 0,
      experience: 0,
      specialties: member.specialties,
      languages: [],
      phone: "Not provided",
      email: "Not provided",
      bio: member.bio ?? "Care team member",
      availability: {},
      history: [],
    })));
  }, [apiTeamMembers]);

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoles, setFilterRoles] = useState<Set<Role>>(new Set(["Caregiver", "Doctor", "Specialist", "Wellness"]));
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState("Name A-Z");

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<TeamMember | null>(null);
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({
    overall: 0, punctuality: 0, communication: 0, careQuality: 0
  });

  // Filter & Sort Logic
  const filteredMembers = useMemo(() => {
    let result = displayMembers.filter(m => {
      // Role match
      if (!filterRoles.has(m.role)) return false;
      // Availability match
      if (availabilityFilter !== "All") {
        if (availabilityFilter === "Available Now" && !["Available Now", "Available"].includes(m.status)) return false;
        if (availabilityFilter === "On Duty" && m.status !== "On Duty") return false;
        if (availabilityFilter === "Off Today" && m.status.includes("Off Today") === false && m.status.includes("On Leave") === false) return false;
      }
      // Search match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.roleType.toLowerCase().includes(q) ||
          m.specialties.some(s => s.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "Name A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Rating") return b.rating - a.rating;
      if (sortBy === "Hours/Month") return (b.hoursThisMonth || 0) - (a.hoursThisMonth || 0);
      return 0; // "Next Visit" is complex to parse, skip for simple demo
    });

    return result;
  }, [filterRoles, availabilityFilter, searchQuery, sortBy, displayMembers]);

  // Handlers
  const handleRoleToggle = (role: Role) => {
    setFilterRoles(prev => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  };

  const openDetail = (m: TeamMember) => {
    setSelectedMember(m);
    setShowDetailPanel(true);
  };

  const openReview = (m: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewTarget(m);
    setRatingValues({ overall: 0, punctuality: 0, communication: 0, careQuality: 0 });
    setShowReviewModal(true);
  };

  const submitReview = () => {
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
    setShowReviewModal(false);
  };

  const submitRequest = () => {
    toast({
      title: "Request submitted",
      description: "Your caregiver request has been submitted. Our team will contact you within 2 hours.",
    });
    setShowRequestModal(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-primary">
        {[1,2,3,4,5].map(i => {
          if (rating >= i) return <Star key={i} className="w-3.5 h-3.5 fill-primary" />;
          if (rating >= i - 0.5) return <StarHalf key={i} className="w-3.5 h-3.5 fill-primary" />;
          return <Star key={i} className="w-3.5 h-3.5 text-muted-foreground/30" />;
        })}
      </div>
    );
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "Caregiver": return "bg-primary text-primary-foreground";
      case "Doctor": return "bg-blue-600 text-white";
      case "Specialist": return "bg-purple-600 text-white";
      case "Wellness": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleOutlineColor = (role: Role) => {
    switch (role) {
      case "Caregiver": return "border-primary text-primary";
      case "Doctor": return "border-blue-600 text-blue-600";
      case "Specialist": return "border-purple-600 text-purple-600";
      case "Wellness": return "border-secondary text-secondary";
      default: return "border-muted-foreground text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Available")) return "bg-blue-500";
    if (status.includes("On Duty")) return "bg-green-500 animate-pulse";
    return "bg-gray-400";
  };

  const roleCounts = {
    Caregiver: teamMembers.filter(m => m.role === "Caregiver").length,
    Doctor: teamMembers.filter(m => m.role === "Doctor").length,
    Specialist: teamMembers.filter(m => m.role === "Specialist").length,
    Wellness: teamMembers.filter(m => m.role === "Wellness").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0 hidden md:block">
              <img src="/befine-logo.jpeg" alt="Befine" className="h-8 object-contain" />
            </Link>
            <div className="h-6 w-px bg-border hidden md:block"></div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">Care Team</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
              <Avatar className="w-6 h-6 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">MC</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Margaret Chen</span>
            </div>
            
            <Button variant="outline" size="sm" className="hidden lg:flex" onClick={() => setShowRequestModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Invite Specialist
            </Button>
            <Button size="sm" onClick={() => setShowRequestModal(true)} data-testid="btn-request-caregiver">
              <Plus className="w-4 h-4 mr-1 md:mr-2" /> <span className="hidden md:inline">Request New Caregiver</span><span className="md:hidden">New</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Top Summary Bar */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Team Size</h3>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-serif text-foreground">8 Members</p>
            <p className="text-xs text-muted-foreground mt-1">Active care team</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Primary Caregiver</h3>
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-serif text-foreground truncate">Sarah Mitchell</p>
            <p className="text-xs text-muted-foreground mt-1">40 hrs/month contracted</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Next Visit</h3>
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-xl font-serif text-foreground">Today, 3:00 PM</p>
            <p className="text-xs text-muted-foreground mt-1">Sarah Mitchell</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Team Rating</h3>
              <Star className="w-4 h-4 text-primary fill-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-serif text-foreground">4.8</p>
              <div className="flex pb-1">{renderStars(4.8)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on 24 reviews</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FILTER SIDEBAR */}
          <aside className="w-full lg:w-60 shrink-0 space-y-8">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search care team..." 
                  className="pl-9 bg-card rounded-full"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  data-testid="input-search-team"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif font-medium text-lg">Role</h3>
              <div className="space-y-3">
                {(["Caregiver", "Doctor", "Specialist", "Wellness"] as Role[]).map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`role-${role}`} 
                      checked={filterRoles.has(role)}
                      onCheckedChange={() => handleRoleToggle(role)}
                      data-testid={`checkbox-${role}`}
                    />
                    <label 
                      htmlFor={`role-${role}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 flex justify-between"
                    >
                      <span>{role}s</span>
                      <span className="text-muted-foreground bg-muted px-1.5 rounded text-xs">{roleCounts[role]}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif font-medium text-lg">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Available Now", "On Duty", "Off Today"].map(status => (
                  <button
                    key={status}
                    onClick={() => setAvailabilityFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      availabilityFilter === status 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-card text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-serif">Care Providers ({filteredMembers.length})</h2>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-card rounded-full h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Name A-Z">Name A-Z</SelectItem>
                    <SelectItem value="Rating">Highest Rated</SelectItem>
                    <SelectItem value="Hours/Month">Most Hours</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center bg-card border border-border rounded-full p-1" data-testid="toggle-view">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-full transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-2xl">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No team members found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                <Button variant="outline" className="mt-4 rounded-full" onClick={() => { setFilterRoles(new Set(["Caregiver", "Doctor", "Specialist", "Wellness"])); setAvailabilityFilter("All"); setSearchQuery(""); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "flex flex-col gap-4"
              }>
                {filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative group ${
                      viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"
                    }`}
                    onClick={() => openDetail(member)}
                    data-testid={`card-${member.id}`}
                  >
                    {/* Crown badge */}
                    {member.isPrimary && (
                      <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold z-10 shadow-sm border border-primary/20">
                        <Crown className="w-3 h-3" />
                        PRIMARY
                      </div>
                    )}

                    {viewMode === "grid" ? (
                      <>
                        <div className="p-6 pb-4">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative">
                              <Avatar className={`w-16 h-16 border-2 ${member.isPrimary ? 'border-primary' : 'border-border'}`}>
                                <AvatarFallback className={`${member.role === 'Caregiver' ? 'bg-primary/10 text-primary' : member.role === 'Doctor' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'} text-lg font-serif`}>
                                  {member.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
                            </div>
                            <div className="flex-1 min-w-0 pr-12">
                              <h3 className="font-serif text-lg font-medium truncate">{member.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={`font-normal rounded-full ${member.isPrimary ? getRoleColor(member.role) : getRoleOutlineColor(member.role)} text-[10px] px-2 py-0.5`}>
                                  {member.roleType}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              {renderStars(member.rating)}
                              <span className="font-medium">{member.rating}</span>
                              <span className="text-muted-foreground text-xs">({member.reviews})</span>
                            </div>
                            <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground font-medium">
                              {member.experience} yrs exp
                            </span>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">Specialties</p>
                              <div className="flex flex-wrap gap-1.5">
                                {member.specialties.slice(0, 2).map((s, i) => (
                                  <span key={i} className="bg-muted text-muted-foreground text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                                    {s}
                                  </span>
                                ))}
                                {member.specialties.length > 2 && (
                                  <span className="bg-muted text-muted-foreground text-[10px] px-2 py-1 rounded-md">
                                    +{member.specialties.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-3 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium">Next: {member.nextVisit}</p>
                              {member.hoursContracted !== undefined && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-muted-foreground">Hours this month</span>
                                    <span className="font-medium">{member.hoursThisMonth} / {member.hoursContracted}</span>
                                  </div>
                                  <Progress value={member.hoursContracted > 0 ? (member.hoursThisMonth! / member.hoursContracted) * 100 : 0} className="h-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto border-t border-border bg-muted/20">
                          <div className="flex border-b border-border text-sm">
                            <div className="flex-1 py-2 flex justify-center items-center gap-2 text-muted-foreground border-r border-border">
                              <Phone className="w-3.5 h-3.5" /> Call
                            </div>
                            <div className="flex-1 py-2 flex justify-center items-center gap-2 text-muted-foreground">
                              <Mail className="w-3.5 h-3.5" /> Email
                            </div>
                          </div>
                          <div className="flex p-2 gap-2">
                            <Button variant="default" size="sm" className="flex-1 h-8 text-xs rounded-lg" onClick={(e) => { e.stopPropagation(); }}>
                              Message
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs rounded-lg bg-card" onClick={(e) => { e.stopPropagation(); }}>
                              {member.role === 'Caregiver' ? 'Schedule' : 'Book'}
                            </Button>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg shrink-0" onClick={(e) => openReview(member, e)}>
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      // LIST VIEW
                      <div className="p-4 flex flex-col sm:flex-row w-full items-center gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-1/4 min-w-[200px]">
                          <div className="relative shrink-0">
                            <Avatar className={`w-12 h-12 border-2 ${member.isPrimary ? 'border-primary' : 'border-border'}`}>
                              <AvatarFallback className={`${member.role === 'Caregiver' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} font-serif`}>
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif font-medium truncate">{member.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{member.roleType}</p>
                          </div>
                        </div>
                        
                        <div className="w-full sm:w-1/5 hidden md:block">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-sm font-medium">{member.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{member.specialties[0]}</p>
                        </div>

                        <div className="w-full sm:w-1/4 hidden lg:block">
                          <p className="text-sm font-medium">{member.nextVisit}</p>
                          <p className="text-xs text-muted-foreground">Next Visit/Appt</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto ml-auto shrink-0 justify-end">
                          <Button variant="outline" size="sm" className="rounded-full bg-card h-8" onClick={(e) => { e.stopPropagation(); }}>
                            Message
                          </Button>
                          <Button variant="secondary" size="sm" className="rounded-full h-8" onClick={(e) => { e.stopPropagation(); }}>
                            {member.role === 'Caregiver' ? 'Schedule' : 'Book'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MEMBER DETAIL PANEL */}
      <Dialog
        open={showDetailPanel}
        onOpenChange={setShowDetailPanel}
      >
        <DialogContent
          
          className="
            w-[95vw]
            max-w-7xl
            h-[90vh]
            mt-[5vh]
            rounded-3xl
            p-0
            bg-card
            overflow-hidden
          "
        >
          {selectedMember && (
            <>
              <div className="p-4 pb-0 relative">
                <button
                  onClick={() => setShowDetailPanel(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 bg-muted p-2"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="sr-only">Close</span>
                
                
                <div className="flex flex-col items-center text-center mt-0 mb-3">
                  <div className="relative mb-4">
                    <Avatar className={`w-20 h-20 border-4 ${selectedMember.isPrimary ? 'border-primary' : 'border-background shadow-md'}`}>
                      <AvatarFallback className="text-xl font-serif bg-primary/5 text-primary">{selectedMember.initials}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-card ${getStatusColor(selectedMember.status)}`} />
                  </div>
                  <h2 className="text-xl font-serif mb-1">{selectedMember.name}</h2>
                  <Badge variant="outline" className={`rounded-full ${getRoleOutlineColor(selectedMember.role)} mb-2`}>
                    {selectedMember.roleType}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{selectedMember.experience} years experience</p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  <Button className="w-44 rounded-full shadow-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="w-40 rounded-full">
                    <Calendar className="w-4 h-4 mr-2" /> {selectedMember.role === 'Caregiver' ? 'Schedule' : 'Book'}
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <Tabs defaultValue="profile">

                  <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="patients">Patients</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
                      
                      {/* Rating Breakdown */}
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-serif font-medium text-lg">Reviews</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-bold">{selectedMember.rating}</span>
                            <span className="text-muted-foreground text-sm">({selectedMember.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-2xl p-4 space-y-2 mb-4 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Punctuality</span>
                            <span className="font-medium flex items-center gap-1">5.0 <Star className="w-3 h-3 text-primary fill-primary"/></span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Communication</span>
                            <span className="font-medium flex items-center gap-1">4.8 <Star className="w-3 h-3 text-primary fill-primary"/></span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Care Quality</span>
                            <span className="font-medium flex items-center gap-1">4.9 <Star className="w-3 h-3 text-primary fill-primary"/></span>
                          </div>
                        </div>
                      </section>

                      {/* Bio & Details */}
                      <section className="space-y-4">
                        <h3 className="font-serif font-medium text-lg">About</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedMember.bio}
                        </p>

                        <div className="space-y-3 pt-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Specialties</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedMember.specialties.map(s => (
                                <Badge key={s} variant="secondary" className="font-normal bg-muted text-foreground hover:bg-muted">{s}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Languages</p>
                            <p className="text-sm">{selectedMember.languages.join(", ")}</p>
                          </div>
                          {selectedMember.certifications && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Certifications</p>
                              <ul className="text-sm space-y-1 list-inside list-disc text-muted-foreground">
                                {selectedMember.certifications.map(c => <li key={c}>{c}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </section>

                      {/* Visit History */}
                      <section>
                        <h3 className="font-serif font-medium text-lg mb-4">Recent History</h3>
                        {selectedMember.history.length > 0 ? (
                          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:ml-2.5 md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                            {selectedMember.history.map((h, i) => (
                              <div key={i} className="relative flex items-start gap-4">
                                <div className="absolute left-0 w-5 h-5 rounded-full bg-background border-2 border-primary mt-0.5 flex items-center justify-center shadow-sm z-10" />
                                <div className="pl-8">
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">{h.date} • {h.duration}</p>
                                  <p className="text-sm font-medium mb-1">{h.type}</p>
                                  <p className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/50">{h.note}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No recent history with this provider.</p>
                        )}
                      </section>
                    
                      {/* Contact */}
                      <section className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <h3 className="font-serif font-medium mb-3">Contact Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0 border border-border">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span>{selectedMember.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0 border border-border">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span>{selectedMember.email}</span>
                          </div>
                          {selectedMember.location && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0 border border-border">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <span>{selectedMember.location}</span>
                            </div>
                          )}
                        </div>
                      </section>
                    </div>
                  </TabsContent>

                  <TabsContent value="patients">
                    <div className="space-y-4">
                      <Card className="mt-2">
                        <CardHeader>
                          <CardTitle>Assigned Patients</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">
                                  👤 Margaret Chen
                                </p>
                              </div>

                              <Badge>
                                Primary
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">
                                  👤 John Peterson
                                </p>
                              </div>

                              <Badge variant="outline">
                                Secondary
                              </Badge>
                            </div>

                          </div>
                        </CardContent>
                      </Card>
                      <Card className="mt-2">
                        <CardHeader>
                          <CardTitle>Recent Care Notes</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div className="p-3 rounded-lg bg-muted">
                            Assisted with morning medication.
                          </div>

                          <div className="p-3 rounded-lg bg-muted">
                            Completed mobility exercises.
                          </div>

                          <div className="p-3 rounded-lg bg-muted">
                            Family updated on progress.
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule">
                    <div className="space-y-4">
                      <Card className="mt-2">
                        <CardHeader>
                          <CardTitle>Upcoming Visits</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">

                          <div className="border rounded-lg p-3">
                            <p className="font-medium">
                              👤 Margaret Chen
                            </p>
                            <p className="text-sm text-muted-foreground">
                              📅 Jun 25, 2026 • 11:00 AM
                            </p>
                          </div>

                          <div className="border rounded-lg p-3">
                            <p className="font-medium">
                              👤John Peterson
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Jun 26, 2026 • 09:00 AM
                            </p>
                          </div>

                        </CardContent>
                      </Card>
                      <Card className="mt-2">
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Patient Satisfaction</span>
                              <span>4.8 / 5</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full w-[96%] bg-primary rounded-full" />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Completed Visits</span>
                              <span>124</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full w-[85%] bg-primary rounded-full" />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Response Time</span>
                              <span>15 mins</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full w-[90%] bg-primary rounded-full" />
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                      <Card className="mt-2">
                        <CardHeader>
                          <CardTitle>Availability Schedule</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">

                          <div className="flex justify-between text-sm">
                            <span>Monday</span>
                            <span>09:00 AM - 05:00 PM</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Tuesday</span>
                            <span>09:00 AM - 05:00 PM</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Wednesday</span>
                            <span>09:00 AM - 05:00 PM</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Thursday</span>
                            <span>09:00 AM - 05:00 PM</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Friday</span>
                            <span>09:00 AM - 05:00 PM</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Saturday</span>
                            <span>10:00 AM - 02:00 PM</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span>Sunday</span>
                            <Badge variant="outline">
                              Off Duty
                            </Badge>
                          </div>

                          <div className="pt-3 border-t">
                            <p className="text-sm text-muted-foreground">
                              Next Available Slot
                            </p>
                            <p className="font-medium">
                              Jun 25, 2026 • 11:00 AM
                            </p>
                          </div>

                        </CardContent>
                      </Card>
                      <Card className="mt-2">
                        <CardHeader>
                          <CardTitle>Certifications & Licenses</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">

                          <div className="border rounded-lg p-3">
                            <p className="font-medium">
                              Registered Caregiver License
                            </p>
                            <p className="text-sm text-muted-foreground">
                              License #CG-2026-1045
                            </p>
                            <Badge className="mt-2">
                              Active
                            </Badge>
                          </div>

                          <div className="border rounded-lg p-3">
                            <p className="font-medium">
                              CPR & First Aid Certification
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires Dec 2027
                            </p>
                            <Badge className="mt-2">
                              Verified
                            </Badge>
                          </div>

                          <div className="border rounded-lg p-3">
                            <p className="font-medium">
                              Elder Care Specialist Training
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Completed 2025
                            </p>
                            <Badge className="mt-2">
                              Completed
                            </Badge>
                          </div>

                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  </Tabs>
            
             
                <div className="flex justify-center pb-4">
                  <button className="text-xs text-destructive hover:underline">
                    Report an issue with this provider
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* REQUEST NEW CAREGIVER MODAL */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Request a New Caregiver</DialogTitle>
            <DialogDescription>
              Tell us about Margaret's current needs, and we'll match her with the perfect caregiver.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <section className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Care Type</h3>
              <RadioGroup defaultValue="part-time" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Full-time", "Part-time", "On-call"].map((type) => (
                  <div key={type}>
                    <RadioGroupItem value={type.toLowerCase()} id={`type-${type}`} className="peer sr-only" />
                    <Label
                      htmlFor={`type-${type}`}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center"
                    >
                      <Clock className="mb-2 h-5 w-5 text-muted-foreground peer-data-[state=checked]:text-primary" />
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </section>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Required Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {["Dementia Care", "Mobility", "Medication", "Meal Prep", "Companionship", "Night Care"].map(spec => (
                  <Badge key={spec} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-sm py-1.5 px-3 rounded-full transition-colors font-normal">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hours per week (estimated)</Label>
                <Input type="number" placeholder="e.g. 20" className="bg-card" />
              </div>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="tagalog">Tagalog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea placeholder="Any specific personality traits or preferences?" className="bg-card resize-none" rows={3} />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Timeline</h3>
              <div className="flex flex-wrap gap-2">
                {["Within 24hrs", "Within 1 week", "Within 2 weeks"].map(time => (
                  <Badge key={time} variant="secondary" className="cursor-pointer hover:bg-muted text-sm py-1.5 px-3 rounded-full font-normal">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={submitRequest} className="rounded-full px-8 shadow-sm">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WRITE A REVIEW MODAL */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Rate {reviewTarget?.name}</DialogTitle>
            <DialogDescription>
              Your feedback helps us maintain the highest quality of care. Reviews are internal and shared anonymously.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              {[
                { key: "overall", label: "Overall Experience" },
                { key: "punctuality", label: "Punctuality & Reliability" },
                { key: "communication", label: "Communication" },
                { key: "careQuality", label: "Quality of Care" }
              ].map(cat => (
                <div key={cat.key} className="flex items-center justify-between bg-muted/40 p-3 rounded-xl">
                  <span className="font-medium text-sm">{cat.label}</span>
                  <div className="flex gap-1 cursor-pointer">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-6 h-6 transition-colors ${ratingValues[cat.key] >= star ? 'fill-primary text-primary' : 'text-muted-foreground/30 hover:text-primary/40'}`}
                        onClick={() => setRatingValues(prev => ({...prev, [cat.key]: star}))}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Written Review (Optional)</Label>
              <Textarea placeholder="Share specific details about your experience..." className="bg-card resize-none" rows={4} />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={submitReview} className="rounded-full px-8 shadow-sm" disabled={ratingValues.overall === 0}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

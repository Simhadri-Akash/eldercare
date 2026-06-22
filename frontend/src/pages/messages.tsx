import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, Search, ChevronLeft, Plus, Circle,
  Heart, Phone, Video, Lock, Smile, Hash, Users, Bell, ThumbsUp, Check, X,
  Pin
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useListMessages, useCreateMessage, useMarkMessageRead, getListMessagesQueryKey, type Message as ApiMessage, type MessageCreate } from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// --- Mock Data & Types ---
type UserRole = "Senior" | "Family Admin" | "Care Manager" | "Operations Admin";

type UserProfile = {
  id: string;
  name: string;
  role: string;
  initials: string;
  colorClass: string;
  isOnline: boolean;
};

type Reaction = {
  emoji: string;
  count: number;
  byMe: boolean;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  dateGroup: string;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
};

type ConversationType = "dm" | "channel";

type Conversation = {
  id: string;
  type: ConversationType;
  participants: UserProfile[];
  name?: string; // For channels
  memberCount?: number;
  unreadCount: number;
  messages: Message[];
  pinnedMessage?: string;
};

// All users in platform
const usersDB: Record<string, UserProfile> = {
  margaret: { id: "u_margaret", name: "Margaret Chen", role: "Senior", initials: "MC", colorClass: "bg-[#7c9082]/20 text-[#7c9082]", isOnline: true },
  james: { id: "u_james", name: "James Chen", role: "Family Admin", initials: "JC", colorClass: "bg-blue-100 text-blue-700", isOnline: true },
  sarah: { id: "u_sarah", name: "Sarah Mitchell", role: "Care Manager", initials: "SM", colorClass: "bg-primary/10 text-primary", isOnline: true },
  diane: { id: "u_diane", name: "Diane Foster", role: "Operations Admin", initials: "DF", colorClass: "bg-purple-100 text-purple-700", isOnline: true },
  sharma: { id: "u_sharma", name: "Dr. Priya Sharma", role: "Primary Care", initials: "PS", colorClass: "bg-indigo-100 text-indigo-700", isOnline: false },
  support: { id: "u_support", name: "Befine Support", role: "Support", initials: "BS", colorClass: "bg-gray-200 text-gray-700", isOnline: true },
  lisa: { id: "u_lisa", name: "Lisa Chen", role: "Sister", initials: "LC", colorClass: "bg-rose-100 text-rose-700", isOnline: false },
  harold: { id: "u_harold", name: "Harold Brooks", role: "Senior", initials: "HB", colorClass: "bg-primary/10 text-primary", isOnline: true },
  walter: { id: "u_walter", name: "Walter Nguyen", role: "Senior", initials: "WN", colorClass: "bg-teal-100 text-teal-700", isOnline: false },
  admin: { id: "u_admin", name: "Befine Admin", role: "System Admin", initials: "BA", colorClass: "bg-slate-800 text-slate-100", isOnline: true },
  okafor: { id: "u_okafor", name: "James Okafor", role: "Care Worker", initials: "JO", colorClass: "bg-cyan-100 text-cyan-700", isOnline: true },
  finance: { id: "u_finance", name: "Finance Team", role: "Billing", initials: "FT", colorClass: "bg-emerald-100 text-emerald-700", isOnline: true },
  compliance: { id: "u_compliance", name: "CQC Compliance", role: "Compliance", initials: "CQ", colorClass: "bg-red-100 text-red-700", isOnline: true },
};

// Initial state builder based on role
const buildInitialState = (role: UserRole): { currentUser: UserProfile, conversations: Conversation[] } => {
  let currentUser: UserProfile;
  let conversations: Conversation[] = [];

  if (role === "Senior") {
    currentUser = usersDB.margaret;
    conversations = [
      {
        id: "c_sarah", type: "dm", participants: [usersDB.sarah], unreadCount: 1,
        pinnedMessage: "Next visit: Friday at 10 AM",
        messages: [
          { id: "m1", senderId: "u_sarah", text: "Good morning Margaret! Ready for today's exercises?", timestamp: "9:00 AM", dateGroup: "Today", reactions: { "👍": ["u_margaret"] } }
        ]
      },
      {
        id: "c_sharma", type: "dm", participants: [usersDB.sharma], unreadCount: 0,
        messages: [
          { id: "m2", senderId: "u_sharma", text: "Remember to take your evening medication.", timestamp: "8:00 AM", dateGroup: "Today" }
        ]
      },
      {
        id: "c_james", type: "dm", participants: [usersDB.james], unreadCount: 0,
        messages: [
          { id: "m3", senderId: "u_james", text: "How are you feeling today, Mom?", timestamp: "8:30 AM", dateGroup: "Today" }
        ]
      },
      {
        id: "c_support", type: "dm", participants: [usersDB.support], unreadCount: 0,
        messages: [
          { id: "m4", senderId: "u_support", text: "Your appointment has been confirmed.", timestamp: "Yesterday", dateGroup: "Yesterday" }
        ]
      }
    ];
  } else if (role === "Family Admin") {
    currentUser = usersDB.james;
    conversations = [
      {
        id: "c_sarah", type: "dm", participants: [usersDB.sarah], unreadCount: 1,
        pinnedMessage: "Margaret's Care Plan - Updated June 12",
        messages: [
          { id: "m1", senderId: "u_sarah", text: "Hi James, just completed today's visit with Margaret. She's in great spirits!", timestamp: "2:14 PM", dateGroup: "Yesterday" },
          { id: "m2", senderId: "u_james", text: "That's wonderful to hear, thank you Sarah!", timestamp: "2:20 PM", dateGroup: "Yesterday" },
          { id: "m3", senderId: "u_sarah", text: "She mentioned she'd love more puzzles for cognitive activities. I'll add it to her care plan.", timestamp: "2:21 PM", dateGroup: "Yesterday" },
          { id: "m4", senderId: "u_james", text: "Perfect. Also, should we adjust her afternoon medication timing?", timestamp: "4:05 PM", dateGroup: "Yesterday" },
          { id: "m5", senderId: "u_sarah", text: "Morning! I've spoken with Dr. Sharma — she recommends keeping the current schedule. I'll note it in the system.", timestamp: "9:08 AM", dateGroup: "Today" },
        ]
      },
      {
        id: "c_margaret", type: "dm", participants: [usersDB.margaret], unreadCount: 0,
        messages: [
          { id: "m6", senderId: "u_james", text: "Good morning Mom! How are you feeling today?", timestamp: "10:00 AM", dateGroup: "Monday" },
          { id: "m7", senderId: "u_margaret", text: "Good morning dear. I slept well. Sarah came by and we did some exercises.", timestamp: "10:15 AM", dateGroup: "Monday", reactions: { "❤️": ["u_james"] } },
        ]
      },
      {
        id: "c_sharma", type: "dm", participants: [usersDB.sharma], unreadCount: 0,
        messages: [
          { id: "m12", senderId: "u_sharma", text: "Hello Mr. Chen. The readings are within normal range. Continue monitoring. If it exceeds 140/90 consistently, let me know.", timestamp: "5:45 PM", dateGroup: "June 10" },
        ]
      },
      {
        id: "c_support", type: "dm", participants: [usersDB.support], unreadCount: 0,
        messages: [
          { id: "m15", senderId: "u_support", text: "Hello James! Your monthly care report for May 2026 is ready. You can download it from the Family Dashboard.", timestamp: "11:00 AM", dateGroup: "June 12" },
        ]
      },
      {
        id: "c_lisa", type: "dm", participants: [usersDB.lisa], unreadCount: 0,
        messages: [
          { id: "m18", senderId: "u_lisa", text: "Hey, did you see Mom's latest health report?", timestamp: "7:00 PM", dateGroup: "June 12" },
          { id: "m19", senderId: "u_james", text: "Yes, looking good overall. Worried about the missed physio though.", timestamp: "7:15 PM", dateGroup: "June 12" },
        ]
      },
      {
        id: "ch_family", type: "channel", participants: [usersDB.james, usersDB.lisa, usersDB.sarah], name: "family-updates", memberCount: 3, unreadCount: 0,
        messages: [
          { id: "m20", senderId: "u_sarah", text: "Weekly digest posted in the portal.", timestamp: "Friday", dateGroup: "Last Week" }
        ]
      }
    ];
  } else if (role === "Care Manager") {
    currentUser = usersDB.sarah;
    conversations = [
      {
        id: "c_margaret", type: "dm", participants: [usersDB.margaret], unreadCount: 0,
        messages: [{ id: "m1", senderId: "u_margaret", text: "Morning Sarah! I slept well.", timestamp: "8:00 AM", dateGroup: "Today" }]
      },
      {
        id: "c_harold", type: "dm", participants: [usersDB.harold], unreadCount: 1,
        messages: [{ id: "m2", senderId: "u_harold", text: "My knee is hurting more today.", timestamp: "8:45 AM", dateGroup: "Today" }]
      },
      {
        id: "c_walter", type: "dm", participants: [usersDB.walter], unreadCount: 1,
        messages: [{ id: "m3", senderId: "u_walter", text: "I feel very tired.", timestamp: "9:10 AM", dateGroup: "Today" }]
      },
      {
        id: "c_sharma", type: "dm", participants: [usersDB.sharma], unreadCount: 0,
        messages: [{ id: "m4", senderId: "u_sharma", text: "Can you check Walter's BP today?", timestamp: "Yesterday", dateGroup: "Yesterday" }]
      },
      {
        id: "c_admin", type: "dm", participants: [usersDB.admin], unreadCount: 0,
        messages: [{ id: "m5", senderId: "u_admin", text: "Monthly reports due June 20.", timestamp: "Yesterday", dateGroup: "Yesterday" }]
      },
      {
        id: "c_james", type: "dm", participants: [usersDB.james], unreadCount: 0,
        messages: [{ id: "m6", senderId: "u_james", text: "Thanks for yesterday's update.", timestamp: "Yesterday", dateGroup: "Yesterday" }]
      },
      {
        id: "ch_clinical", type: "channel", participants: [usersDB.sarah, usersDB.sharma, usersDB.okafor], name: "clinical-team", memberCount: 12, unreadCount: 2,
        messages: [{ id: "m7", senderId: "u_sharma", text: "New protocols uploaded to the intranet.", timestamp: "8:00 AM", dateGroup: "Today" }]
      }
    ];
  } else {
    // Operations Admin
    currentUser = usersDB.diane;
    conversations = [
      {
        id: "c_sarah", type: "dm", participants: [usersDB.sarah], unreadCount: 0,
        messages: [{ id: "m1", senderId: "u_sarah", text: "All 3 visits completed today.", timestamp: "4:00 PM", dateGroup: "Today" }]
      },
      {
        id: "c_okafor", type: "dm", participants: [usersDB.okafor], unreadCount: 1,
        messages: [{ id: "m2", senderId: "u_okafor", text: "Harold Brooks needs urgent follow-up.", timestamp: "4:30 PM", dateGroup: "Today" }]
      },
      {
        id: "c_finance", type: "dm", participants: [usersDB.finance], unreadCount: 3,
        messages: [{ id: "m3", senderId: "u_finance", text: "4 invoices pending approval.", timestamp: "11:00 AM", dateGroup: "Today" }]
      },
      {
        id: "c_compliance", type: "dm", participants: [usersDB.compliance], unreadCount: 0,
        messages: [{ id: "m4", senderId: "u_compliance", text: "Inspection scheduled for July 10.", timestamp: "Yesterday", dateGroup: "Yesterday" }]
      },
      {
        id: "ch_allstaff", type: "channel", participants: [usersDB.diane, usersDB.sarah, usersDB.okafor, usersDB.finance], name: "all-staff", memberCount: 45, unreadCount: 0,
        messages: [{ id: "m5", senderId: "u_diane", text: "Please review the updated holiday schedule.", timestamp: "Monday", dateGroup: "Monday" }]
      }
    ];
  }

  return { currentUser, conversations };
};

const EMOJI_LIST = ["👍", "❤️", "😊", "✓", "😂", "🎉", "🙏", "👏"];

export default function MessagesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeRole, setActiveRole] = useState<UserRole>("Family Admin");
  
  const [appState, setAppState] = useState(() => buildInitialState("Family Admin"));
  const { currentUser, conversations } = appState;
  
  // Live messages are persisted while the prepared conversations remain as fallback content.
  const { data: apiMessages } = useListMessages();
  const createMessageMutation = useCreateMessage({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() }),
      onError: () => toast({ title: "Message not synced", description: "It remains visible locally. Check the API connection.", variant: "destructive" }),
    },
  });
  
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"dms" | "channels">("dms");
  const [typingVisible, setTypingVisible] = useState(false);
  const [showPinned, setShowPinned] = useState(true);
  
  // Modal state
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMsgTo, setNewMsgTo] = useState<string[]>([]);
  const [newMsgSubject, setNewMsgSubject] = useState("");
  const [newMsgText, setNewMsgText] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Switch role handler
  useEffect(() => {
    const newState = buildInitialState(activeRole);
    setAppState(newState);
    setActiveConvId(newState.conversations[0]?.id || null);
    setIsMobileListVisible(true);
  }, [activeRole]);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [activeConvId, conversations]);

  // Simulate typing indicator when switching convo
  useEffect(() => {
    if (activeConvId && activeConversation?.messages[activeConversation.messages.length - 1]?.senderId !== currentUser.id) {
      const typingTimer = setTimeout(() => setTypingVisible(true), 1500);
      const hideTimer = setTimeout(() => setTypingVisible(false), 4000);
      return () => {
        clearTimeout(typingTimer);
        clearTimeout(hideTimer);
        setTypingVisible(false);
      };
    }

    return undefined;
  }, [activeConvId, currentUser.id, activeConversation?.messages]);

  // Mark conversation as read
  useEffect(() => {
    if (activeConvId) {
      setAppState(prev => ({
        ...prev,
        conversations: prev.conversations.map(c => 
          c.id === activeConvId && c.unreadCount > 0 
            ? { ...c, unreadCount: 0 } 
            : c
        )
      }));
    }
  }, [activeConvId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    // Optimistic update
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: messageInput.trim(),
      timestamp: timeString,
      dateGroup: "Today",
      reactions: {}
    };

    setAppState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => {
        if (c.id === activeConvId) {
          return { ...c, messages: [...c.messages, newMessage] };
        }
        return c;
      })
    }));

    setMessageInput("");
    setTypingVisible(false);
    const recipient = activeConversation?.participants[0]?.id ?? "care-team";
    createMessageMutation.mutate({ data: { senderId: currentUser.id, recipientId: recipient, text: newMessage.text } });
    toast({ description: "Message sent" });
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    setAppState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => {
        if (c.id !== activeConvId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id !== msgId) return m;
            const currentReactions = m.reactions || {};
            const userReactions = currentReactions[emoji] || [];
            
            // Toggle reaction
            const newReactions = { ...currentReactions };
            if (userReactions.includes(currentUser.id)) {
              newReactions[emoji] = userReactions.filter(id => id !== currentUser.id);
              if (newReactions[emoji].length === 0) delete newReactions[emoji];
            } else {
              newReactions[emoji] = [...userReactions, currentUser.id];
            }
            
            return { ...m, reactions: newReactions };
          })
        };
      })
    }));
  };

  const handleSendNewMessage = () => {
    if (newMsgTo.length === 0 || !newMsgText.trim()) return;
    
    createMessageMutation.mutate({ data: { senderId: currentUser.id, recipientId: newMsgTo[0], subject: newMsgSubject || undefined, text: newMsgText.trim() } });
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${newMsgTo.length} recipient(s).`,
    });
    
    setIsNewMessageOpen(false);
    setNewMsgTo([]);
    setNewMsgSubject("");
    setNewMsgText("");
  };

  const insertEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(c => {
    if (activeTab === "dms" && c.type !== "dm") return false;
    if (activeTab === "channels" && c.type !== "channel") return false;
    
    const searchLower = searchQuery.toLowerCase();
    if (c.type === "channel") {
      return c.name?.toLowerCase().includes(searchLower);
    }
    const participant = c.participants[0];
    return participant.name.toLowerCase().includes(searchLower) ||
           participant.role.toLowerCase().includes(searchLower);
  });

  const formatMessageGroup = (messages: Message[]) => {
    const groups: { dateGroup: string; messages: Message[] }[] = [];
    messages.forEach(m => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateGroup === m.dateGroup) {
        lastGroup.messages.push(m);
      } else {
        groups.push({ dateGroup: m.dateGroup, messages: [m] });
      }
    });
    return groups;
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden font-sans">
      
      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Conversation List */}
        <div 
          className={`
            w-full md:w-[320px] lg:w-[360px] flex-shrink-0 flex flex-col bg-card border-r border-border
            ${!isMobileListVisible ? 'hidden md:flex' : 'flex'}
          `}
        >
          {/* Header & Role Switcher */}
          <div className="p-4 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" data-testid="link-home">
                <img src="/befine-logo.jpeg" alt="Befine" className="h-8 object-contain" />
              </Link>
              
              <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" data-testid="btn-new-message">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" data-testid="modal-new-message">
                  <DialogHeader>
                    <DialogTitle className="font-serif">New Message</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To:</label>
                      <Select 
                        value={newMsgTo[0] || ""} 
                        onValueChange={(val) => setNewMsgTo([val])} 
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a person..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(usersDB).filter(u => u.id !== currentUser.id).map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} <span className="text-muted-foreground ml-1">({user.role})</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject (Optional):</label>
                      <Input 
                        placeholder="Brief subject..." 
                        value={newMsgSubject}
                        onChange={(e) => setNewMsgSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message:</label>
                      <Textarea 
                        placeholder="Type your message here..." 
                        value={newMsgText}
                        onChange={(e) => setNewMsgText(e.target.value)}
                        className="min-h-[120px] resize-none"
                        data-testid="input-new-message-text"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendNewMessage} disabled={newMsgTo.length === 0 || !newMsgText.trim()} data-testid="btn-send-new-message">
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Select value={activeRole} onValueChange={(val) => setActiveRole(val as UserRole)}>
              <SelectTrigger className="h-8 bg-muted/50 border-transparent text-sm w-full font-medium" data-testid="role-switcher">
                <SelectValue placeholder="Switch Role View" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>View App As:</SelectLabel>
                  <SelectItem value="Senior">Margaret Chen (Senior)</SelectItem>
                  <SelectItem value="Family Admin">James Chen (Family Admin)</SelectItem>
                  <SelectItem value="Care Manager">Sarah Mitchell (Care Manager)</SelectItem>
                  <SelectItem value="Operations Admin">Diane Foster (Ops Admin)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 h-9 bg-background border-border/50 text-sm focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-conversations"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "dms" | "channels")} className="flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-border">
              <TabsList className="grid w-full grid-cols-2 h-9 bg-muted/50">
                <TabsTrigger value="dms" className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">Direct</TabsTrigger>
                <TabsTrigger value="channels" className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">Channels</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No conversations found.
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isActive = activeConvId === conv.id;
                    const lastMessage = conv.messages[conv.messages.length - 1];
                    const isChannel = conv.type === "channel";
                    const participant = conv.participants[0];
                    
                    return (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setActiveConvId(conv.id);
                          setIsMobileListVisible(false);
                          setShowPinned(true);
                        }}
                        className={`
                          w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left group
                          ${isActive ? 'bg-primary/10' : 'hover:bg-accent/50'}
                        `}
                        data-testid={`conv-${conv.id}`}
                      >
                        <div className="relative shrink-0">
                          {isChannel ? (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-background transition-colors">
                              <Hash className="w-5 h-5" />
                            </div>
                          ) : (
                            <>
                              <Avatar className={`w-10 h-10 border border-background shadow-sm ${participant.colorClass}`}>
                                <AvatarFallback className="font-medium bg-transparent text-sm">{participant.initials}</AvatarFallback>
                              </Avatar>
                              {participant.isOnline && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className={`font-medium text-sm truncate ${isActive ? 'text-foreground' : 'text-foreground'}`}>
                              {isChannel ? `#${conv.name}` : participant.name}
                            </span>
                            {lastMessage && (
                              <span className={`text-[10px] whitespace-nowrap ml-2 ${conv.unreadCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                {lastMessage.timestamp}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <span className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                              {lastMessage ? (
                                <>{lastMessage.senderId === currentUser.id ? "You: " : ""}{lastMessage.text}</>
                              ) : (
                                <span className="italic">No messages yet</span>
                              )}
                            </span>
                            
                            {conv.unreadCount > 0 && (
                              <Badge className="shrink-0 rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 py-0 text-[10px] bg-primary text-primary-foreground border-none">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Right Panel: Chat Thread */}
        <div 
          className={`
            flex-1 flex flex-col bg-white dark:bg-card relative
            ${isMobileListVisible ? 'hidden md:flex' : 'flex'}
          `}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-[72px] px-4 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 shrink-0 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    onClick={() => setIsMobileListVisible(true)}
                    data-testid="btn-back-to-list"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {activeConversation.type === "channel" ? (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border">
                      <Hash className="w-5 h-5" />
                    </div>
                  ) : (
                    <Avatar className={`w-10 h-10 border border-background shadow-sm ${activeConversation.participants[0].colorClass}`}>
                      <AvatarFallback className="bg-transparent">{activeConversation.participants[0].initials}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-sm md:text-base text-foreground flex items-center gap-2">
                      {activeConversation.type === "channel" ? `#${activeConversation.name}` : activeConversation.participants[0].name}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      {activeConversation.type === "channel" ? (
                        <>
                          <Users className="w-3 h-3" />
                          <span>{activeConversation.memberCount} members</span>
                        </>
                      ) : (
                        <>
                          <span>{activeConversation.participants[0].role}</span>
                          <span className="w-1 h-1 rounded-full bg-border"></span>
                          {activeConversation.participants[0].isOnline ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <Circle className="w-2 h-2 fill-current" /> Online
                            </span>
                          ) : (
                            <span>Offline</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => toast({ description: "Starting voice call..." })}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => toast({ description: "Starting video call..." })}>
                    <Video className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8 hidden sm:flex text-primary hover:text-primary hover:bg-primary/10 font-medium"
                    onClick={() => toast({ description: "Opening profile..." })}
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Pinned Message */}
              {activeConversation.pinnedMessage && showPinned && (
                <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 flex items-start justify-between gap-4 shrink-0 z-0 shadow-sm">
                  <div className="flex items-start gap-2 text-sm">
                    <Pin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-primary font-medium leading-tight">
                      Pinned: <span className="font-normal opacity-90">{activeConversation.pinnedMessage}</span>
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-primary hover:bg-primary/10 shrink-0 -mt-0.5 -mr-1" onClick={() => setShowPinned(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="max-w-3xl mx-auto space-y-6 pb-6">
                  
                  {formatMessageGroup(activeConversation.messages).map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      {/* Date Separator */}
                      <div className="flex justify-center my-6">
                        <span className="bg-white dark:bg-card px-3 py-1 rounded-full text-xs font-medium text-muted-foreground shadow-sm border border-border">
                          {group.dateGroup}
                        </span>
                      </div>
                      
                      {group.messages.map((msg, mIdx) => {
                        const isMe = msg.senderId === currentUser.id;
                        
                        // Time clustering logic
                        const prevMsg = group.messages[mIdx - 1];
                        const nextMsg = group.messages[mIdx + 1];
                        
                        // Parse simple times for clustering (basic heuristic)
                        const isConsecutive = prevMsg && prevMsg.senderId === msg.senderId;
                        const isFirstInGroup = !isConsecutive;
                        const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
                        
                        const sender = isMe ? currentUser : 
                          (usersDB[msg.senderId.replace('u_', '')] || activeConversation.participants[0]);

                        const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;
                        
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${!isFirstInGroup ? 'mt-1' : 'mt-4'} group/message`}
                          >
                            {!isMe && (
                              <div className="w-8 shrink-0 mr-3 flex items-end">
                                {isLastInGroup && (
                                  <Avatar className={`w-8 h-8 shadow-sm border border-background ${sender.colorClass}`}>
                                    <AvatarFallback className="bg-transparent text-xs font-medium">{sender.initials}</AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            )}
                            
                            <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>
                              
                              {!isMe && isFirstInGroup && activeConversation.type === "channel" && (
                                <span className="text-xs font-medium text-muted-foreground ml-1 mb-1">
                                  {sender.name}
                                </span>
                              )}

                              <div className="flex items-center gap-2">
                                {/* Left side actions for my messages */}
                                {isMe && (
                                  <div className="opacity-0 group-hover/message:opacity-100 transition-opacity">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:bg-muted">
                                          <Smile className="w-3.5 h-3.5" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-1.5 flex gap-1" align="center" side="top">
                                        {EMOJI_LIST.slice(0, 4).map(e => (
                                          <button key={e} onClick={() => handleAddReaction(msg.id, e)} className="hover:bg-muted p-1.5 rounded text-lg transition-transform hover:scale-110">
                                            {e}
                                          </button>
                                        ))}
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}

                                {/* Message Bubble */}
                                <div 
                                  className={`
                                    relative px-4 py-2.5 text-[15px] shadow-sm leading-relaxed
                                    ${isMe 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-white dark:bg-card border border-border/50 text-card-foreground'
                                    }
                                    ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : ''}
                                    ${isFirstInGroup && !isLastInGroup ? (isMe ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm') : ''}
                                    ${!isFirstInGroup && !isLastInGroup ? (isMe ? 'rounded-l-2xl rounded-r-sm' : 'rounded-r-2xl rounded-l-sm') : ''}
                                    ${!isFirstInGroup && isLastInGroup ? (isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm') : ''}
                                  `}
                                >
                                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                </div>

                                {/* Right side actions for others' messages */}
                                {!isMe && (
                                  <div className="opacity-0 group-hover/message:opacity-100 transition-opacity">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:bg-muted">
                                          <Smile className="w-3.5 h-3.5" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-1.5 flex gap-1" align="center" side="top">
                                        {EMOJI_LIST.slice(0, 4).map(e => (
                                          <button key={e} onClick={() => handleAddReaction(msg.id, e)} className="hover:bg-muted p-1.5 rounded text-lg transition-transform hover:scale-110">
                                            {e}
                                          </button>
                                        ))}
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}
                              </div>
                              
                              {/* Reactions Row */}
                              {hasReactions && (
                                <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
                                  {Object.entries(msg.reactions!).map(([emoji, users]) => (
                                    <button 
                                      key={emoji}
                                      onClick={() => handleAddReaction(msg.id, emoji)}
                                      className={`
                                        inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors
                                        ${users.includes(currentUser.id) 
                                          ? 'bg-primary/10 border-primary/20 text-primary' 
                                          : 'bg-white dark:bg-card border-border text-muted-foreground hover:bg-muted'
                                        }
                                      `}
                                    >
                                      <span>{emoji}</span>
                                      {users.length > 1 && <span>{users.length}</span>}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Timestamp and Status */}
                              {isLastInGroup && (
                                <div className={`flex items-center gap-1 mt-1 text-[10px] text-muted-foreground mx-1`}>
                                  <span>{msg.timestamp}</span>
                                  {isMe && mIdx === activeConversation.messages.length - 1 && (
                                    <span className="flex items-center text-primary/80 ml-1">
                                      <Check className="w-3 h-3" /> Seen
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {typingVisible && (
                    <div className="flex justify-start mt-4">
                      <div className="w-8 shrink-0 mr-3 flex items-end">
                        <Avatar className={`w-8 h-8 shadow-sm ${activeConversation.participants[0].colorClass}`}>
                          <AvatarFallback className="bg-transparent">{activeConversation.participants[0].initials}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="bg-white dark:bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10 w-[72px]">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}

                  <div className="h-2" /> {/* Bottom padding */}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-3 sm:p-4 bg-white dark:bg-card border-t border-border shrink-0 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.05)]">
                <form 
                  className="max-w-3xl mx-auto flex flex-col gap-2"
                  onSubmit={handleSendMessage}
                >
                  <div className="flex items-end gap-2 bg-muted/40 dark:bg-muted/20 p-1.5 rounded-2xl border border-border/60 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all shadow-sm">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-card mb-0.5 ml-0.5"
                      onClick={() => toast({ description: "Attach file modal..." })}
                      data-testid="btn-attach"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <Textarea 
                      placeholder={`Message ${activeConversation.type === "channel" ? '#' + activeConversation.name : activeConversation.participants[0].name}...`}
                      className="flex-1 min-h-[44px] max-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 px-2 py-3 text-sm shadow-none"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      data-testid="input-message"
                    />
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="shrink-0 rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-card mb-0.5"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-2" align="end" side="top">
                        <div className="grid grid-cols-6 gap-1">
                          {EMOJI_LIST.concat(["☀️", "🌙", "💊", "🏥"]).map(e => (
                            <button 
                              key={e} 
                              type="button"
                              onClick={() => insertEmoji(e)}
                              className="h-10 text-xl hover:bg-muted rounded-md flex items-center justify-center transition-colors"
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!messageInput.trim()}
                      className="shrink-0 rounded-full h-9 w-9 mb-0.5 mr-0.5 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      data-testid="btn-send"
                    >
                      <Send className="h-4 w-4 -ml-0.5 mt-0.5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Lock className="w-3 h-3" /> End-to-end encrypted
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 hidden sm:inline-block">
                      <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline
                    </span>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/10">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif text-foreground mb-2">Your Messages</h2>
              <p className="text-sm text-muted-foreground max-w-sm mb-8">
                Select a conversation from the sidebar or start a new one to securely chat with care providers and family members.
              </p>
              <Button onClick={() => setIsNewMessageOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Message
              </Button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

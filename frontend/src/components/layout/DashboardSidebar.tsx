import React from "react";
import { Link } from "wouter";
import {
  Activity,
  Calendar,
  FileText,
  Users,
  MessageCircle,
  Bell,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import {  PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
   
    const mobileMenuOpen = true;
    const navClass = (path:string) =>
    `
    flex items-center
    ${sidebarOpen ? "gap-3 px-4 justify-start" : "justify-center"}
    py-3 rounded-xl
    transition-all
    ${location.pathname === path
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted"}
    `;
  
 return (
  <>

    <aside
        className={`
          fixed inset-y-0 left-0 z-40
          bg-background border-r flex flex-col
          transition-all duration-300
          ${sidebarOpen ? "w-64" :"w-20"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <img
                src="/befine-logo.jpeg"
                alt="Befine"
                className="h-8"
              />

              {sidebarOpen && (
                <span className="font-semibold">
                  Befine
                </span>
              )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
                ) : (
                <PanelLeftOpen className="h-4 w-4" />
                )}
            </Button>
        </div>
        <div
          className={`p-4 flex flex-col items-center border-b ${
            !sidebarOpen ? "py-6" : ""
          }`}
        >
        <Avatar
            className={`border-4 border-primary/10 ${
                sidebarOpen ? "w-16 h-16 mb-3" : "w-10 h-10"
            }`}
        >
            <AvatarImage src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=250&auto=format&fit=crop" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          {sidebarOpen ? (
            <>
              <h2 className="font-semibold">Margaret Chen</h2>
              <p className="text-sm text-muted-foreground">Age 74</p>
            </>
          ) : null}
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
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {sidebarOpen && "Back to Home"}
            </Button>
          </Link>
        </div>
    </aside>
  </>
        
);
}
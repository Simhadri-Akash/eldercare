import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import FamilyDashboard from "@/pages/family-dashboard";
import CaregiverDashboard from "@/pages/caregiver-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import MessagesPage from "@/pages/messages";
import NotificationsPage from "@/pages/notifications";
import HealthReportsPage from "@/pages/health-reports";
import AppointmentsPage from "@/pages/appointments";
import BillingPage from "@/pages/billing";
import CareTeamPage from "@/pages/care-team";
import { AuthPage } from "@/pages/auth";
import LegalPage from "@/pages/legal";
import { AuthProvider } from "@/lib/auth";
import CaregiverClients from "@/pages/caregiver-clients";
import CaregiverSchedule from "./pages/caregiver-schedule";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>

      <Route path="/caregiver-schedule" component={CaregiverSchedule} />  
      <Route path="/caregiver-clients"component={CaregiverClients}/>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/family-dashboard" component={FamilyDashboard} />
      <Route path="/caregiver-dashboard" component={CaregiverDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/health-reports" component={HealthReportsPage} />
      <Route path="/appointments" component={AppointmentsPage} />
      <Route path="/billing" component={BillingPage} />
      <Route path="/care-team" component={CareTeamPage} />
      <Route path="/login"><AuthPage mode="login" /></Route>
      <Route path="/signup"><AuthPage mode="signup" /></Route>
      <Route path="/privacy"><LegalPage title="Privacy Policy" /></Route>
      <Route path="/terms"><LegalPage title="Terms of Service" /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider><TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider></AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

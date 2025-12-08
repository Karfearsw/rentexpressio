import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LandlordDashboard from "@/pages/landlord-dashboard";
import TenantPortal from "@/pages/tenant-portal";
import AdminConsole from "@/pages/admin-console";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Landlord Routes */}
      <Route path="/landlord" component={LandlordDashboard} />
      <Route path="/landlord/*" component={LandlordDashboard} />
      
      {/* Tenant Routes */}
      <Route path="/tenant" component={TenantPortal} />
      <Route path="/tenant/*" component={TenantPortal} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminConsole} />
      <Route path="/admin/*" component={AdminConsole} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TenantApply from "@/pages/tenant-apply";

// Landlord Pages
import LandlordDashboard from "@/pages/landlord-dashboard";
import LandlordProperties from "@/pages/landlord-properties";
import LandlordApplications from "@/pages/landlord-applications";
import LandlordLeases from "@/pages/landlord-leases";
import LandlordTenants from "@/pages/landlord-tenants";

// Tenant Pages
import TenantPortal from "@/pages/tenant-portal";
import TenantPay from "@/pages/tenant-pay";
import TenantMaintenance from "@/pages/tenant-maintenance";

// Admin Pages
import AdminConsole from "@/pages/admin-console";
import AdminUsers from "@/pages/admin-users";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apply" component={TenantApply} />
      
      {/* Landlord Routes */}
      <Route path="/landlord" component={LandlordDashboard} />
      <Route path="/landlord/properties" component={LandlordProperties} />
      <Route path="/landlord/applications" component={LandlordApplications} />
      <Route path="/landlord/leases" component={LandlordLeases} />
      <Route path="/landlord/tenants" component={LandlordTenants} />
      
      {/* Tenant Routes */}
      <Route path="/tenant" component={TenantPortal} />
      <Route path="/tenant/pay" component={TenantPay} />
      <Route path="/tenant/maintenance" component={TenantMaintenance} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminConsole} />
      <Route path="/admin/users" component={AdminUsers} />
      
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
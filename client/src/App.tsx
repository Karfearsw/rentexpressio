import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import ScreeningPolicyPage from "@/pages/screening-policy";
import PricingPage from "@/pages/pricing";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import CareersPage from "@/pages/careers";
import TenantApply from "@/pages/tenant-apply";

// Landlord Pages
import LandlordDashboard from "@/pages/landlord-dashboard";
import LandlordProperties from "@/pages/landlord-properties";
import LandlordApplications from "@/pages/landlord-applications";
import LandlordLeases from "@/pages/landlord-leases";
import LandlordTenants from "@/pages/landlord-tenants";
import LandlordSettings from "@/pages/landlord-settings";
import LandlordCharges from "@/pages/landlord-charges";
import LandlordSyndication from "@/pages/landlord-syndication";

// Tenant Pages
import TenantPortal from "@/pages/tenant-portal";
import TenantPay from "@/pages/tenant-pay";
import TenantMaintenance from "@/pages/tenant-maintenance";
import TenantProfile from "@/pages/tenant-profile";
import TenantDocuments from "@/pages/tenant-documents";

// Admin Pages
import AdminConsole from "@/pages/admin-console";
import AdminUsers from "@/pages/admin-users";
import AdminCompliance from "@/pages/admin-compliance";
import AdminSettings from "@/pages/admin-settings";
import SignUpSelect from "@/pages/signup-select";
import SignUpTenant from "@/pages/signup-tenant";
import SignUpLandlord from "@/pages/signup-landlord";
import SignUpEnterprise from "@/pages/signup-enterprise";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={AuthPage} />
      <Route path="/apply" component={TenantApply} />
      <Route path="/signup" component={SignUpSelect} />
      <Route path="/signup/tenant" component={SignUpTenant} />
      <Route path="/signup/landlord" component={SignUpLandlord} />
      <Route path="/signup/enterprise" component={SignUpEnterprise} />
      <ProtectedRoute path="/landlord/dashboard" component={LandlordDashboard} />
      <ProtectedRoute path="/tenant/dashboard" component={TenantPortal} />
      <ProtectedRoute path="/admin/dashboard" component={AdminConsole} />
      
      {/* Landlord Routes */}
      <ProtectedRoute path="/landlord" component={LandlordDashboard} />
      <ProtectedRoute path="/landlord/properties" component={LandlordProperties} />
      <ProtectedRoute path="/landlord/applications" component={LandlordApplications} />
      <ProtectedRoute path="/landlord/leases" component={LandlordLeases} />
      <ProtectedRoute path="/landlord/tenants" component={LandlordTenants} />
      <ProtectedRoute path="/landlord/charges" component={LandlordCharges} />
      <ProtectedRoute path="/landlord/syndication" component={LandlordSyndication} />
      <ProtectedRoute path="/landlord/settings" component={LandlordSettings} />
      
      {/* Tenant Routes */}
      <ProtectedRoute path="/tenant" component={TenantPortal} />
      <ProtectedRoute path="/tenant/pay" component={TenantPay} />
      <ProtectedRoute path="/tenant/maintenance" component={TenantMaintenance} />
      <ProtectedRoute path="/tenant/profile" component={TenantProfile} />
      <ProtectedRoute path="/tenant/documents" component={TenantDocuments} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminConsole} />
      <ProtectedRoute path="/admin/users" component={AdminUsers} />
      <ProtectedRoute path="/admin/compliance" component={AdminCompliance} />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} />

      {/* Static Pages */}
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/screening-policy" component={ScreeningPolicyPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/careers" component={CareersPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

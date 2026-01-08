import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Home,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

interface LayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="glass-header">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer h-12 w-32">
              <Logo showSubtext={false} className="w-full h-full" />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/landlord"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">For Landlords</span></Link>
            <Link href="/tenant"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">For Tenants</span></Link>
            <Link href="/admin"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Enterprise</span></Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex text-xs sm:text-sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="text-xs sm:text-sm px-3 sm:px-4 py-2 h-9 sm:h-10">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-12 sm:py-16 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12 max-w-6xl mx-auto">
            <div className="flex flex-col space-y-4 col-span-2 md:col-span-1">
              <div className="font-heading font-bold text-2xl tracking-tight">RentExpress</div>
              <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
                The Expressway to collect rent.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="font-bold text-base">Platform</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><Link href="/landlord"><span className="hover:text-white transition-colors cursor-pointer">Landlords</span></Link></li>
                <li><Link href="/tenant"><span className="hover:text-white transition-colors cursor-pointer">Tenants</span></Link></li>
                <li><Link href="/pricing"><span className="hover:text-white transition-colors cursor-pointer">Pricing</span></Link></li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="font-bold text-base">Company</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><Link href="/about"><span className="hover:text-white transition-colors cursor-pointer">About</span></Link></li>
                <li><Link href="/careers"><span className="hover:text-white transition-colors cursor-pointer">Careers</span></Link></li>
                <li><Link href="/contact"><span className="hover:text-white transition-colors cursor-pointer">Contact</span></Link></li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="font-bold text-base">Legal</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><Link href="/privacy"><span className="hover:text-white transition-colors cursor-pointer">Privacy</span></Link></li>
                <li><Link href="/terms"><span className="hover:text-white transition-colors cursor-pointer">Terms</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center">
             <p className="text-xs sm:text-sm text-primary-foreground/50">
               © {new Date().getFullYear()} RentExpress. All rights reserved.
             </p>
           </div>
         </div>
       </footer>
    </div>
  );
}

function SidebarNav({ menuItems, location, type }: any) {
  return (
    <div className="flex-1 py-6 px-4 space-y-1">
      {menuItems.map((item: any) => (
        <Link key={item.href} href={item.href}>
          <div className={`
            flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer group
            ${location === item.href 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
          `}>
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm hidden sm:inline">{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function DashboardLayout({ children, type = "landlord" }: LayoutProps & { type?: "landlord" | "admin" }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = type === "landlord" ? [
    { icon: LayoutDashboard, label: "Dashboard", href: "/landlord" },
    { icon: Building2, label: "Properties", href: "/landlord/properties" },
    { icon: Users, label: "Tenants", href: "/landlord/tenants" },
    { icon: Users, label: "Applications", href: "/landlord/applications" },
    { icon: FileText, label: "Leases", href: "/landlord/leases" },
    { icon: Settings, label: "Settings", href: "/landlord/settings" },
  ] : [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: ShieldCheck, label: "Compliance", href: "/admin/compliance" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed h-full z-30 overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-sidebar-border shrink-0 flex justify-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer h-16 w-40">
              <Logo className="w-full h-full" />
            </div>
          </Link>
        </div>
        
        <SidebarNav menuItems={menuItems} location={location} type={type} />

        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@ikon.com</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive text-xs sm:text-sm" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile + Tablet Header */}
        <header className="lg:hidden h-16 border-b bg-white/80 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <Link href="/">
            <div className="flex items-center gap-2 h-10 w-24">
              <Logo showSubtext={false} className="w-full h-full" />
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b flex justify-center">
                  <div className="h-12 w-32">
                    <Logo className="w-full h-full" />
                  </div>
                </div>
                <SidebarNav menuItems={menuItems} location={location} type={type} />
                <div className="p-4 border-t mt-auto">
                  <Button variant="ghost" className="w-full justify-start text-destructive" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 border-b bg-white/80 backdrop-blur-sm px-6 sm:px-8 items-center justify-end sticky top-0 z-20">
          <Button variant="outline" size="sm">Help & Support</Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function MobileLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-8 border-gray-900 relative max-h-[90vh] flex-1">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-5 sm:h-6 bg-gray-900 rounded-b-xl z-50"></div>
        
        {/* Status Bar Mockup */}
        <div className="h-10 sm:h-12 bg-white flex items-center justify-between px-4 sm:px-6 pt-2 text-[10px] sm:text-xs font-medium text-gray-900">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          {children}
        </main>

        <nav className="h-16 sm:h-20 bg-white border-t flex items-center justify-around px-4 sm:px-6 pb-2 shrink-0">
          <Link href="/tenant">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-primary">
              <Home className="w-5 sm:w-6 h-5 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium">Home</span>
            </div>
          </Link>
          <Link href="/tenant/pay">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-primary transition-colors">
              <div className="w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center font-bold">$</div>
              <span className="text-[10px] sm:text-xs font-medium">Pay</span>
            </div>
          </Link>
          <Link href="/tenant/maintenance">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-primary transition-colors">
              <Settings className="w-5 sm:w-6 h-5 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium">Fix</span>
            </div>
          </Link>
          <Link href="/tenant/profile">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-primary transition-colors">
              <Users className="w-5 sm:w-6 h-5 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium">Me</span>
            </div>
          </Link>
        </nav>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}

// Icon import that was missing
import { FileText } from "lucide-react";

function TenantNavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/tenant"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">My Home</span></Link>
      <Link href="/tenant/pay"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Payments</span></Link>
      <Link href="/tenant/maintenance"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Maintenance</span></Link>
      <Link href="/tenant/documents"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Documents</span></Link>
    </nav>
  );
}

export function TenantLayout({ children }: LayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/tenant">
            <div className="flex items-center gap-2 cursor-pointer h-12 w-32">
              <Logo showSubtext={false} className="w-full h-full" />
            </div>
          </Link>
          <TenantNavLinks />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Bell className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{user?.username?.slice(0, 2)?.toUpperCase() || "ME"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">{user?.username || "Profile"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tenant/profile"><span>My Profile</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tenant"><span>Settings</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b flex justify-center">
                  <div className="h-12 w-32">
                    <Logo className="w-full h-full" />
                  </div>
                </div>
                <div className="flex-1 py-6 px-4 space-y-2">
                  <Link href="/tenant"><div className="px-3 py-2 rounded-md hover:bg-accent cursor-pointer">My Home</div></Link>
                  <Link href="/tenant/pay"><div className="px-3 py-2 rounded-md hover:bg-accent cursor-pointer">Payments</div></Link>
                  <Link href="/tenant/maintenance"><div className="px-3 py-2 rounded-md hover:bg-accent cursor-pointer">Maintenance</div></Link>
                  <Link href="/tenant/documents"><div className="px-3 py-2 rounded-md hover:bg-accent cursor-pointer">Documents</div></Link>
                </div>
                <div className="p-4 border-t mt-auto">
                  <Button variant="ghost" className="w-full justify-start text-destructive" size="sm" onClick={() => logoutMutation.mutate()}>Sign Out</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

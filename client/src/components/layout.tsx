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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="border-b sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-heading">
                IK
              </div>
              <span className="hidden sm:inline font-heading font-bold text-lg sm:text-xl tracking-tight text-primary">IKON</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/landlord"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">For Landlords</span></Link>
            <Link href="/tenant"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">For Tenants</span></Link>
            <Link href="/admin"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Enterprise</span></Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" className="hidden sm:flex text-xs sm:text-sm">Log in</Button>
            <Button className="text-xs sm:text-sm px-3 sm:px-4 py-2 h-9 sm:h-10">Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-8 sm:py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <div className="font-heading font-bold text-lg mb-4">IKON</div>
              <p className="text-xs sm:text-sm text-gray-400">Next-generation property management.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Platform</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>Landlords</li>
                <li>Tenants</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div className="hidden lg:block">
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/10 text-center text-xs sm:text-sm text-gray-500">
            © 2025 IKON Property Group. All rights reserved.
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
        <div className="p-4 sm:p-6 border-b border-sidebar-border shrink-0">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-heading text-sm">
                {type === "admin" ? "IA" : "IK"}
              </div>
              <span className="font-heading font-bold text-lg text-sidebar-foreground">
                {type === "admin" ? "IKON" : "IKON"}
              </span>
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-heading text-sm">
                {type === "admin" ? "IA" : "IK"}
              </div>
              <span className="hidden sm:inline font-heading font-bold text-lg text-primary">IKON</span>
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
                <div className="p-6 border-b">
                  <span className="font-heading font-bold text-xl">IKON</span>
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
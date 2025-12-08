import React from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Home,
  ShieldCheck,
  Smartphone
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
              <span className="font-heading font-bold text-xl tracking-tight text-primary">IKON</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/landlord"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">For Landlords</span></Link>
            <Link href="/tenant"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">For Tenants</span></Link>
            <Link href="/admin"><span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Enterprise</span></Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex">Log in</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-heading font-bold text-xl mb-4">IKON</div>
              <p className="text-sm text-gray-400">Next-generation property management platform.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Landlords</li>
                <li>Tenants</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            © 2025 IKON Property Group. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export function DashboardLayout({ children, type = "landlord" }: LayoutProps & { type?: "landlord" | "admin" }) {
  const [location] = useLocation();
  const isMobile = false; // Mock for now

  const menuItems = type === "landlord" ? [
    { icon: LayoutDashboard, label: "Dashboard", href: "/landlord" },
    { icon: Building2, label: "Properties", href: "/landlord/properties" },
    { icon: Users, label: "Tenants", href: "/landlord/tenants" },
    { icon: Settings, label: "Settings", href: "/landlord/settings" },
  ] : [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: ShieldCheck, label: "Compliance", href: "/admin/compliance" },
    { icon: Settings, label: "System Config", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed h-full z-30">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-heading">
                {type === "admin" ? "IA" : "IK"}
              </div>
              <span className="font-heading font-bold text-xl text-sidebar-foreground">
                {type === "admin" ? "IKON Admin" : "IKON Portal"}
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer group
                ${location === item.href 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
              `}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border mb-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@ikon.com</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                {/* Mobile sidebar content */}
                <div className="p-6 border-b">
                  <span className="font-heading font-bold text-xl">IKON</span>
                </div>
                <div className="py-6 px-4 space-y-1">
                  {menuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent cursor-pointer">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            <Button variant="outline" size="sm">Help & Support</Button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}

export function MobileLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white h-[800px] max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-8 border-gray-900 relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-50"></div>
        
        {/* Status Bar Mockup */}
        <div className="h-12 bg-white flex items-center justify-between px-6 pt-2 text-xs font-medium text-gray-900">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>Signal</span>
            <span>WiFi</span>
            <span>Bat</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          {children}
        </main>

        <nav className="h-20 bg-white border-t flex items-center justify-around px-6 pb-2">
          <Link href="/tenant">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-primary">
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </div>
          </Link>
          <Link href="/tenant/pay">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-primary transition-colors">
              <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">$</div>
              <span className="text-[10px] font-medium">Pay</span>
            </div>
          </Link>
          <Link href="/tenant/maintenance">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-primary transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-[10px] font-medium">Fix</span>
            </div>
          </Link>
          <Link href="/tenant/profile">
            <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-primary transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-medium">Me</span>
            </div>
          </Link>
        </nav>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
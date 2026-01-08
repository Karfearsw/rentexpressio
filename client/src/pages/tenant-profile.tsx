import React from "react";
import { TenantLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, User, MapPin, Calendar, Mail, Phone, Shield, Bell, Key, LogOut, Camera, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Lease } from "@shared/schema";

export default function TenantProfile() {
  const { user, logoutMutation } = useAuth();
  const { data: leases } = useQuery<Lease[]>({ queryKey: ["/api/leases"] });
  const currentLease = leases?.[0];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">My Profile</h1>
          <Button variant="destructive" size="sm" onClick={() => logoutMutation.mutate()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Identity & Lease Context */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-24 bg-primary/10 w-full relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-background">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-6 w-6 rounded-full shadow-md">
                      <Camera className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="pt-12 pb-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{user?.username}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Tenant</span>
                    <span className="text-border">|</span>
                    <span>ID: #{user?.id}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active Lease
                  </Badge>
                  <Badge variant="outline">Good Standing</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Residence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-md shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sunset Boulevard Apts</div>
                    <div className="text-xs text-muted-foreground">Unit 4B</div>
                    <div className="text-xs text-muted-foreground">123 Sunset Blvd, Los Angeles, CA</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-md shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Lease Term</div>
                    <div className="text-xs text-muted-foreground">
                      {currentLease ? `${formatDate(currentLease.startDate)} - ${formatDate(currentLease.endDate)}` : "No active lease"}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full text-xs h-8" asChild>
                  <a href="/tenant/documents">
                    <FileText className="w-3 h-3 mr-2" />
                    View Lease Agreement
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle/Right Column: Settings & Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your contact details and personal info.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.username} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="user@example.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="(555) 123-4567" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Full Name</Label>
                    <div className="font-medium flex items-center gap-2">
                      {user?.username}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email Address</Label>
                    <div className="font-medium flex items-center gap-2">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      user@example.com
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Phone Number</Label>
                    <div className="font-medium flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      (555) 123-4567
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Emergency Contact</Label>
                    <div className="font-medium text-muted-foreground italic">
                      Not set
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal text-xs text-muted-foreground">Receive updates via email</span>
                    </Label>
                    <Switch id="email-notifs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="sms-notifs" className="flex flex-col space-y-1">
                      <span>SMS Notifications</span>
                      <span className="font-normal text-xs text-muted-foreground">Receive updates via text</span>
                    </Label>
                    <Switch id="sms-notifs" />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketing" className="flex flex-col space-y-1">
                      <span>Community News</span>
                      <span className="font-normal text-xs text-muted-foreground">Newsletters and events</span>
                    </Label>
                    <Switch id="marketing" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Password</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">••••••••••••</span>
                      <Button variant="ghost" size="sm" className="h-8">Change</Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label className="text-sm">2-Factor Auth</Label>
                      <div className="text-xs text-muted-foreground">Secure your account</div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

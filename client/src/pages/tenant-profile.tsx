import React, { useState } from "react";
import { MobileLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Phone, Mail, MapPin, Calendar } from "lucide-react";

export default function TenantProfile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <MobileLayout>
      <div className="space-y-6 p-6">
        {/* Profile Header */}
        <div className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-heading font-bold">Alex Davis</h1>
          <p className="text-sm text-muted-foreground">Verified Tenant</p>
          <Badge className="mt-2 bg-green-500">Good Standing</Badge>
        </div>

        {isEditing ? (
          <Card data-testid="form-edit-profile">
            <CardHeader>
              <CardTitle className="text-lg">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Alex Davis" data-testid="input-full-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex@example.com" data-testid="input-email-profile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="(555) 123-4567" data-testid="input-phone-profile" />
              </div>
              <Button className="w-full" data-testid="button-save-profile">Save Changes</Button>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">Cancel</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Contact Information */}
            <Card data-testid="card-contact-info">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Contact Information
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
                    <Settings className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium" data-testid="text-email">alex@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium" data-testid="text-phone">(555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card data-testid="card-property-info">
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Property</p>
                    <p className="font-medium" data-testid="text-property">Sunset Boulevard Apts</p>
                    <p className="text-sm text-muted-foreground">Unit 4B</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lease Period</p>
                    <p className="font-medium" data-testid="text-lease-period">Jan 15, 2024 - Jan 14, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card data-testid="card-account-settings">
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" data-testid="button-change-password">
                  <Settings className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-notification-settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Button variant="destructive" className="w-full" data-testid="button-sign-out-tenant">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
        )}
      </div>
    </MobileLayout>
  );
}

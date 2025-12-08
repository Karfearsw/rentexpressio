import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, CreditCard, Building, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LandlordSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoPayouts, setAutoPayouts] = useState(true);

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-4 h-auto gap-2 sm:gap-0">
            <TabsTrigger value="profile" className="text-xs sm:text-sm" data-testid="tab-profile-settings">Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm" data-testid="tab-notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm" data-testid="tab-payments">Payments</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm" data-testid="tab-security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name</Label>
                    <Input id="firstName" placeholder="John" data-testid="input-first-name" defaultValue="John" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" data-testid="input-last-name" defaultValue="Doe" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" data-testid="input-email-settings" defaultValue="john@example.com" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" data-testid="input-phone-settings" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <Button className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-save-profile">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-xs sm:text-sm">Company Name</Label>
                  <Input id="company" placeholder="Your Property Company" data-testid="input-company-name" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs sm:text-sm">Business Address</Label>
                  <Input id="address" placeholder="123 Main St, City, State" data-testid="input-business-address" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs sm:text-sm">City</Label>
                    <Input id="city" placeholder="City" data-testid="input-city" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-xs sm:text-sm">State</Label>
                    <Input id="state" placeholder="State" data-testid="input-state" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                </div>
                <Button className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-save-company">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Bell className="w-4 sm:w-5 h-4 sm:h-5" /> Notification Preferences</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="toggle-email-notifications">
                    <div>
                      <p className="font-medium text-xs sm:text-sm">Email Notifications</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between" data-testid="toggle-sms-notifications">
                    <div>
                      <p className="font-medium text-xs sm:text-sm">SMS Notifications</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Receive urgent alerts via text</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-medium text-xs sm:text-sm">Notification Types</p>
                  <label className="flex items-center gap-3" data-testid="checkbox-app-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs sm:text-sm">New tenant applications</span>
                  </label>
                  <label className="flex items-center gap-3" data-testid="checkbox-payment-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs sm:text-sm">Rent payment confirmations</span>
                  </label>
                  <label className="flex items-center gap-3" data-testid="checkbox-maintenance-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs sm:text-sm">Maintenance requests</span>
                  </label>
                  <label className="flex items-center gap-3" data-testid="checkbox-lease-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs sm:text-sm">Lease reminders</span>
                  </label>
                </div>

                <Button className="w-full text-xs sm:text-sm" data-testid="button-save-notifications">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><CreditCard className="w-4 sm:w-5 h-4 sm:h-5" /> Payment Methods</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage how you receive payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200" data-testid="card-payment-method">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-xs sm:text-sm">Primary Bank Account</p>
                    <Badge className="text-[10px] sm:text-xs">Primary</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Checking account ending in 4829</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">JPMorgan Chase</p>
                  <Button variant="outline" size="sm" className="mt-3 h-8 text-xs" data-testid="button-remove-bank">Remove</Button>
                </div>

                <Button variant="outline" className="w-full text-xs sm:text-sm" data-testid="button-add-payment-method">Add Payment Method</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payoutFrequency" className="text-xs sm:text-sm">Payout Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger data-testid="select-payout-frequency" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between" data-testid="toggle-auto-payouts">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Automatic Payouts</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Automatically transfer collected rent</p>
                  </div>
                  <Switch checked={autoPayouts} onCheckedChange={setAutoPayouts} />
                </div>

                <Button className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-save-payouts">Save Payout Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Lock className="w-4 sm:w-5 h-4 sm:h-5" /> Password & Security</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs sm:text-sm">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" data-testid="input-current-password" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs sm:text-sm">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" data-testid="input-new-password" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" data-testid="input-confirm-password" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <Button className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-change-password">Change Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">2FA is not enabled</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Enable 2FA to secure your account</p>
                  </div>
                  <Button size="sm" className="h-8 text-xs" data-testid="button-enable-2fa">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="text-xs sm:text-sm font-medium">Chrome on macOS</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Current session • Last active: 2 mins ago</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="text-xs sm:text-sm font-medium">Safari on iPhone</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Last active: 1 hour ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-logout-session">Logout</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 text-base sm:text-lg">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-xs sm:text-sm">Sign Out</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Sign out from your account</p>
              </div>
              <Button variant="outline" className="text-xs sm:text-sm" data-testid="button-sign-out"><LogOut className="w-3 sm:w-4 h-3 sm:h-4 mr-2" /> Sign Out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
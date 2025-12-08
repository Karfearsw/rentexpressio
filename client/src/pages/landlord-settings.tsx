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
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="profile" data-testid="tab-profile-settings">Profile</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" data-testid="input-first-name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" data-testid="input-last-name" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" data-testid="input-email-settings" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" data-testid="input-phone-settings" />
                </div>
                <Button data-testid="button-save-profile">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your Property Company" data-testid="input-company-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input id="address" placeholder="123 Main St, City, State" data-testid="input-business-address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" data-testid="input-city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" data-testid="input-state" />
                  </div>
                </div>
                <Button data-testid="button-save-company">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="toggle-email-notifications">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between" data-testid="toggle-sms-notifications">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive urgent alerts via text</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-medium">Notification Types</p>
                  <label className="flex items-center gap-3" data-testid="checkbox-app-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">New tenant applications</span>
                  </label>
                  <label className="flex items-center gap-3" data-testid="checkbox-payment-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Rent payment confirmations</span>
                  </label>
                  <label className="flex items-center gap-3" data-testid="checkbox-maintenance-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Maintenance requests</span>
                  </label>
                  <label className="flex items-center gap-3" data-testid="checkbox-lease-notifications">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Lease reminders</span>
                  </label>
                </div>

                <Button className="w-full" data-testid="button-save-notifications">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Methods</CardTitle>
                <CardDescription>Manage how you receive payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200" data-testid="card-payment-method">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Primary Bank Account</p>
                    <Badge>Primary</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Checking account ending in 4829</p>
                  <p className="text-xs text-muted-foreground mt-1">JPMorgan Chase</p>
                  <Button variant="outline" size="sm" className="mt-3" data-testid="button-remove-bank">Remove</Button>
                </div>

                <Button variant="outline" className="w-full" data-testid="button-add-payment-method">Add Payment Method</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payoutFrequency">Payout Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger data-testid="select-payout-frequency">
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
                    <p className="font-medium">Automatic Payouts</p>
                    <p className="text-sm text-muted-foreground">Automatically transfer collected rent</p>
                  </div>
                  <Switch checked={autoPayouts} onCheckedChange={setAutoPayouts} />
                </div>

                <Button data-testid="button-save-payouts">Save Payout Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Password & Security</CardTitle>
                <CardDescription>Keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" data-testid="input-current-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" data-testid="input-new-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" data-testid="input-confirm-password" />
                </div>
                <Button data-testid="button-change-password">Change Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-sm">2FA is not enabled</p>
                    <p className="text-xs text-muted-foreground">Enable 2FA to secure your account</p>
                  </div>
                  <Button size="sm" data-testid="button-enable-2fa">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">Chrome on macOS</p>
                      <p className="text-xs text-muted-foreground">Current session • Last active: 2 mins ago</p>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">Safari on iPhone</p>
                      <p className="text-xs text-muted-foreground">Last active: 1 hour ago</p>
                    </div>
                    <Button variant="ghost" size="sm" data-testid="button-logout-session">Logout</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out from your account</p>
              </div>
              <Button variant="outline" data-testid="button-sign-out"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
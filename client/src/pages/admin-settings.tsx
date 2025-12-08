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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Database, Globe, Key, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [apiLogging, setApiLogging] = useState(true);

  return (
    <DashboardLayout type="admin">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">System Configuration</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage platform settings and integrations</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 sm:grid-cols-5 h-auto gap-1 sm:gap-0">
            <TabsTrigger value="general" className="text-xs sm:text-sm" data-testid="tab-general-settings">General</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs sm:text-sm" data-testid="tab-integrations">Integrations</TabsTrigger>
            <TabsTrigger value="email" className="text-xs sm:text-sm" data-testid="tab-email-settings">Email</TabsTrigger>
            <TabsTrigger value="api" className="text-xs sm:text-sm" data-testid="tab-api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs sm:text-sm" data-testid="tab-advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName" className="text-xs sm:text-sm">Platform Name</Label>
                  <Input id="platformName" placeholder="IKON Property Management" data-testid="input-platform-name" defaultValue="IKON" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail" className="text-xs sm:text-sm">Support Email</Label>
                  <Input id="supportEmail" type="email" placeholder="support@ikon.com" data-testid="input-support-email" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-xs sm:text-sm">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger data-testid="select-timezone" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-save-general">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                    <span className="font-medium text-xs sm:text-sm">Platform Status</span>
                  </div>
                  <Badge className="bg-green-500 text-[10px] sm:text-xs">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                    <span className="font-medium text-xs sm:text-sm">Uptime</span>
                  </div>
                  <span className="font-bold text-xs sm:text-sm">99.98%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Maintenance Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Enable Maintenance Mode</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Temporarily disable the platform for updates</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} data-testid="toggle-maintenance-mode" />
                </div>
                {maintenanceMode && (
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceMessage" className="text-xs sm:text-sm">Maintenance Message</Label>
                    <Textarea id="maintenanceMessage" placeholder="We're performing scheduled maintenance..." data-testid="textarea-maintenance-message" />
                    <Button variant="outline" className="text-xs sm:text-sm" data-testid="button-schedule-maintenance">Schedule</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Third-Party Integrations</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage connected services and APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Stripe", status: "connected", icon: "💳" },
                  { name: "SendGrid", status: "connected", icon: "📧" },
                  { name: "Twilio", status: "disconnected", icon: "📱" },
                  { name: "DocuSign", status: "connected", icon: "✍️" },
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg" data-testid={`card-integration-${idx}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{integration.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Status: {integration.status === "connected" ? "Connected" : "Disconnected"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={integration.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className="h-8 text-xs"
                      data-testid={`button-manage-${integration.name.toLowerCase()}`}
                    >
                      {integration.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer" className="text-xs sm:text-sm">SMTP Server</Label>
                  <Input id="smtpServer" placeholder="smtp.sendgrid.com" data-testid="input-smtp-server" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-xs sm:text-sm">Port</Label>
                    <Input id="smtpPort" placeholder="587" data-testid="input-smtp-port" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername" className="text-xs sm:text-sm">Username</Label>
                    <Input id="smtpUsername" placeholder="apikey" data-testid="input-smtp-username" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail" className="text-xs sm:text-sm">From Email Address</Label>
                  <Input id="fromEmail" type="email" placeholder="noreply@ikon.com" data-testid="input-from-email" className="h-9 sm:h-10 text-xs sm:text-sm" />
                </div>
                <Button className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-test-email">Send Test Email</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api" className="space-y-4 mt-4 sm:mt-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Key className="w-4 sm:w-5 h-4 sm:h-5" /> API Keys</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage API credentials for integrations</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Service</TableHead>
                        <TableHead className="text-xs">API Key</TableHead>
                        <TableHead className="text-xs">Created</TableHead>
                        <TableHead className="text-right text-xs">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow data-testid="row-stripe-key">
                        <TableCell className="font-medium text-xs sm:text-sm">Stripe</TableCell>
                        <TableCell className="font-mono text-[10px] sm:text-xs">sk_live_****...3k29</TableCell>
                        <TableCell className="text-xs sm:text-sm">Dec 1, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-rotate-stripe">Rotate</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow data-testid="row-sendgrid-key">
                        <TableCell className="font-medium text-xs sm:text-sm">SendGrid</TableCell>
                        <TableCell className="font-mono text-[10px] sm:text-xs">SG.****...abc123</TableCell>
                        <TableCell className="text-xs sm:text-sm">Nov 15, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-rotate-sendgrid">Rotate</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between" data-testid="toggle-api-logging">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">API Logging</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Log all API requests for debugging</p>
                  </div>
                  <Switch checked={apiLogging} onCheckedChange={setApiLogging} />
                </div>
                <Separator />
                <div className="flex items-center justify-between" data-testid="toggle-debug-mode">
                  <div>
                    <p className="font-medium text-xs sm:text-sm">Debug Mode</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Enable detailed error messages</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-700 text-base sm:text-lg">Database Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-xs sm:text-sm" data-testid="button-backup-database">Backup Database</Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm" data-testid="button-export-data">Export Data</Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm" data-testid="button-clear-cache">Clear Cache</Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2 text-base sm:text-lg"><AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5" /> Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full text-xs sm:text-sm" data-testid="button-reset-platform">Reset Platform</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
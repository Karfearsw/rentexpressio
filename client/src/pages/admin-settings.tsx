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
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">System Configuration</h1>
          <p className="text-muted-foreground">Manage platform settings and integrations</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="general" data-testid="tab-general-settings">General</TabsTrigger>
            <TabsTrigger value="integrations" data-testid="tab-integrations">Integrations</TabsTrigger>
            <TabsTrigger value="email" data-testid="tab-email-settings">Email</TabsTrigger>
            <TabsTrigger value="api" data-testid="tab-api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="advanced" data-testid="tab-advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" placeholder="IKON Property Management" data-testid="input-platform-name" defaultValue="IKON" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" placeholder="support@ikon.com" data-testid="input-support-email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger data-testid="select-timezone">
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
                <Button data-testid="button-save-general">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Platform Status</span>
                  </div>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Uptime</span>
                  </div>
                  <span className="font-bold">99.98%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Temporarily disable the platform for updates</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} data-testid="toggle-maintenance-mode" />
                </div>
                {maintenanceMode && (
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea id="maintenanceMessage" placeholder="We're performing scheduled maintenance..." data-testid="textarea-maintenance-message" />
                    <Button variant="outline" data-testid="button-schedule-maintenance">Schedule</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Manage connected services and APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Stripe", status: "connected", icon: "💳" },
                  { name: "SendGrid", status: "connected", icon: "📧" },
                  { name: "Twilio", status: "disconnected", icon: "📱" },
                  { name: "DocuSign", status: "connected", icon: "✍️" },
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`card-integration-${idx}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {integration.status === "connected" ? "Connected" : "Disconnected"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={integration.status === "connected" ? "outline" : "default"}
                      size="sm"
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
          <TabsContent value="email" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input id="smtpServer" placeholder="smtp.sendgrid.com" data-testid="input-smtp-server" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input id="smtpPort" placeholder="587" data-testid="input-smtp-port" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input id="smtpUsername" placeholder="apikey" data-testid="input-smtp-username" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input id="fromEmail" type="email" placeholder="noreply@ikon.com" data-testid="input-from-email" />
                </div>
                <Button data-testid="button-test-email">Send Test Email</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" /> API Keys</CardTitle>
                <CardDescription>Manage API credentials for integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow data-testid="row-stripe-key">
                      <TableCell className="font-medium">Stripe</TableCell>
                      <TableCell className="font-mono text-xs">sk_live_****...3k29</TableCell>
                      <TableCell>Dec 1, 2025</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" data-testid="button-rotate-stripe">Rotate</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow data-testid="row-sendgrid-key">
                      <TableCell className="font-medium">SendGrid</TableCell>
                      <TableCell className="font-mono text-xs">SG.****...abc123</TableCell>
                      <TableCell>Nov 15, 2025</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" data-testid="button-rotate-sendgrid">Rotate</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between" data-testid="toggle-api-logging">
                  <div>
                    <p className="font-medium">API Logging</p>
                    <p className="text-sm text-muted-foreground">Log all API requests for debugging</p>
                  </div>
                  <Switch checked={apiLogging} onCheckedChange={setApiLogging} />
                </div>
                <Separator />
                <div className="flex items-center justify-between" data-testid="toggle-debug-mode">
                  <div>
                    <p className="font-medium">Debug Mode</p>
                    <p className="text-sm text-muted-foreground">Enable detailed error messages</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-700">Database Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" data-testid="button-backup-database">Backup Database</Button>
                <Button variant="outline" className="w-full" data-testid="button-export-data">Export Data</Button>
                <Button variant="outline" className="w-full" data-testid="button-clear-cache">Clear Cache</Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full" data-testid="button-reset-platform">Reset Platform</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
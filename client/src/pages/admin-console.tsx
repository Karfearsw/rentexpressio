import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Users, 
  CreditCard, 
  Server,
  AlertCircle,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminConsole() {
  return (
    <DashboardLayout type="admin">
       <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">System Overview</h1>
            <p className="text-muted-foreground">Monitor platform health and subscription metrics.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Activity className="w-4 h-4 mr-2" /> Live Logs</Button>
            <Button variant="destructive"><AlertCircle className="w-4 h-4 mr-2" /> System Alert</Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,403</div>
              <p className="text-xs text-gray-500">
                <span className="text-green-500 font-medium">+180</span> this week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">MRR</CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$84,230</div>
              <p className="text-xs text-gray-500">
                <span className="text-green-500 font-medium">+12.5%</span> growth
              </p>
            </CardContent>
          </Card>
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">System Uptime</CardTitle>
              <Server className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.98%</div>
              <p className="text-xs text-gray-500">All systems operational</p>
            </CardContent>
          </Card>
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-gray-500">Landlord verifications</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Tiers */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>Breakdown of landlord subscription tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Enterprise (50+ units)</span>
                    <span className="text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Professional (10-50 units)</span>
                    <span className="text-muted-foreground">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Starter (1-10 units)</span>
                    <span className="text-muted-foreground">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent operational events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Payment Gateway Latency</p>
                    <p className="text-xs text-muted-foreground">10 mins ago • Stripe API</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">High Traffic Volume</p>
                    <p className="text-xs text-muted-foreground">1 hour ago • Load Balancer</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Scheduled Backup Completed</p>
                    <p className="text-xs text-muted-foreground">4 hours ago • Database</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Alice Johnson</TableCell>
                  <TableCell>Landlord</TableCell>
                  <TableCell><Badge className="bg-green-500">Verified</Badge></TableCell>
                  <TableCell>Oct 24, 2025</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bob Smith</TableCell>
                  <TableCell>Tenant</TableCell>
                  <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  <TableCell>Oct 24, 2025</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Charlie Brown</TableCell>
                  <TableCell>Landlord</TableCell>
                  <TableCell><Badge variant="destructive">Suspended</Badge></TableCell>
                  <TableCell>Oct 23, 2025</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
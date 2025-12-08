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
       <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">System Overview</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Monitor platform health and subscription metrics.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm"><Activity className="w-3 sm:w-4 h-3 sm:h-4 mr-2" /> Live Logs</Button>
            <Button variant="destructive" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm"><AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 mr-2" /> System Alert</Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Total Users</CardTitle>
              <Users className="h-3 sm:h-4 w-3 sm:w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">12,403</div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                <span className="text-green-500 font-medium">+180</span> this week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">MRR</CardTitle>
              <CreditCard className="h-3 sm:h-4 w-3 sm:w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">$84,230</div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                <span className="text-green-500 font-medium">+12.5%</span> growth
              </p>
            </CardContent>
          </Card>
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">System Uptime</CardTitle>
              <Server className="h-3 sm:h-4 w-3 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">99.98%</div>
              <p className="text-[10px] sm:text-xs text-gray-500">All systems operational</p>
            </CardContent>
          </Card>
          <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Pending Approvals</CardTitle>
              <AlertCircle className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">24</div>
              <p className="text-[10px] sm:text-xs text-gray-500">Landlord verifications</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Subscription Tiers */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Active Subscriptions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Breakdown of landlord subscription tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium">Enterprise (50+ units)</span>
                    <span className="text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium">Professional (10-50 units)</span>
                    <span className="text-muted-foreground">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
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
              <CardTitle className="text-base sm:text-lg">System Alerts</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Recent operational events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Payment Gateway Latency</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">10 mins ago • Stripe API</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500 shrink-0"></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">High Traffic Volume</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">1 hour ago • Load Balancer</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0"></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Scheduled Backup Completed</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">4 hours ago • Database</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-right text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Alice Johnson</TableCell>
                    <TableCell className="text-xs sm:text-sm">Landlord</TableCell>
                    <TableCell><Badge className="bg-green-500 text-[10px] sm:text-xs">Verified</Badge></TableCell>
                    <TableCell className="text-xs sm:text-sm">Oct 24, 2025</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8 w-8"><MoreHorizontal className="w-3 h-3" /></Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Bob Smith</TableCell>
                    <TableCell className="text-xs sm:text-sm">Tenant</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px] sm:text-xs">Pending</Badge></TableCell>
                    <TableCell className="text-xs sm:text-sm">Oct 24, 2025</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8 w-8"><MoreHorizontal className="w-3 h-3" /></Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Charlie Brown</TableCell>
                    <TableCell className="text-xs sm:text-sm">Landlord</TableCell>
                    <TableCell><Badge variant="destructive" className="text-[10px] sm:text-xs">Suspended</Badge></TableCell>
                    <TableCell className="text-xs sm:text-sm">Oct 23, 2025</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8 w-8"><MoreHorizontal className="w-3 h-3" /></Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
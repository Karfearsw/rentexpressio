import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  Home, 
  MoreHorizontal,
  Plus,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const revenueData = [
  { name: "Jan", total: 12400 },
  { name: "Feb", total: 14200 },
  { name: "Mar", total: 13800 },
  { name: "Apr", total: 16500 },
  { name: "May", total: 15900 },
  { name: "Jun", total: 18200 },
];

const applications = [
  { id: 1, name: "Sarah Connor", property: "Sunset Blvd Apt 4B", status: "Pending", date: "2 mins ago", score: 720 },
  { id: 2, name: "James Cameron", property: "Ocean View #12", status: "Approved", date: "4 hours ago", score: 785 },
  { id: 3, name: "Ellen Ripley", property: "Nostromo Penthouse", status: "Reviewing", date: "1 day ago", score: 650 },
  { id: 4, name: "Marty McFly", property: "Hill Valley House", status: "Rejected", date: "2 days ago", score: 580 },
];

export default function LandlordDashboard() {
  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Overview of your portfolio performance.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input placeholder="Search..." className="h-9 sm:h-10 text-xs sm:text-sm" data-testid="input-search-dashboard" />
            <Button size="sm" className="text-xs sm:text-sm"><Plus className="w-3 sm:w-4 h-3 sm:h-4 mr-1" /> Add</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">$45,231.89</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                <span className="text-green-500 font-medium inline-flex items-center">
                  +20.1% <ArrowUpRight className="w-2 sm:w-3 h-2 sm:h-3 ml-1" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Occupancy Rate</CardTitle>
              <Users className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">94%</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                <span className="text-green-500 font-medium inline-flex items-center">
                  +2% <ArrowUpRight className="w-2 sm:w-3 h-2 sm:h-3 ml-1" />
                </span>{" "}
                vs industry avg
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">12</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                <span className="text-muted-foreground">4 vacant units</span>
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Applications</CardTitle>
              <Users className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">8</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                <span className="text-blue-500 font-medium">3 requiring review</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Applications */}
        <div className="grid lg:grid-cols-7 gap-4 sm:gap-6">
          {/* Main Chart */}
          <Card className="col-span-1 lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Revenue Overview</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Monthly revenue breakdown for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pl-0 pr-2 sm:pr-4">
              <div className="w-full h-[250px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <Tooltip 
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="col-span-1 lg:col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Recent Applications</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Latest tenant applications needing review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-6">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between group gap-2">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium leading-none group-hover:text-primary transition-colors">{app.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{app.property}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="text-right hidden sm:block">
                        <p className={`text-[10px] sm:text-xs font-medium ${app.score >= 700 ? 'text-green-600' : app.score >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>
                          Credit: {app.score}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs" size="sm">View all applications</Button>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table - Hidden on mobile, shown on tablet+ */}
        <Card className="shadow-sm hidden sm:block">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Properties</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your listed properties and units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Property</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-right text-xs">Rent</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                          <Home className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="hidden sm:block">
                          <div>Sunset Boulevard Apts</div>
                          <div className="text-[10px] text-muted-foreground">12 Units • Los Angeles, CA</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge className="bg-green-500 text-xs">Active</Badge></TableCell>
                    <TableCell className="text-xs">Multi-Family</TableCell>
                    <TableCell className="text-right font-bold text-xs">$24,500/mo</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-3 h-3" /></Button>
                    </TableCell>
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
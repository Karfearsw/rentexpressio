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
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your portfolio performance.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Search className="w-4 h-4 mr-2" /> Search</Button>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Listing</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium inline-flex items-center">
                  +20.1% <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium inline-flex items-center">
                  +2% <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>{" "}
                vs industry avg
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-muted-foreground">4 vacant units</span>
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-500 font-medium">3 requiring review</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-7 gap-6">
          {/* Main Chart */}
          <Card className="col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
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
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest tenant applications needing review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.property}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className={`text-xs font-medium ${app.score >= 700 ? 'text-green-600' : app.score >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>
                          Credit: {app.score}
                        </p>
                        <p className="text-xs text-muted-foreground">{app.date}</p>
                      </div>
                      <Badge variant={app.status === "Approved" ? "default" : app.status === "Rejected" ? "destructive" : "secondary"}>
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs" size="sm">View all applications</Button>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Manage your listed properties and units</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Rent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div>Sunset Boulevard Apts</div>
                        <div className="text-xs text-muted-foreground">12 Units • Los Angeles, CA</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-green-500 hover:bg-green-600">Active</Badge></TableCell>
                  <TableCell>Multi-Family</TableCell>
                  <TableCell className="text-right">$24,500/mo</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div>Highland Park House</div>
                        <div className="text-xs text-muted-foreground">Single Family • Austin, TX</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">Maintenance</Badge></TableCell>
                  <TableCell>Single Family</TableCell>
                  <TableCell className="text-right">$3,200/mo</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
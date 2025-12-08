import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock, User, Mail, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Landlord", status: "verified", joined: "Oct 20, 2025" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Tenant", status: "pending", joined: "Oct 21, 2025" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Landlord", status: "suspended", joined: "Oct 22, 2025" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Tenant", status: "verified", joined: "Oct 23, 2025" },
];

export default function AdminUsers() {
  return (
    <DashboardLayout type="admin">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">User Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Monitor and manage all platform users</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10 text-xs sm:text-sm" data-testid="select-role-filter">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="landlord">Landlords</SelectItem>
                <SelectItem value="tenant">Tenants</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search users..." data-testid="input-search-users" className="w-full sm:max-w-xs h-9 sm:h-10 text-xs sm:text-sm" />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-4 h-auto gap-2 sm:gap-0">
            <TabsTrigger value="all" className="text-xs sm:text-sm" data-testid="tab-all-users">All</TabsTrigger>
            <TabsTrigger value="verified" className="text-xs sm:text-sm" data-testid="tab-verified-users">Verified</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm" data-testid="tab-pending-users">Pending</TabsTrigger>
            <TabsTrigger value="suspended" className="text-xs sm:text-sm" data-testid="tab-suspended-users">Suspended</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow" data-testid={`card-user-${user.id}`}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg shrink-0">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm sm:text-lg" data-testid={`text-user-name-${user.id}`}>{user.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span data-testid={`text-user-email-${user.id}`}>{user.email}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] sm:text-xs" data-testid={`text-user-role-${user.id}`}>{user.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:text-right gap-2">
                      <div>
                        <Badge 
                          variant={
                            user.status === "verified" ? "default" :
                            user.status === "pending" ? "secondary" :
                            "destructive"
                          }
                          className="text-[10px] sm:text-xs"
                          data-testid={`status-user-${user.id}`}
                        >
                          {user.status === "verified" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {user.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {user.status === "suspended" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">Joined {user.joined}</p>
                      </div>
                      <div className="flex gap-2 sm:mt-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs" data-testid={`button-review-user-${user.id}`}>Review</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid={`button-actions-user-${user.id}`}>Actions</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="verified" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {users.filter(u => u.status === "verified").map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="font-bold text-sm sm:text-base">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {users.filter(u => u.status === "pending").map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="font-bold text-sm sm:text-base">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                  <Button size="sm" className="mt-3 sm:mt-4 text-xs sm:text-sm" data-testid={`button-approve-user-${user.id}`}>Approve</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="suspended" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {users.filter(u => u.status === "suspended").map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-4 sm:pt-6">
                  <h3 className="font-bold text-sm sm:text-base">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                  <Button variant="outline" size="sm" className="mt-3 sm:mt-4 text-xs sm:text-sm" data-testid={`button-reinstate-user-${user.id}`}>Reinstate</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
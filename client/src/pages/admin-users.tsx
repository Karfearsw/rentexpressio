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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">User Management</h1>
            <p className="text-muted-foreground">Monitor and manage all platform users</p>
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-40" data-testid="select-role-filter">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="landlord">Landlords</SelectItem>
                <SelectItem value="tenant">Tenants</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search users..." data-testid="input-search-users" className="max-w-xs" />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" data-testid="tab-all-users">All</TabsTrigger>
            <TabsTrigger value="verified" data-testid="tab-verified-users">Verified</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending-users">Pending</TabsTrigger>
            <TabsTrigger value="suspended" data-testid="tab-suspended-users">Suspended</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow" data-testid={`card-user-${user.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg" data-testid={`text-user-name-${user.id}`}>{user.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span data-testid={`text-user-email-${user.id}`}>{user.email}</span>
                          <span>•</span>
                          <span data-testid={`text-user-role-${user.id}`}>{user.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          user.status === "verified" ? "default" :
                          user.status === "pending" ? "secondary" :
                          "destructive"
                        }
                        data-testid={`status-user-${user.id}`}
                      >
                        {user.status === "verified" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {user.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {user.status === "suspended" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">Joined {user.joined}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" data-testid={`button-review-user-${user.id}`}>Review</Button>
                        <Button variant="ghost" size="sm" data-testid={`button-actions-user-${user.id}`}>Actions</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="verified" className="space-y-4 mt-6">
            {users.filter(u => u.status === "verified").map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {users.filter(u => u.status === "pending").map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button size="sm" className="mt-4" data-testid={`button-approve-user-${user.id}`}>Approve</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="suspended" className="space-y-4 mt-6">
            {users.filter(u => u.status === "suspended").map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button variant="outline" size="sm" className="mt-4" data-testid={`button-reinstate-user-${user.id}`}>Reinstate</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

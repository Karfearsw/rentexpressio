import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, Eye, Download } from "lucide-react";

const applications = [
  { id: 1, name: "Sarah Connor", property: "Sunset Blvd Apt 4B", status: "pending", date: "2 mins ago", credit: 720, employment: "Verified", eviction: "Clear" },
  { id: 2, name: "James Cameron", property: "Ocean View #12", status: "approved", date: "4 hours ago", credit: 785, employment: "Verified", eviction: "Clear" },
  { id: 3, name: "Ellen Ripley", property: "Nostromo Penthouse", status: "reviewing", date: "1 day ago", credit: 650, employment: "Pending", eviction: "Clear" },
  { id: 4, name: "Marty McFly", property: "Hill Valley House", status: "rejected", date: "2 days ago", credit: 580, employment: "Failed", eviction: "Red Flag" },
];

export default function LandlordApplications() {
  const [selectedApp, setSelectedApp] = useState<typeof applications[0] | null>(null);

  const statusConfig = {
    pending: { label: "Pending Review", color: "bg-yellow-500" },
    approved: { label: "Approved", color: "bg-green-500" },
    reviewing: { label: "Reviewing", color: "bg-blue-500" },
    rejected: { label: "Rejected", color: "bg-red-500" },
  };

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Applications</h1>
          <p className="text-muted-foreground">Review and manage tenant applications with screening results</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" data-testid="tab-all-applications">All</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending-applications">Pending</TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved-applications">Approved</TabsTrigger>
            <TabsTrigger value="rejected" data-testid="tab-rejected-applications">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedApp(app)}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg" data-testid={`text-applicant-${app.id}`}>{app.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{app.property}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" data-testid={`badge-credit-${app.id}`}>Credit: {app.credit}</Badge>
                        <Badge variant="outline" data-testid={`badge-employment-${app.id}`}>Employment: {app.employment}</Badge>
                        <Badge variant="outline" data-testid={`badge-eviction-${app.id}`}>Eviction: {app.eviction}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusConfig[app.status as keyof typeof statusConfig].color} data-testid={`status-${app.id}`}>
                        {statusConfig[app.status as keyof typeof statusConfig].label}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">{app.date}</p>
                      <Button variant="ghost" size="sm" className="mt-3" data-testid={`button-view-app-${app.id}`}><Eye className="w-4 h-4 mr-1" /> Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {applications.filter(a => a.status === "pending").map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.property}</p>
                    </div>
                    <Button size="sm" data-testid={`button-approve-${app.id}`}><CheckCircle2 className="w-4 h-4 mr-1" /> Approve</Button>
                    <Button variant="destructive" size="sm" data-testid={`button-reject-${app.id}`}><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {applications.filter(a => a.status === "approved").map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.property}</p>
                    </div>
                    <Badge className="bg-green-500">Approved</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {applications.filter(a => a.status === "rejected").map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.property}</p>
                    </div>
                    <Badge className="bg-red-500">Rejected</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
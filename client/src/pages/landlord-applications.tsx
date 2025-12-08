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
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">Applications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Review and manage tenant applications with screening results</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-4 h-auto sm:h-10 gap-2 sm:gap-0">
            <TabsTrigger value="all" className="text-xs sm:text-sm" data-testid="tab-all-applications">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm" data-testid="tab-pending-applications">Pending</TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm" data-testid="tab-approved-applications">Approved</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs sm:text-sm" data-testid="tab-rejected-applications">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 sm:space-y-4 mt-4">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedApp(app)}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg" data-testid={`text-applicant-${app.id}`}>{app.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{app.property}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px] sm:text-xs" data-testid={`badge-credit-${app.id}`}>Credit: {app.credit}</Badge>
                        <Badge variant="outline" className="text-[10px] sm:text-xs" data-testid={`badge-employment-${app.id}`}>Employment: {app.employment}</Badge>
                        <Badge variant="outline" className="text-[10px] sm:text-xs" data-testid={`badge-eviction-${app.id}`}>Eviction: {app.eviction}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:block sm:text-right">
                      <div className="sm:mb-2">
                        <Badge className={`${statusConfig[app.status as keyof typeof statusConfig].color} text-[10px] sm:text-xs`} data-testid={`status-${app.id}`}>
                          {statusConfig[app.status as keyof typeof statusConfig].label}
                        </Badge>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 hidden sm:block">{app.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid={`button-view-app-${app.id}`}><Eye className="w-3 h-3 mr-1" /> Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 sm:space-y-4 mt-4">
            {applications.filter(a => a.status === "pending").map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg">{app.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{app.property}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 sm:flex-none text-xs" data-testid={`button-approve-${app.id}`}><CheckCircle2 className="w-3 h-3 mr-1" /> Approve</Button>
                      <Button variant="destructive" size="sm" className="flex-1 sm:flex-none text-xs" data-testid={`button-reject-${app.id}`}><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3 sm:space-y-4 mt-4">
            {applications.filter(a => a.status === "approved").map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{app.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{app.property}</p>
                    </div>
                    <Badge className="bg-green-500 text-xs">Approved</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3 sm:space-y-4 mt-4">
            {applications.filter(a => a.status === "rejected").map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{app.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{app.property}</p>
                    </div>
                    <Badge className="bg-red-500 text-xs">Rejected</Badge>
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
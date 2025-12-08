import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Send, Download, Calendar } from "lucide-react";

const leases = [
  { id: 1, tenant: "John Smith", property: "Sunset Blvd 4B", startDate: "2024-01-15", endDate: "2025-01-14", status: "active", signingDate: "2024-01-10" },
  { id: 2, tenant: "Jane Doe", property: "Highland Park", startDate: "2024-06-01", endDate: "2026-05-31", status: "active", signingDate: "2024-05-25" },
  { id: 3, tenant: "Bob Johnson", property: "Downtown Lofts", startDate: "2023-03-01", endDate: "2024-02-28", status: "expired", signingDate: "2023-02-15" },
];

const leaseTemplates = [
  { id: 1, name: "Standard Residential", terms: "12 months" },
  { id: 2, name: "Short Term", terms: "6 months" },
  { id: 3, name: "Month-to-Month", terms: "Flexible" },
];

export default function LandlordLeases() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Leases</h1>
            <p className="text-muted-foreground">Create, manage, and track tenant leases</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg"><Plus className="w-4 h-4 mr-2" /> Create Lease</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Lease</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant">Tenant Name</Label>
                    <Input id="tenant" placeholder="Full name" data-testid="input-lease-tenant" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property">Property</Label>
                    <Select>
                      <SelectTrigger data-testid="select-lease-property">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunset">Sunset Blvd Apts</SelectItem>
                        <SelectItem value="highland">Highland Park House</SelectItem>
                        <SelectItem value="downtown">Downtown Lofts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" data-testid="input-lease-start-date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" data-testid="input-lease-end-date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Lease Template</Label>
                  <Select>
                    <SelectTrigger data-testid="select-lease-template">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaseTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name} ({template.terms})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" data-testid="button-create-lease">Create & Send to Sign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {leases.map((lease) => (
            <Card key={lease.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg" data-testid={`text-lease-tenant-${lease.id}`}>{lease.tenant}</h3>
                      <Badge variant={lease.status === "active" ? "default" : "secondary"} data-testid={`status-lease-${lease.id}`}>
                        {lease.status === "active" ? "Active" : "Expired"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{lease.property}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span data-testid={`text-lease-dates-${lease.id}`}>{lease.startDate} to {lease.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid={`button-download-lease-${lease.id}`}><Download className="w-4 h-4 mr-1" /> Download</Button>
                    {lease.status === "active" && (
                      <Button size="sm" data-testid={`button-send-renewal-${lease.id}`}><Send className="w-4 h-4 mr-1" /> Renew</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
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
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">Leases</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Create, manage, and track tenant leases</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm"><Plus className="w-3 sm:w-4 h-3 sm:h-4 mr-1" /> Create Lease</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full mx-2 sm:mx-0">
              <DialogHeader>
                <DialogTitle>Create New Lease</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant" className="text-xs sm:text-sm">Tenant Name</Label>
                    <Input id="tenant" placeholder="Full name" data-testid="input-lease-tenant" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property" className="text-xs sm:text-sm">Property</Label>
                    <Select>
                      <SelectTrigger data-testid="select-lease-property" className="h-9 sm:h-10 text-xs sm:text-sm">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-xs sm:text-sm">Start Date</Label>
                    <Input id="startDate" type="date" data-testid="input-lease-start-date" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-xs sm:text-sm">End Date</Label>
                    <Input id="endDate" type="date" data-testid="input-lease-end-date" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template" className="text-xs sm:text-sm">Lease Template</Label>
                  <Select>
                    <SelectTrigger data-testid="select-lease-template" className="h-9 sm:h-10 text-xs sm:text-sm">
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
                <Button className="w-full text-xs sm:text-sm" data-testid="button-create-lease">Create & Send to Sign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {leases.map((lease) => (
            <Card key={lease.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                        <h3 className="font-bold text-base sm:text-lg" data-testid={`text-lease-tenant-${lease.id}`}>{lease.tenant}</h3>
                      </div>
                      <Badge variant={lease.status === "active" ? "default" : "secondary"} data-testid={`status-lease-${lease.id}`} className="text-[10px] sm:text-xs">
                        {lease.status === "active" ? "Active" : "Expired"}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">{lease.property}</p>
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span data-testid={`text-lease-dates-${lease.id}`}>{lease.startDate} to {lease.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs" data-testid={`button-download-lease-${lease.id}`}><Download className="w-3 h-3 mr-1" /> Download</Button>
                    {lease.status === "active" && (
                      <Button size="sm" className="flex-1 sm:flex-none text-xs" data-testid={`button-send-renewal-${lease.id}`}><Send className="w-3 h-3 mr-1" /> Renew</Button>
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
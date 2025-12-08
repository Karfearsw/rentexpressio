import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Phone, Mail, Clock, AlertCircle } from "lucide-react";

const tenants = [
  { id: 1, name: "John Smith", property: "Sunset Blvd 4B", phone: "(555) 123-4567", email: "john@example.com", moveIn: "Jan 15, 2024", status: "good", rentPaid: true },
  { id: 2, name: "Jane Doe", property: "Highland Park", phone: "(555) 234-5678", email: "jane@example.com", moveIn: "Jun 01, 2024", status: "good", rentPaid: true },
  { id: 3, name: "Bob Johnson", property: "Downtown Lofts", phone: "(555) 345-6789", email: "bob@example.com", moveIn: "Sep 10, 2023", status: "warning", rentPaid: false },
];

export default function LandlordTenants() {
  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Tenants</h1>
            <p className="text-muted-foreground">Manage your current tenant relationships</p>
          </div>
          <div className="flex gap-2 max-w-xs">
            <Input placeholder="Search tenants..." data-testid="input-search-tenants" className="flex-1" />
            <Button variant="outline" data-testid="button-search-tenants">Search</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow" data-testid={`card-tenant-${tenant.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.name}`} />
                    <AvatarFallback>{tenant.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" data-testid={`text-tenant-name-${tenant.id}`}>{tenant.name}</h3>
                    <p className="text-xs text-muted-foreground">{tenant.property}</p>
                  </div>
                  <Badge 
                    variant={tenant.status === "good" ? "default" : "destructive"}
                    data-testid={`status-tenant-${tenant.id}`}
                  >
                    {tenant.status === "good" ? "✓ Good" : "⚠ Alert"}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground" data-testid={`text-tenant-phone-${tenant.id}`}>
                    <Phone className="w-4 h-4" />
                    <span>{tenant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground" data-testid={`text-tenant-email-${tenant.id}`}>
                    <Mail className="w-4 h-4" />
                    <span>{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground" data-testid={`text-tenant-movein-${tenant.id}`}>
                    <Clock className="w-4 h-4" />
                    <span>Moved in {tenant.moveIn}</span>
                  </div>
                </div>

                {!tenant.rentPaid && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-700 text-xs font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Rent payment overdue
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" data-testid={`button-message-tenant-${tenant.id}`}>
                    <MessageCircle className="w-4 h-4 mr-1" /> Message
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" data-testid={`button-details-tenant-${tenant.id}`}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
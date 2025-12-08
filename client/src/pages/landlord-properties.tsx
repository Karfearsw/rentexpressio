import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, MapPin, DollarSign, Users, Calendar } from "lucide-react";

const properties = [
  { id: 1, name: "Sunset Boulevard Apts", address: "123 Sunset Blvd, LA, CA", units: 12, rent: 24500, occupancy: "92%", status: "Active" },
  { id: 2, name: "Highland Park House", address: "456 Oak St, Austin, TX", units: 1, rent: 3200, occupancy: "100%", status: "Active" },
  { id: 3, name: "Downtown Lofts", address: "789 Main St, NYC, NY", units: 8, rent: 18400, occupancy: "75%", status: "Active" },
];

export default function LandlordProperties() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Properties</h1>
            <p className="text-muted-foreground">Manage your rental properties and listings</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg"><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Property Name</Label>
                    <Input id="name" placeholder="e.g., Sunset Boulevard Apts" data-testid="input-property-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Full address" data-testid="input-property-address" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units">Number of Units</Label>
                    <Input id="units" type="number" placeholder="1" data-testid="input-property-units" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent">Monthly Rent ($)</Label>
                    <Input id="rent" type="number" placeholder="2500" data-testid="input-property-rent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Property details..." data-testid="input-property-description" />
                </div>
                <Button className="w-full" data-testid="button-create-property">Create Property</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Units</TableHead>
                <TableHead className="text-center">Monthly Rent</TableHead>
                <TableHead className="text-center">Occupancy</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((prop) => (
                <TableRow key={prop.id}>
                  <TableCell className="font-bold">{prop.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> {prop.address}</TableCell>
                  <TableCell className="text-center"><Badge variant="secondary">{prop.units}</Badge></TableCell>
                  <TableCell className="text-center font-bold text-green-600">${prop.rent.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={prop.occupancy === "100%" ? "bg-green-500" : "bg-blue-500"}>{prop.occupancy}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" data-testid={`button-edit-property-${prop.id}`}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" data-testid={`button-delete-property-${prop.id}`}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
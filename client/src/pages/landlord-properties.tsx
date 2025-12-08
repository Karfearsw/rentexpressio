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
import { Plus, Edit2, Trash2, MapPin, DollarSign } from "lucide-react";

const properties = [
  { id: 1, name: "Sunset Boulevard Apts", address: "123 Sunset Blvd, LA, CA", units: 12, rent: 24500, occupancy: "92%", status: "Active" },
  { id: 2, name: "Highland Park House", address: "456 Oak St, Austin, TX", units: 1, rent: 3200, occupancy: "100%", status: "Active" },
  { id: 3, name: "Downtown Lofts", address: "789 Main St, NYC, NY", units: 8, rent: 18400, occupancy: "75%", status: "Active" },
];

export default function LandlordProperties() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">Properties</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage your rental properties and listings</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs sm:text-sm"><Plus className="w-3 sm:w-4 h-3 sm:h-4 mr-1" /> Add Property</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full mx-2 sm:mx-0">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Property Name</Label>
                    <Input id="name" placeholder="e.g., Sunset Boulevard Apts" data-testid="input-property-name" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs sm:text-sm">Address</Label>
                    <Input id="address" placeholder="Full address" data-testid="input-property-address" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units" className="text-xs sm:text-sm">Number of Units</Label>
                    <Input id="units" type="number" placeholder="1" data-testid="input-property-units" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent" className="text-xs sm:text-sm">Monthly Rent ($)</Label>
                    <Input id="rent" type="number" placeholder="2500" data-testid="input-property-rent" className="h-9 sm:h-10 text-xs sm:text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
                  <Textarea id="description" placeholder="Property details..." data-testid="input-property-description" />
                </div>
                <Button className="w-full text-xs sm:text-sm" data-testid="button-create-property">Create Property</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {properties.map((prop) => (
            <Card key={prop.id} data-testid={`card-property-${prop.id}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-sm">{prop.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {prop.address}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{prop.units} unit{prop.units !== 1 ? 's' : ''}</span>
                    <Badge className={`text-xs ${prop.occupancy === "100%" ? "bg-green-500" : "bg-blue-500"}`}>{prop.occupancy}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-green-600">${prop.rent.toLocaleString()}/mo</span>
                    <Badge variant="secondary" className="text-xs">{prop.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" data-testid={`button-edit-property-${prop.id}`}>Edit</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-red-600" data-testid={`button-delete-property-${prop.id}`}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Property</TableHead>
                  <TableHead className="text-xs">Address</TableHead>
                  <TableHead className="text-center text-xs">Units</TableHead>
                  <TableHead className="text-center text-xs">Monthly Rent</TableHead>
                  <TableHead className="text-center text-xs">Occupancy</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((prop) => (
                  <TableRow key={prop.id}>
                    <TableCell className="font-bold text-xs sm:text-sm">{prop.name}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">{prop.address}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary" className="text-xs">{prop.units}</Badge></TableCell>
                    <TableCell className="text-center font-bold text-green-600 text-xs sm:text-sm">${prop.rent.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${prop.occupancy === "100%" ? "bg-green-500" : "bg-blue-500"}`}>{prop.occupancy}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-edit-property-${prop.id}`}><Edit2 className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-delete-property-${prop.id}`}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
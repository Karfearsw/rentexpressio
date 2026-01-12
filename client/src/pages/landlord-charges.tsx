import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus,
  Receipt,
  Mail,
  Bell,
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Send
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Lease, Charge } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ChargeWithDetails extends Charge {
  tenantName?: string;
  propertyName?: string;
}

export default function LandlordCharges() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: charges, isLoading: loadingCharges } = useQuery<ChargeWithDetails[]>({
    queryKey: ["/api/charges"]
  });
  
  const { data: leases, isLoading: loadingLeases } = useQuery<Lease[]>({
    queryKey: ["/api/leases"]
  });

  const [newCharge, setNewCharge] = useState({
    leaseId: "",
    tenantId: "",
    description: "",
    amount: "",
    chargeDate: "",
    dueDate: "",
    category: "rent"
  });

  const createChargeMutation = useMutation({
    mutationFn: async (data: typeof newCharge) => {
      return apiRequest("POST", "/api/charges", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/charges"] });
      setDialogOpen(false);
      setNewCharge({
        leaseId: "",
        tenantId: "",
        description: "",
        amount: "",
        chargeDate: "",
        dueDate: "",
        category: "rent"
      });
      toast({ title: "Charge created", description: "The charge has been scheduled successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create charge", variant: "destructive" });
    }
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: "invoice" | "reminder" | "receipt" }) => {
      return apiRequest("POST", `/api/charges/${id}/send-notification`, { type });
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/charges"] });
      toast({ title: "Notification sent", description: `${type.charAt(0).toUpperCase() + type.slice(1)} notification sent to tenant.` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    }
  });

  const deleteChargeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/charges/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/charges"] });
      toast({ title: "Charge deleted" });
    }
  });

  const handleLeaseSelect = (leaseId: string) => {
    const lease = leases?.find(l => l.id === leaseId);
    setNewCharge(prev => ({
      ...prev,
      leaseId,
      tenantId: lease?.tenantId || "",
      amount: lease?.rent || ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChargeMutation.mutate(newCharge);
  };

  const isLoading = loadingCharges || loadingLeases;

  if (isLoading) {
    return (
      <DashboardLayout type="landlord">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const scheduledCharges = charges?.filter(c => c.status === "scheduled") || [];
  const processedCharges = charges?.filter(c => c.status !== "scheduled") || [];

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Charges</h1>
            <p className="text-sm text-muted-foreground">Schedule and manage tenant charges with automatic email notifications.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-charge">
                <Plus className="w-4 h-4 mr-2" />
                Add Charge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Charge</DialogTitle>
                <DialogDescription>Schedule a charge for a tenant. Email notifications will be sent automatically.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lease">Select Lease</Label>
                  <Select value={newCharge.leaseId} onValueChange={handleLeaseSelect}>
                    <SelectTrigger data-testid="select-lease">
                      <SelectValue placeholder="Choose a lease" />
                    </SelectTrigger>
                    <SelectContent>
                      {leases?.map(lease => (
                        <SelectItem key={lease.id} value={lease.id}>
                          Lease #{lease.id.substring(0, 8)} - ${lease.rent}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newCharge.category} onValueChange={(v) => setNewCharge(prev => ({ ...prev, category: v }))}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="late_fee">Late Fee</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newCharge.amount}
                      onChange={(e) => setNewCharge(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      data-testid="input-amount"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newCharge.description}
                    onChange={(e) => setNewCharge(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Monthly rent for January 2026"
                    data-testid="input-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chargeDate">Charge Date</Label>
                    <Input
                      id="chargeDate"
                      type="date"
                      value={newCharge.chargeDate}
                      onChange={(e) => setNewCharge(prev => ({ ...prev, chargeDate: e.target.value }))}
                      data-testid="input-charge-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newCharge.dueDate}
                      onChange={(e) => setNewCharge(prev => ({ ...prev, dueDate: e.target.value }))}
                      data-testid="input-due-date"
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Automatic Email Notifications</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><Mail className="w-3 h-3" /> Invoice sent on charge date</li>
                    <li className="flex items-center gap-2"><Bell className="w-3 h-3" /> Reminder sent 3 days before due date</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Receipt sent when paid</li>
                  </ul>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={createChargeMutation.isPending} data-testid="button-create-charge">
                    {createChargeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Charge
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledCharges.length}</div>
              <p className="text-xs text-muted-foreground">Upcoming charges</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
              <Receipt className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${scheduledCharges.reduce((sum, c) => sum + Number(c.amount || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Pending collection</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processedCharges.length}</div>
              <p className="text-xs text-muted-foreground">Completed charges</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Scheduled Charges</CardTitle>
            <CardDescription>Upcoming charges with notification status</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Charge Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Notifications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledCharges.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No scheduled charges. Click "Add Charge" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                  {scheduledCharges.map((charge) => (
                    <TableRow key={charge.id} data-testid={`row-charge-${charge.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-muted-foreground" />
                          {charge.description}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">{charge.category}</Badge>
                      </TableCell>
                      <TableCell>{charge.tenantName || `Tenant #${charge.tenantId?.substring(0, 8)}`}</TableCell>
                      <TableCell>${Number(charge.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {charge.chargeDate}
                        </div>
                      </TableCell>
                      <TableCell>{charge.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant={charge.invoiceSent === "true" ? "default" : "outline"} className="text-xs">
                            Invoice {charge.invoiceSent === "true" ? "✓" : ""}
                          </Badge>
                          <Badge variant={charge.reminderSent === "true" ? "default" : "outline"} className="text-xs">
                            Reminder {charge.reminderSent === "true" ? "✓" : ""}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => sendNotificationMutation.mutate({ id: charge.id, type: "invoice" })}
                            disabled={charge.invoiceSent === "true"}
                            data-testid={`button-send-invoice-${charge.id}`}
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteChargeMutation.mutate(charge.id)}
                            data-testid={`button-delete-charge-${charge.id}`}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

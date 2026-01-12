import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Lease, Payment, Property } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function LandlordDashboard() {
  const { data: properties, isLoading: loadingProps } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const { data: leases, isLoading: loadingLeases } = useQuery<Lease[]>({ queryKey: ["/api/leases"] });
  const { data: payments, isLoading: loadingPayments } = useQuery<Payment[]>({ queryKey: ["/api/payments"] });

  const isLoading = loadingProps || loadingLeases || loadingPayments;

  if (isLoading) {
    return (
      <DashboardLayout type="landlord">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculations for ROI Dashboard
  const totalRentExpected = leases?.reduce((sum, l) => sum + Number(l.rent), 0) || 0;
  const totalCollected = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const collectionRate = totalRentExpected > 0 ? Math.round((totalCollected / totalRentExpected) * 100) : 0;
  
  const activeLeases = leases?.filter(l => l.status === 'active').length || 0;
  const latePayments = payments?.filter(p => p.status === 'overdue').length || 0;

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Rent Collection Center</h1>
            <p className="text-sm text-muted-foreground">Real-time financial performance and ROI tracking.</p>
          </div>
          <Button>
            <DollarSign className="w-4 h-4 mr-2" />
            Process Payout
          </Button>
        </div>

        {/* ROI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collectionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Target: 95% (ROI Phase 1)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCollected.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Expected: ${totalRentExpected.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLeases}</div>
              <p className="text-xs text-muted-foreground">
                {properties?.length || 0} Properties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latePayments}</div>
              <p className="text-xs text-muted-foreground">
                Action required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Rent Roll */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Live Rent Roll</CardTitle>
            <CardDescription>Current month payment status by unit</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Rent Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No active leases found. Add properties and leases to see data.
                    </TableCell>
                  </TableRow>
                )}
                {leases?.map((lease) => {
                  // Find payment for this lease for current month (mock logic for MVP)
                  const payment = payments?.find(p => p.leaseId === lease.id);
                  const property = properties?.find(p => p.id === lease.propertyId);
                  
                  return (
                    <TableRow key={lease.id}>
                      <TableCell className="font-medium">Tenant #{lease.tenantId.substring(0, 8)}</TableCell>
                      <TableCell>{property?.name || "Unknown Property"}</TableCell>
                      <TableCell>${lease.rent}</TableCell>
                      <TableCell>
                        {payment ? (
                          <Badge className={payment.status === 'paid' ? "bg-green-500" : "bg-red-500"}>
                            {payment.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Clock className="w-3 h-3 mr-1" /> Due
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>1st of Month</TableCell>
                      <TableCell className="text-right">
                        {!payment && <Button size="sm" variant="ghost">Send Reminder</Button>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

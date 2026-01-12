import React, { useState } from "react";
import { TenantLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Calendar, CreditCard, Building, Loader2, FileText, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Lease, Payment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function TenantPay() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: leases, isLoading: loadingLeases } = useQuery<Lease[]>({ queryKey: ["/api/leases"] });
  const { data: payments, isLoading: loadingPayments } = useQuery<Payment[]>({ queryKey: ["/api/payments"] });

  const payMutation = useMutation({
    mutationFn: async (amount: string) => {
      const res = await apiRequest("POST", "/api/payments", {
        amount,
        dueDate: new Date().toISOString()
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({
        title: "Payment Successful",
        description: "Your rent payment has been processed.",
      });
    },
  });

  const autopayMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await apiRequest("PATCH", "/api/leases/autopay", { enabled });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leases"] });
      toast({
        title: "Autopay Updated",
        description: "Your autopay settings have been saved.",
      });
    },
  });

  if (loadingLeases || loadingPayments) {
    return (
      <TenantLayout>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </TenantLayout>
    );
  }

  const currentLease = leases?.[0];
  
  // Determine if paid this month
  const currentMonth = new Date().getMonth();
  const paidThisMonth = payments?.some(p => new Date(p.date || "").getMonth() === currentMonth && p.status === 'paid');
  
  const amountDue = paidThisMonth ? 0 : Number(currentLease?.rent || 0);

  const handlePay = () => {
    if (amountDue > 0) {
      payMutation.mutate(amountDue.toString());
    }
  };

  const handleReceipt = (id: string) => {
    window.open(`/api/payments/${id}/receipt`, '_blank');
  };

  return (
    <TenantLayout>
      <div className="section-spacing">
        <h1 className="text-2xl font-heading font-bold text-gradient">Rent Payments</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Next Payment & Breakdown */}
          <div className="lg:col-span-2 section-spacing">
            <Card className="border-l-4 border-l-primary bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Next Payment</CardTitle>
                  {amountDue > 0 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                      Due in 7 days
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {amountDue > 0 ? "Upcoming rent payment" : "You're all paid up!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Amount Due</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${amountDue.toLocaleString()}</span>
                      <span className="text-muted-foreground">.00</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: January 15, 2025</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[200px]">
                     <Button 
                      size="lg" 
                      onClick={handlePay}
                      disabled={amountDue <= 0 || payMutation.isPending}
                      className="w-full"
                    >
                      {payMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                      ) : amountDue > 0 ? (
                        <><CreditCard className="w-4 h-4 mr-2" /> Pay with Card</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Paid</>
                      )}
                    </Button>
                    {amountDue > 0 && (
                      <Button variant="outline" size="lg" className="w-full">
                        <Building className="w-4 h-4 mr-2" /> Pay with ACH
                      </Button>
                    )}
                  </div>
                </div>

                {currentLease && (
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label htmlFor="autopay" className="text-base font-medium">Autopay</Label>
                      <div className="text-sm text-muted-foreground">
                        {currentLease.autopayEnabled === "true" 
                          ? "Payment scheduled for Jan 15" 
                          : "Automatically pay rent on due date"}
                      </div>
                    </div>
                    <Switch
                      id="autopay"
                      checked={currentLease.autopayEnabled === "true"}
                      onCheckedChange={(checked) => autopayMutation.mutate(checked)}
                      disabled={autopayMutation.isPending}
                    />
                  </div>
                )}

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="breakdown" className="border-none">
                    <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline py-2">
                      View Payment Breakdown
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Rent</span>
                          <span>${currentLease?.rent || "0"}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Utilities (Water/Trash)</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Parking Fee</span>
                          <span>$0.00</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                          <span>Total</span>
                          <span>${currentLease?.rent || "0"}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                          No payment history found.
                        </TableCell>
                      </TableRow>
                    )}
                    {payments?.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date || "").toLocaleDateString()}</TableCell>
                        <TableCell>Rent Payment</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> Visa ••4242
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            Paid
                          </Badge>
                        </TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleReceipt(payment.id)}>
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Mocked Saved Cards */}
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded border border-blue-100">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Visa ending in 4242</div>
                        <div className="text-xs text-muted-foreground">Expires 12/25</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded border">
                        <Building className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Chase Checking</div>
                        <div className="text-xs text-muted-foreground">•••• 8888</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full dashed border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 border-blue-100">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-1">Secure Payments</h4>
                <p className="text-xs text-blue-700">
                  All payments are processed securely. Your financial information is encrypted and never stored on our servers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

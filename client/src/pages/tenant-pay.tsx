import React, { useState } from "react";
import { MobileLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar, CreditCard, Building } from "lucide-react";

export default function TenantPay() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <MobileLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-heading font-bold">Pay Rent</h1>

        {/* Current Balance */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-xl">
          <p className="text-sm opacity-90 mb-1">Amount Due</p>
          <h2 className="text-4xl font-bold mb-4">$2,450.00</h2>
          <div className="flex items-center gap-2 text-sm opacity-90 mb-6">
            <Calendar className="w-4 h-4" />
            <span>Due: Nov 5, 2025</span>
          </div>
          <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold rounded-xl" data-testid="button-pay-now-rent">
            Pay Now
          </Button>
        </div>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" data-testid="option-card-payment">
              <input
                type="radio"
                name="method"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Credit/Debit Card</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" data-testid="option-ach-payment">
              <input
                type="radio"
                name="method"
                value="ach"
                checked={paymentMethod === "ach"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Building className="w-5 h-5" />
              <span className="font-medium">Bank Account (ACH)</span>
            </label>
          </CardContent>
        </Card>

        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <Card data-testid="form-card-payment">
            <CardHeader>
              <CardTitle className="text-lg">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input id="cardName" placeholder="John Doe" data-testid="input-card-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="4111 1111 1111 1111" data-testid="input-card-number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" data-testid="input-card-expiry" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" data-testid="input-card-cvv" />
                </div>
              </div>
              <Button className="w-full" data-testid="button-process-card-payment">Pay $2,450.00</Button>
            </CardContent>
          </Card>
        )}

        {/* ACH Payment Form */}
        {paymentMethod === "ach" && (
          <Card data-testid="form-ach-payment">
            <CardHeader>
              <CardTitle className="text-lg">Bank Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="Your Bank" data-testid="input-bank-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="routing">Routing Number</Label>
                  <Input id="routing" placeholder="123456789" data-testid="input-routing-number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account Number</Label>
                  <Input id="account" placeholder="987654321" data-testid="input-account-number" />
                </div>
              </div>
              <Button className="w-full" data-testid="button-process-ach-payment">Pay $2,450.00</Button>
            </CardContent>
          </Card>
        )}

        {/* Past Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">October Rent</p>
                  <p className="text-xs text-muted-foreground">Oct 1, 2025</p>
                </div>
              </div>
              <span className="font-bold">-$2,450</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">September Rent</p>
                  <p className="text-xs text-muted-foreground">Sep 1, 2025</p>
                </div>
              </div>
              <span className="font-bold">-$2,450</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}